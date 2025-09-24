const mongoose = require("mongoose");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// step-1: send otp
exports.sendOtp = async (req, res) => {
  try {
    console.log("📩 Incoming request to send OTP...");

    const { email } = req.body;
    console.log(`👤 Email received: ${email}`);

    let user = await User.findOne({ email });
    if (!user) {
      console.log("🆕 No user found, creating a new one...");
      user = await User.create({ email });
    } else {
      console.log("✅ Existing user found.");
    }

    const otp = "1234"; // you’ll later replace this with a generated OTP
    console.log(`🔐 Generated OTP: ${otp}`);

    user.otp = otp;
    user.otpExpires = Date.now();
    await user.save();
    console.log("💾 OTP saved to database successfully.");

    res.json({ message: "📧 Otp sent to email successfully!!" });
    console.log("🚀 Response sent back to client.");
  } catch (error) {
    console.error("❌ Error in sendOtp controller:", error.message);
    res
      .status(500)
      .json({ message: "⚠️ Something went wrong while sending OTP" });
  }
};

// step-2: verify otp & login
exports.vertifyOtp = async (req, res) => {
  try {
    console.log("📩 Incoming request to verify OTP...");

    const { email, otp } = req.body;
    console.log(`👤 Email received: ${email}`);
    console.log(`🔢 OTP received: ${otp}`);

    const user = await User.findOne({ email });
    console.log("🔍 Searching user in DB...");

    if (!user || !user.otp) {
      console.log("❌ User not found or OTP missing.");
      return res.status(400).json({ message: "Invalid Request!!" });
    }

    console.log("✅ User found and OTP exists.");

    user.otp = null;
    user.otpExpires = null;
    console.log("🗑️ OTP cleared from user record.");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log("🔑 Tokens generated successfully.");

    user.refreshToken = refreshToken;
    console.log("💾 Refresh token set on user object.");

    await user.save();
    console.log("📦 User saved to DB with refresh token.");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    console.log("🍪 Access token set in cookie.");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    console.log("🍪 Refresh token set in cookie.");

    res.json({ message: "Login Successfull" });
    console.log("🚀 Response sent to client: Login Successfull");
  } catch (error) {
    console.error("❌ Error in verifyOtp controller:", error.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

//step-3: Refresh token
exports.refresh = async(req,res) => {
   const {refreshToken} = req.cookies;
   if(!refreshToken) return res.status(401).json({error:"No token"})

    const user = await User.findOne({refreshToken})
    if(!user) return res.status(403).json({error:"Invalid token"})

    const jwt = require("jsonwebtoken")
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({error:"Token Expred"});

        const accessToken = generateAccessToken(decoded.id);
        res.cookie("accessToken", accessToken, {
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        });
        res.json({message:"Token Refreshed",user, accessToken});
    })
}   

//step-4: logout
exports.logout = async(req, res) => {
    const {refreshToken} = req.cookies;
    await User.updateOne({refreshToken},{$unset:{refreshToken:1}});
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({message:"Logout Successfully"})
}