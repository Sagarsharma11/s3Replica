import mongoose from "mongoose"

const bucketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
});

export const Bucket = mongoose.model('Bucket', bucketSchema);
