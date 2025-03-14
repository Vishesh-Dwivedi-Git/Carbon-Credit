import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controllers.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

export default router;
