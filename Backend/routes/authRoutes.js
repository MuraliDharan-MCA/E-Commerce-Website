import express from 'express';
import { login, logout, signup , refreshToken, getProfile} from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const Authroute = express.Router();

Authroute.post('/signup',signup)

Authroute.post('/login',login)

Authroute.post('/logout',logout)

Authroute.post('/refresh-token',refreshToken);

Authroute.get('/profile',protectRoute,getProfile)

export default Authroute