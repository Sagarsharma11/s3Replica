import mongoose from 'mongoose';

const bucketSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  userId: { type: String, required: true }
});

const Bucket = mongoose.model('Bucket', bucketSchema);
export default Bucket;