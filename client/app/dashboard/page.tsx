"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import VideoLessons from "@/components/VideoLessons"
import VoiceLabs from "@/components/VoiceLabs"
import VideoChat from "@/components/VideoChat"
import TokenBalance from "@/components/TokenBalance"
import { getUser, type User } from "@/lib/auth"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<"lessons" | "voice" | "video">("lessons")

  useEffect(() => {
    setUser(getUser())
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Token Balance Header */}
        <div className="bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <TokenBalance />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Learning Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.phoneNumber}! Continue your learning journey.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "lessons"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Video Lessons
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "voice"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Voice Labs
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "video"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Video Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "lessons" && <VideoLessons />}
            {activeTab === "voice" && <VoiceLabs />}
            {activeTab === "video" && <VideoChat />}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
