import Bucket from "../models/bucket.model.js";
import File from "../models/file.model.js";
import fs from "fs";
import path from "path";

const createBucket = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const isBucketExists = await Bucket.findOne({ userId, name });
    if (isBucketExists)
      return res
        .status(400)
        .send({
          statusCode: 400,
          success: false,
          message: "Bucket name is already available",
        });
    fs.mkdirSync(`${process.cwd()}/public/buckets/${userId}/${name}`, {
      recursive: true,
    });
    const bucket = await Bucket.create({ name, userId });
    if (!bucket)
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Bucket not created",
      });
    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Bucket created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const listBuckets = async (req, res) => {
  try {
    const { userId } = req.params;
    const buckets = await Bucket.find({ userId });
    if (!buckets.length)
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Bucket are not available",
      });
    return res.status(200).json({
      statusCode: 200,
      success: false,
      message: "Bucket fetched successfully",
      data: buckets,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const updateBucket = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    if(!newName)  return res.status(404).json({
      statusCode: 404,
      success: false,
      message: "newName is required",
    });
    // // Find the bucket by ID
    const bucket = await Bucket.findById(id);
    if (!bucket) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Bucket not found",
      });
    }

    // Check if a bucket with the new name already exists for the same user
    const existingBucket = await Bucket.findOne({
      userId: bucket.userId,
      name: newName,
    });

    if (existingBucket) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Bucket name is already available",
      });
    }

    // Define old and new directory paths
    const oldDirPath = path.join(
      process.cwd(),
      "public",
      "buckets",
      bucket.userId,
      bucket.name
    );
    const newDirPath = path.join(
      process.cwd(),
      "public",
      "buckets",
      bucket.userId,
      newName
    );

    // Rename the directory
    if (fs.existsSync(oldDirPath)) {
      fs.renameSync(oldDirPath, newDirPath);
    } else {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Bucket directory not found",
      });
    }

    // Update the bucket name in the database
    const updatedBucket = await Bucket.findByIdAndUpdate(
      id,
      { name: newName },
      { new: true }
    );

    if (!updatedBucket) {
      return res.status(501).json({
        statusCode: 501,
        success: false,
        message: "Bucket name is not updated",
      });
    }
    // Find all files with the given bucketId
    const filesToUpdate = await File.find({ bucketId: id });

    // Prepare the operations array for bulkWrite
    const bulkOps = filesToUpdate.map((file) => {
      const newUrl = path.join(
        "/public/buckets",
        bucket.userId,
        newName,
        file.filename
      );
      return {
        updateOne: {
          filter: { _id: file._id },
          update: { $set: { url: newUrl } },
        },
      };
    });

    // Perform bulk update operation
    const result = await File.bulkWrite(bulkOps);
    if (!result) {
      return res.status(501).json({
        statusCode: 501,
        success: true,
        message: "Failed to update paths on files",
        bucket,
      });
    }

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Bucket updated successfully",
      bucket,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

const deleteBucket = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the bucket by ID
    const bucket = await Bucket.findById(id);
    if (!bucket) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Bucket not found",
      });
    }

    // Define directory path to delete
    const dirPath = path.join(
      process.cwd(),
      "public",
      "buckets",
      bucket.userId,
      bucket.name
    );


    // Delete files associated with the bucket from the file system
    await File.deleteMany({ bucketId: id });

    // Attempt to delete the directory recursively
    fs.rmSync(dirPath, { recursive: true, force: true });

    // Delete the bucket from the database
    await Bucket.findByIdAndDelete(id);

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Bucket and associated files deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error\n ${error.message}`,
    });
  }
};

export { createBucket, listBuckets, deleteBucket, updateBucket };
