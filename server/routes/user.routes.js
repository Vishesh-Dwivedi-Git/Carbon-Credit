import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controllers.js';
import { authenticateToken } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.get('/user-profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
