const express = require("express")
const router = express.Router()

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map()
const users = new Map()

// Generate random OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Send OTP
router.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    })
  }

  const otp = generateOTP()

  // Store OTP with expiration (5 minutes)
  otpStorage.set(phoneNumber, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  })

  console.log(`OTP for ${phoneNumber}: ${otp} (expires in 5 minutes)`)

  // In production, send actual SMS via Africa's Talking or similar service
  console.log(`SMS would be sent to ${phoneNumber}: Your EdTech Platform OTP is ${otp}`)

  res.json({
    success: true,
    message: "OTP sent successfully",
    phoneNumber,
    // In demo mode, include OTP in response for testing
    ...(process.env.NODE_ENV === "development" && { otp }),
  })
})

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP are required",
    })
  }

  const storedOtpData = otpStorage.get(phoneNumber)

  if (!storedOtpData) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired",
    })
  }

  if (Date.now() > storedOtpData.expires) {
    otpStorage.delete(phoneNumber)
    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    })
  }

  // In demo mode, accept any 4-digit OTP
  const isValidOtp = process.env.NODE_ENV === "development" ? otp.length === 4 : otp === storedOtpData.otp

  if (!isValidOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    })
  }

  // Clear OTP after successful verification
  otpStorage.delete(phoneNumber)

  // Create or get user
  let user = users.get(phoneNumber)
  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      phoneNumber,
      createdAt: new Date().toISOString(),
      tokens: 100, // Starting balance
    }
    users.set(phoneNumber, user)
  }

  // Update last login
  user.lastLogin = new Date().toISOString()

  console.log(`User ${phoneNumber} logged in successfully`)

  res.json({
    success: true,
    message: "OTP verified successfully",
    user,
  })
})

// Get user profile
router.get("/profile/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params

  const user = users.get(phoneNumber)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  res.json({
    success: true,
    user,
  })
})

module.exports = router
