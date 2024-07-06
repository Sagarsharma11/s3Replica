import File from "../models/file.model.js";
import Bucket from "../models/bucket.model.js";
import path from "path";
import fs from "fs";

const uploadFile = async (req, res) => {
  try {
    const { bucketId } = req.body;
    
    const bucket = await Bucket.findById(bucketId);
    if (!bucket) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Bucket not found",
      });
    }

    const file = new File({
      filename: req.file.filename,
      url: path.join(
        "/public/buckets",
        bucket.userId.toString(),
        bucket.name,
        req.file.filename
      ),
      bucketId,
    });

    await file.save();
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById({ _id: id });
    if (!file) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "File not found",
      });
    }

    // Construct the absolute file path
    const filePath = path.join(process.cwd(), file.url);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      res.status(500).json({ message: "Internal server error" });
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.filename}`
    );
    fileStream.pipe(res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const listFiles = async (req, res) => {
  try {
    const { bucketId } = req.params;
    const files = await File.find({ bucketId });

    if (!files)
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Files not found",
      });
    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Files list fetched successfully",
      data: files,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const files = await File.findOne({ _id: id });
    if (!files)
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "File is not available",
      });
    // Construct the absolute file path
    const filePath = path.join(process.cwd(), files.url);
    // Delete the file from the file system
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "File not found on server",
      });
    }
    await File.findByIdAndDelete({ _id: id });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "file deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

export { getFile, listFiles, uploadFile, deleteFile };
