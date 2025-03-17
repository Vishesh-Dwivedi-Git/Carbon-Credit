import express from 'express';
import { mintToken } from '../controllers/mint.controller.js';

const router = express.Router();

// POST route to mint tokens
router.post('/mint', mintToken);

export default router;
