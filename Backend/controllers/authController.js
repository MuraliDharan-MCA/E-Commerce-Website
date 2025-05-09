import { redis } from "../lib/redis.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, name, and password are required" });
    }

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateToken(user._id);

    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in Signup Controller", error.message);

    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!email || !password) {
      return res.json({messgae:"Email and password are required"});
    }
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);

      await storeRefreshToken(user._id, refreshToken);

      setCookies(res,accessToken,refreshToken)

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log("Error in Login Controller", error.message);

    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies['refresh-token'];
    
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const refreshToken = async (req,res) => {
  try {
    const refreshToken = req.cookies['access-token'];
    console.log(refreshToken);
    
    if (!refreshToken) {
      return res.status(401).json({ message: "no refresh token provide" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (refreshToken !== storedToken) {
      return res.status(401).json({ message: "Invalid refresh Token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({message:'Token refresh successfully'})
  } catch (error) {
    console.log('Error in Refresh Token Controller',error.message);
    res.status(500).json({message:'Server Error',error:error.message})
    
  }
};


export const getProfile  = async(req,res) =>{
  try {
    res.json(req.user)
  } catch (error) {
    console.log('error in Getprofile');
    res.status(500).json({message:'Server Error',error:error.message})    
  }
}
