import express from 'express';
import { createBucket, listBuckets } from '../controllers/bucket.controller.js';

const router = express.Router();

router.post('/', createBucket);
router.get('/:userId', listBuckets);

export default router;
