import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies['access-token'];

    console.log(accessToken);
    

    if (!accessToken) {
      return res
        .status(401)
        .json({ messgae: "Unauthorized - No Access Token Provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ messgae: "User No Found" });
      }

      req.user = user;

      next();
    } catch (error) {
     if(error.name === 'TokenExpiredError'){
          return res.status(401).json({messgae:"Unauthorized - Access Token Expired"})
     }
     throw error
    }
  } catch (error) {
    console.log("Error in protectRoute Middlerware",error.message);
    return res
      .status(401)
      .json({ messgae: "Unauthorized - Invalid access token" });
  }
};



export const adminRoute = async(req,res,next) =>{
     if(req.user && req.user.role === "admin"){
          next();
     }else{
          return res.status(403).json({message:'Access Denied - Admin Only'})
     }
}