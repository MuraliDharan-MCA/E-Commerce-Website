import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/paymentController.js';


const paymentRoutes = express.Router();

paymentRoutes.post('/create-checkout-session',protectRoute,createCheckoutSession)
paymentRoutes.post('/checkout-success',protectRoute,checkoutSuccess)


export default paymentRoutes