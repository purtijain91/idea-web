const express = require('express');
const router = express.Router()
const { sendOtp, vertifyOtp, refresh, logout } = require('../controllers/authController')

router.post("/send-otp", sendOtp)
router.post("/verify-otp", vertifyOtp)
router.get("/refresh", refresh);
router.post("/logout", logout);

module.exports = router