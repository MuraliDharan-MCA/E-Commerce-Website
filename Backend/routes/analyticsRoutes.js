import exprees from 'express'
import { adminRoute, protectRoute } from '../middleware/authMiddleware.js';
import { getAnalyticsData, getDaliySalesData } from '../controllers/analyticsController.js';

const analyticsRoutes = exprees.Router();

analyticsRoutes.get('/',protectRoute,adminRoute,async(req,res)=>{
try {
     const analyticsData = await getAnalyticsData();

     const endDate = new Date();
     
     const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

     const dailySalesData = await getDaliySalesData(startDate,endDate);

     res.json({
          analyticsData,
          dailySalesData
     })
} catch (error) {
     console.log('Error in analytics route',error.message);
     res.status(500).json({message:'Server Error',error:error.message})
}
})


export default analyticsRoutes;