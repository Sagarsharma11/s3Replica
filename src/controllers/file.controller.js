import File from "../models/file.model.js";
import multer from "multer";
import path from "path";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { bucketId } = req.body;
      const file = new File({
        filename: req.file.filename,
        url: path.join(process.cwd()+"/public/uploads/", req.file.filename),
        bucketId,
      });
      await file.save();
      res.status(201).json(file);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// const getFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const file = await File.findById(id);
//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }
//     const filePath = file.url;
//     res.sendFile(filePath);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    const filePath =file.url;
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      res.status(500).json({ message: 'Internal server error' });
    });

    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listFiles = async (req, res) => {
  try {
    const { bucketId } = req.params;
    const files = await File.find({ bucketId });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getFile, listFiles, uploadFile };
