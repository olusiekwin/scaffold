const express = require("express")
const router = express.Router()

// In-memory storage for active sessions
const activeSessions = new Map()

// Start voice lab session
router.post("/voice", (req, res) => {
  const { phoneNumber, topic } = req.body

  console.log(`Voice lab session started for ${phoneNumber}, topic: ${topic}`)

  const sessionId = `voice_${Date.now()}`
  const session = {
    id: sessionId,
    type: "voice",
    phoneNumber,
    topic,
    startTime: new Date().toISOString(),
    status: "active",
    tokensRequired: 10,
  }

  activeSessions.set(sessionId, session)

  res.json({
    success: true,
    message: "Voice lab session started",
    session,
  })
})

// Start video chat session
router.post("/video", (req, res) => {
  const { phoneNumber, agentType } = req.body

  console.log(`Video chat session started for ${phoneNumber}, agent: ${agentType}`)

  const sessionId = `video_${Date.now()}`
  const session = {
    id: sessionId,
    type: "video",
    phoneNumber,
    agentType,
    startTime: new Date().toISOString(),
    status: "active",
    tokensRequired: 15,
  }

  activeSessions.set(sessionId, session)

  res.json({
    success: true,
    message: "Video chat session started",
    session,
  })
})

// End session
router.post("/end-session", (req, res) => {
  const { sessionId } = req.body

  const session = activeSessions.get(sessionId)

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    })
  }

  session.status = "completed"
  session.endTime = new Date().toISOString()
  session.duration = Math.round((new Date() - new Date(session.startTime)) / 1000) // Duration in seconds

  console.log(`Session ${sessionId} ended. Duration: ${session.duration} seconds`)

  res.json({
    success: true,
    message: "Session ended successfully",
    session,
  })
})

// Get active sessions for a user
router.get("/sessions/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params

  const userSessions = Array.from(activeSessions.values())
    .filter((session) => session.phoneNumber === phoneNumber)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

  res.json({
    success: true,
    phoneNumber,
    sessions: userSessions,
  })
})

// Get session details
router.get("/session/:sessionId", (req, res) => {
  const { sessionId } = req.params

  const session = activeSessions.get(sessionId)

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    })
  }

  res.json({
    success: true,
    session,
  })
})

module.exports = router
