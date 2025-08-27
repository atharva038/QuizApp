import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const existingUser = await User.findOne({$or: [{email}, {username}]});
    if (existingUser) {
      return res.status(400).json({message: "User already exists."});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "User registered successfully."});
  } catch (err) {
    res.status(500).json({message: "Server error."});
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: "Invalid credentials."});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Invalid credentials."});
    }
    const token = jwt.sign(
      {userId: user._id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({message: "Login successful"});
  } catch (err) {
    res.status(500).json({message: "Server error."});
  }
};

export const getMe = async (req, res) => {
  try {
    // Use req.user injected by auth middleware
    if (!req.user || !req.user.id)
      return res.status(401).json({message: "Not authenticated"});
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({message: "User not found"});
    res.json({user});
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({message: "Logged out successfully"});
};
