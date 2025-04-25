import exprees from 'express'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/productController.js';
import { adminRoute, protectRoute } from '../middleware/authMiddleware.js';

const productRoutes = exprees.Router()

productRoutes.get('/',protectRoute,adminRoute,getAllProducts)
productRoutes.get('/featured',getFeaturedProducts)
productRoutes.get('/category/:category',getProductByCategory)
productRoutes.get('/recommendations',getRecommendedProducts)
productRoutes.post('/',protectRoute,adminRoute,createProduct)
productRoutes.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct)
productRoutes.delete('/:id',protectRoute,adminRoute,deleteProduct)




export default productRoutes