import express from 'express';
import { uploadFile, getFile, listFiles } from '../controllers/file.controller.js';

const router = express.Router();

router.post('/', uploadFile);
router.get('/:id', getFile);
router.get('/bucket/:bucketId', listFiles);

export default router;