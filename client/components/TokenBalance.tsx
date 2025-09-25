"use client"

import { useState, useEffect } from "react"
import { getUser, updateUserTokens } from "@/lib/auth"

export default function TokenBalance() {
  const [tokens, setTokens] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTokenBalance()
  }, [])

  const fetchTokenBalance = async () => {
    const user = getUser()
    if (!user) return

    try {
      const response = await fetch(`/api/tokens/balance/${user.phoneNumber}`)
      const data = await response.json()

      if (data.success) {
        setTokens(data.tokens)
        updateUserTokens(data.tokens)
      }
    } catch (error) {
      console.error("Failed to fetch token balance:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-muted-foreground">Loading balance...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">T</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token Balance</p>
            <p className="text-xl font-bold text-foreground">{tokens}</p>
          </div>
        </div>
      </div>

      <button onClick={fetchTokenBalance} className="text-sm text-primary hover:text-primary/80 transition-colors">
        Refresh
      </button>
    </div>
  )
}
