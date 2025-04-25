import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getCoupon, validateCoupon } from '../controllers/couponController.js';

const couponRoutes = express.Router();


couponRoutes.get('/',protectRoute,getCoupon)
couponRoutes.post('/validate',protectRoute,validateCoupon)


export default couponRoutes;