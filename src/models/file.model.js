import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  bucketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bucket', required: true }
});

const File = mongoose.model('File', fileSchema);
export default File;