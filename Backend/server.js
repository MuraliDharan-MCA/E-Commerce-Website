import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js';
import path from "path"
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __dirname = path.resolve()

app.use(express.json({limit:'10mb'}))
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/coupons',couponRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/api/analytics',analyticsRoutes)


if(process.env.NODE_ENV === "production"){
     app.use(express.static(path.join(__dirname,'/Frontend/dist')))

     app.get("*",(req,res)=>{
          res.sendFile(path.resolve(__dirname,"Frontend","dist","index.html"))
     })
}




app.listen(PORT,()=>{
     console.log(`Server is runing on http://localhost:${PORT}`);
     connectDB();
})