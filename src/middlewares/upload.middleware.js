import fs from "fs";
import path from "path";
import multer from "multer";
import Bucket from "../models/bucket.model.js";


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { bucketId } = req.body;
      const bucket = await Bucket.findById({_id:bucketId});
      if (!bucket) {
        return cb(new Error("Bucket not found"));
      }

      const dirPath = path.join(process.cwd(), 'public', 'buckets', bucket.userId, bucket.name);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      cb(null, dirPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export {upload}
