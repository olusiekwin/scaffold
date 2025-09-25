"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import TokenBalance from "@/components/TokenBalance"
import USSDModal from "@/components/USSDModal"
import { getUser } from "@/lib/auth"

interface RechargeOption {
  id: string
  amount: number
  tokens: number
  bonus?: number
  popular?: boolean
}

const rechargeOptions: RechargeOption[] = [
  {
    id: "1",
    amount: 5,
    tokens: 50,
  },
  {
    id: "2",
    amount: 10,
    tokens: 100,
    bonus: 10,
  },
  {
    id: "3",
    amount: 20,
    tokens: 200,
    bonus: 30,
    popular: true,
  },
  {
    id: "4",
    amount: 50,
    tokens: 500,
    bonus: 100,
  },
]

export default function RechargePage() {
  const [selectedOption, setSelectedOption] = useState<RechargeOption | null>(null)
  const [showUSSD, setShowUSSD] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRecharge = (option: RechargeOption) => {
    setSelectedOption(option)
    setShowUSSD(true)
  }

  const handleUSSDComplete = async (success: boolean) => {
    setShowUSSD(false)

    if (success && selectedOption) {
      setLoading(true)
      const user = getUser()

      try {
        const response = await fetch("/api/tokens/recharge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: user?.phoneNumber,
            amount: selectedOption.tokens + (selectedOption.bonus || 0),
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Refresh the page to update token balance
          window.location.reload()
        }
      } catch (error) {
        console.error("Recharge failed:", error)
      } finally {
        setLoading(false)
      }
    }

    setSelectedOption(null)
  }

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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Recharge Tokens</h1>
              <p className="text-muted-foreground">
                Purchase tokens to access premium features like Voice Labs and Video Chat
              </p>
            </div>

            {/* Recharge Options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {rechargeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                    option.popular ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-2xl font-bold text-card-foreground mb-2">${option.amount}</div>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <span className="text-lg font-semibold text-primary">{option.tokens}</span>
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold">T</span>
                      </div>
                    </div>

                    {option.bonus && (
                      <div className="text-sm text-green-600 font-medium mb-4">+{option.bonus} bonus tokens!</div>
                    )}

                    <button
                      onClick={() => handleRecharge(option)}
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Processing..." : "Recharge"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* How it Works */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">How Token Recharge Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Select Package</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred token package</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">USSD Payment</h3>
                  <p className="text-sm text-muted-foreground">Complete payment via mobile money</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Instant Credit</h3>
                  <p className="text-sm text-muted-foreground">Tokens added to your account immediately</p>
                </div>
              </div>
            </div>

            {/* Token Usage Guide */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Token Usage</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="text-foreground">Voice Labs (15 min session)</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">10</span>
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">T</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="text-foreground">Video Chat with AI (20 min session)</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">15</span>
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">T</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-foreground">Video Lessons</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* USSD Modal */}
        {showUSSD && selectedOption && (
          <USSDModal option={selectedOption} onComplete={handleUSSDComplete} onClose={() => setShowUSSD(false)} />
        )}
      </div>
    </ProtectedRoute>
  )
}
