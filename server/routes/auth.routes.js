import express from 'express';
import { register, login, refreshToken } from '../controllers/auth.controllers.js';
import { validateRegistration, validateLogin } from '../middlewares/authValidate.middlewares.js';

import { getUserProfile, updateUserProfile } from '../controllers/user.controllers.js';


const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);

// router.get('/profile', getUserProfile);
// router.put('/profile', updateUserProfile);

export default router;