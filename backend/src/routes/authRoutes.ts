import { Router } from 'express';
import { loginUser, registerUser, googleLogin } from '../controllers/authController';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/google', googleLogin);

export default router;
