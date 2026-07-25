import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, forgotPassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.post('/forgot-password', forgotPassword);

export default router;
