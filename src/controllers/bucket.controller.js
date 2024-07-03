import Bucket from "../models/bucket.model.js";
import { uuid } from "uuidv4";

const createBucket = async (req, res) => {
  try {
    const { name, userId } = req.body;
    // check the user have same name bucket available

    const isBucketExists = await Bucket.findOne({userId, name});

    if(isBucketExists) return res.status(400).send({ statusCode: 400, message: "Bucket name is already available" });

    const bucket = await Bucket.create({ name, userId });
    res.status(201).json(bucket);
  } catch (error) {
    res.status(500).json({status:"error status", message: error.message });
  }
};

 const listBuckets = async (req, res) => {
  try {
    const { userId } = req.params;
    const buckets = await Bucket.find({ userId });
    res.status(200).json(buckets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {createBucket, listBuckets}