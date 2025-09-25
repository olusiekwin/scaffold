const express = require("express")
const corsMiddleware = require("./middleware/cors")
const logger = require("./middleware/logger")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(corsMiddleware)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(logger)

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/tokens", require("./routes/tokens"))
app.use("/api/labs", require("./routes/labs"))

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "EdTech Platform API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  })
})

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  const apiDocs = {
    title: "EdTech Platform API",
    version: "1.0.0",
    description: "API for EdTech platform with video lessons, AI voice labs, and token-based access",
    endpoints: {
      auth: {
        "POST /api/auth/send-otp": "Send OTP to phone number",
        "POST /api/auth/verify-otp": "Verify OTP and login",
        "GET /api/auth/profile/:phoneNumber": "Get user profile",
      },
      tokens: {
        "GET /api/tokens/balance/:phoneNumber": "Get token balance",
        "POST /api/tokens/recharge": "Recharge tokens via USSD",
        "POST /api/tokens/deduct": "Deduct tokens for services",
        "GET /api/tokens/history/:phoneNumber": "Get transaction history",
      },
      labs: {
        "POST /api/labs/voice": "Start voice lab session",
        "POST /api/labs/video": "Start video chat session",
        "POST /api/labs/end-session": "End active session",
        "GET /api/labs/sessions/:phoneNumber": "Get user sessions",
        "GET /api/labs/session/:sessionId": "Get session details",
      },
    },
  }

  res.json(apiDocs)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  console.error("Stack:", err.stack)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    availableEndpoints: "/api/docs",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 EdTech Platform API Server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
