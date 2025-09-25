"use client"

import { useState } from "react"
import { getUser } from "@/lib/auth"

interface VoiceSession {
  id: string
  topic: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tokensRequired: number
  estimatedTime: string
}

const voiceSessions: VoiceSession[] = [
  {
    id: "1",
    topic: "English Pronunciation",
    description: "Practice speaking English with AI feedback on pronunciation",
    difficulty: "Beginner",
    tokensRequired: 10,
    estimatedTime: "15 min",
  },
  {
    id: "2",
    topic: "Math Problem Solving",
    description: "Solve math problems by explaining your thought process aloud",
    difficulty: "Intermediate",
    tokensRequired: 15,
    estimatedTime: "20 min",
  },
  {
    id: "3",
    topic: "Science Discussion",
    description: "Discuss scientific concepts and get AI-powered explanations",
    difficulty: "Advanced",
    tokensRequired: 20,
    estimatedTime: "25 min",
  },
]

export default function VoiceLabs() {
  const [activeSession, setActiveSession] = useState<VoiceSession | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([])

  const startVoiceSession = async (session: VoiceSession) => {
    const user = getUser()
    if (!user) return

    const tokenResponse = await fetch(`/api/tokens/balance/${user.phoneNumber}`)
    const tokenData = await tokenResponse.json()

    if (tokenData.tokens < session.tokensRequired) {
      alert(`Insufficient tokens! You need ${session.tokensRequired} tokens but only have ${tokenData.tokens}.`)
      return
    }

    try {
      // Deduct tokens first
      const deductResponse = await fetch("/api/tokens/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          amount: session.tokensRequired,
          service: "Voice Lab",
        }),
      })

      const deductData = await deductResponse.json()

      if (!deductData.success) {
        alert("Failed to deduct tokens. Please try again.")
        return
      }

      const response = await fetch("/api/labs/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          topic: session.topic,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveSession(session)
        setMessages([
          { type: "ai", content: `Welcome to ${session.topic}! I'm your AI tutor. Let's start practicing!` },
        ])
      }
    } catch (error) {
      console.error("Failed to start voice session:", error)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate user speaking
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "user", content: "Hello, I'd like to practice pronunciation." }])
        setIsRecording(false)

        // Simulate AI response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              content:
                "Great! Let's start with some basic words. Try saying 'pronunciation' - focus on each syllable: pro-nun-ci-a-tion.",
            },
          ])
        }, 1000)
      }, 2000)
    }
  }

  const endSession = () => {
    setActiveSession(null)
    setMessages([])
    setIsRecording(false)
  }

  if (activeSession) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">{activeSession.topic}</h2>
              <p className="text-muted-foreground">Voice Lab Session</p>
            </div>
            <button
              onClick={endSession}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
            >
              End Session
            </button>
          </div>

          {/* Chat Interface */}
          <div className="bg-muted/30 rounded-lg p-4 h-64 overflow-y-auto mb-6">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground border border-border"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isRecording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isRecording ? (
                <div className="w-4 h-4 bg-current rounded-sm"></div>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording... Click to stop" : "Click to start speaking"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Voice Labs</h2>
        <p className="text-muted-foreground">
          Practice speaking and get AI-powered feedback on your pronunciation and communication
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voiceSessions.map((session) => (
          <div key={session.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  session.difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : session.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {session.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>{session.tokensRequired}</span>
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">T</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-card-foreground mb-2">{session.topic}</h3>
            <p className="text-sm text-muted-foreground mb-4">{session.description}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Est. time: {session.estimatedTime}</span>
            </div>

            <button
              onClick={() => startVoiceSession(session)}
              className="w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Start Voice Lab
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
