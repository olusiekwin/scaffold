"use client"

import { useState } from "react"
import { getUser } from "@/lib/auth"

interface AIAgent {
  id: string
  name: string
  specialty: string
  description: string
  avatar: string
  tokensRequired: number
}

const aiAgents: AIAgent[] = [
  {
    id: "1",
    name: "Professor Smith",
    specialty: "Mathematics",
    description: "Expert in algebra, geometry, and calculus. Patient and encouraging teaching style.",
    avatar: "/professor-avatar.png",
    tokensRequired: 15,
  },
  {
    id: "2",
    name: "Dr. Johnson",
    specialty: "Science",
    description: "Specializes in physics, chemistry, and biology. Makes complex concepts easy to understand.",
    avatar: "/scientist-avatar.png",
    tokensRequired: 15,
  },
  {
    id: "3",
    name: "Ms. Williams",
    specialty: "English",
    description: "Language arts expert focusing on grammar, writing, and literature analysis.",
    avatar: "/teacher-avatar.png",
    tokensRequired: 15,
  },
]

export default function VideoChat() {
  const [activeChat, setActiveChat] = useState<AIAgent | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const startVideoChat = async (agent: AIAgent) => {
    const user = getUser()
    if (!user) return

    const tokenResponse = await fetch(`/api/tokens/balance/${user.phoneNumber}`)
    const tokenData = await tokenResponse.json()

    if (tokenData.tokens < agent.tokensRequired) {
      alert(`Insufficient tokens! You need ${agent.tokensRequired} tokens but only have ${tokenData.tokens}.`)
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
          amount: agent.tokensRequired,
          service: "Video Chat",
        }),
      })

      const deductData = await deductResponse.json()

      if (!deductData.success) {
        alert("Failed to deduct tokens. Please try again.")
        return
      }

      const response = await fetch("/api/labs/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          agentType: agent.specialty,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveChat(agent)
        // Simulate connection process
        setTimeout(() => {
          setIsConnected(true)
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to start video chat:", error)
    }
  }

  const endVideoChat = () => {
    setActiveChat(null)
    setIsConnected(false)
  }

  if (activeChat) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <img
                src={activeChat.avatar || "/placeholder.svg"}
                alt={activeChat.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-card-foreground">{activeChat.name}</h3>
                <p className="text-sm text-muted-foreground">{activeChat.specialty} Tutor</p>
              </div>
            </div>
            <button
              onClick={endVideoChat}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
            >
              End Call
            </button>
          </div>

          {/* Video Chat Interface */}
          <div className="aspect-video bg-black relative">
            {!isConnected ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg">Connecting to {activeChat.name}...</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex">
                {/* AI Agent Video */}
                <div className="flex-1 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <img
                      src={activeChat.avatar || "/placeholder.svg"}
                      alt={activeChat.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20"
                    />
                    <p className="text-lg font-medium">{activeChat.name}</p>
                    <p className="text-sm opacity-80">AI Video Chat Placeholder</p>
                  </div>
                </div>

                {/* User Video (Small) */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white text-xs">
                    <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-1"></div>
                    <p>You</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Controls */}
          {isConnected && (
            <div className="p-4 bg-muted/30">
              <div className="flex items-center justify-center space-x-4">
                <button className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Video Chat with AI Tutors</h2>
        <p className="text-muted-foreground">
          Have one-on-one video conversations with AI tutors specialized in different subjects
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiAgents.map((agent) => (
          <div key={agent.id} className="bg-card border border-border rounded-lg p-6">
            <div className="text-center mb-4">
              <img
                src={agent.avatar || "/placeholder.svg"}
                alt={agent.name}
                className="w-20 h-20 rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-semibold text-card-foreground">{agent.name}</h3>
              <p className="text-sm text-primary font-medium">{agent.specialty} Specialist</p>
            </div>

            <p className="text-sm text-muted-foreground mb-4 text-center">{agent.description}</p>

            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-4">
              <span>{agent.tokensRequired}</span>
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">T</span>
              </div>
              <span>per session</span>
            </div>

            <button
              onClick={() => startVideoChat(agent)}
              className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Start Video Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
