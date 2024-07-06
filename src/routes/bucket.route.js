import express from "express";
import {
  createBucket,
  listBuckets,
  updateBucket,
  deleteBucket,
} from "../controllers/bucket.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBucket);
router.get("/:userId", protect, listBuckets);
router.put("/:id", protect, updateBucket);
router.delete("/:id", protect, deleteBucket);

export default router;
