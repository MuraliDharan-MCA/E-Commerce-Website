import express from 'express'
import { protectRoute } from '../middleware/authMiddleware.js'
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cartController.js'

const cartRoutes = express.Router()

cartRoutes.get('/',protectRoute,getCartProducts)
cartRoutes.post('/',protectRoute,addToCart)
cartRoutes.delete('/',protectRoute,removeAllFromCart)
cartRoutes.put('/:id',protectRoute,updateQuantity)



export default cartRoutes