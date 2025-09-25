const express = require("express")
const router = express.Router()

// In-memory storage for demo purposes
const userTokens = new Map()
const transactions = []

// Initialize some demo data
userTokens.set("+1234567890", 100)
userTokens.set("+0987654321", 75)

// Get token balance
router.get("/balance/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params

  console.log(`Token balance request for: ${phoneNumber}`)

  const tokens = userTokens.get(phoneNumber) || 100 // Default balance for new users

  res.json({
    success: true,
    phoneNumber,
    tokens,
  })
})

// Recharge tokens via USSD simulation
router.post("/recharge", (req, res) => {
  const { phoneNumber, amount } = req.body

  console.log(`Token recharge for ${phoneNumber}: ${amount} tokens`)

  const currentTokens = userTokens.get(phoneNumber) || 100
  const newBalance = currentTokens + Number.parseInt(amount)

  userTokens.set(phoneNumber, newBalance)

  // Record transaction
  transactions.push({
    id: `txn_${Date.now()}`,
    type: "recharge",
    phoneNumber,
    amount: Number.parseInt(amount),
    timestamp: new Date().toISOString(),
  })

  res.json({
    success: true,
    message: "Recharge successful",
    phoneNumber,
    tokensAdded: Number.parseInt(amount),
    newBalance,
  })
})

// Deduct tokens for lab access
router.post("/deduct", (req, res) => {
  const { phoneNumber, amount, service } = req.body

  console.log(`Token deduction for ${phoneNumber}: ${amount} tokens for ${service}`)

  const currentTokens = userTokens.get(phoneNumber) || 100
  const deductAmount = Number.parseInt(amount)

  if (currentTokens < deductAmount) {
    return res.status(400).json({
      success: false,
      message: "Insufficient tokens",
      currentBalance: currentTokens,
      required: deductAmount,
    })
  }

  const newBalance = currentTokens - deductAmount
  userTokens.set(phoneNumber, newBalance)

  // Record transaction
  transactions.push({
    id: `txn_${Date.now()}`,
    type: "deduction",
    phoneNumber,
    amount: deductAmount,
    service,
    timestamp: new Date().toISOString(),
  })

  res.json({
    success: true,
    message: `${deductAmount} tokens deducted for ${service}`,
    phoneNumber,
    tokensDeducted: deductAmount,
    newBalance,
  })
})

// Get transaction history for a user
router.get("/history/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params

  const userTransactions = transactions
    .filter((t) => t.phoneNumber === phoneNumber)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20) // Last 20 transactions

  res.json({
    success: true,
    phoneNumber,
    transactions: userTransactions,
  })
})

module.exports = router
