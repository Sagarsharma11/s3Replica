import express from "express";
import {
  uploadFile,
  getFile,
  listFiles,
  deleteFile,
} from "../controllers/file.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:id", protect, getFile);
router.get("/bucket/:bucketId", protect, listFiles);
router.delete("/:id", protect, deleteFile);

export default router;
