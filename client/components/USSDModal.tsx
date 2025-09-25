"use client"

import { useState, useEffect } from "react"

interface RechargeOption {
  id: string
  amount: number
  tokens: number
  bonus?: number
}

interface USSDModalProps {
  option: RechargeOption
  onComplete: (success: boolean) => void
  onClose: () => void
}

const ussdSteps = [
  {
    id: 1,
    title: "Initiating USSD",
    message: "Dialing *123*456#...",
    duration: 2000,
  },
  {
    id: 2,
    title: "Mobile Money Menu",
    message: "1. Send Money\n2. Buy Airtime\n3. Pay Bills\n4. Buy Tokens\n\nSelect option: 4",
    duration: 3000,
  },
  {
    id: 3,
    title: "Token Purchase",
    message: "Enter amount: ${{amount}}\nConfirm purchase? (Y/N): Y",
    duration: 2000,
  },
  {
    id: 4,
    title: "Payment Processing",
    message: "Processing payment...\nPlease wait...",
    duration: 3000,
  },
  {
    id: 5,
    title: "Payment Successful",
    message: "Payment successful!\n{{tokens}} tokens added to your account.\nTransaction ID: TXN{{random}}",
    duration: 2000,
  },
]

export default function USSDModal({ option, onComplete, onClose }: USSDModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentStep < ussdSteps.length) {
      const timer = setTimeout(() => {
        if (currentStep === ussdSteps.length - 1) {
          setIsComplete(true)
          setTimeout(() => {
            onComplete(true)
          }, 1000)
        } else {
          setCurrentStep(currentStep + 1)
        }
      }, ussdSteps[currentStep].duration)

      return () => clearTimeout(timer)
    }
  }, [currentStep, onComplete])

  const currentStepData = ussdSteps[currentStep]
  const totalTokens = option.tokens + (option.bonus || 0)

  const formatMessage = (message: string) => {
    return message
      .replace("{{amount}}", option.amount.toString())
      .replace("{{tokens}}", totalTokens.toString())
      .replace("{{random}}", Math.floor(Math.random() * 1000000).toString())
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">USSD Payment</h2>
          <button
            onClick={() => onComplete(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {currentStep + 1} of {ussdSteps.length}
            </span>
            <span>{Math.round(((currentStep + 1) / ussdSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / ussdSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* USSD Screen Simulation */}
        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg mb-6 min-h-[200px]">
          <div className="mb-4">
            <div className="text-green-300 font-bold">{currentStepData?.title}</div>
            <div className="text-xs text-green-500 mb-2">Mobile Money Service</div>
          </div>

          <div className="whitespace-pre-line">{currentStepData && formatMessage(currentStepData.message)}</div>

          {currentStep < ussdSteps.length - 1 && (
            <div className="mt-4 flex items-center">
              <div className="animate-pulse">▋</div>
            </div>
          )}
        </div>

        {/* Purchase Summary */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-foreground mb-2">Purchase Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="text-foreground">${option.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Tokens:</span>
              <span className="text-foreground">{option.tokens}</span>
            </div>
            {option.bonus && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bonus Tokens:</span>
                <span className="text-green-600">+{option.bonus}</span>
              </div>
            )}
            <div className="border-t border-border pt-1 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Total Tokens:</span>
                <span className="text-primary">{totalTokens}</span>
              </div>
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">Payment Successful!</p>
          </div>
        )}
      </div>
    </div>
  )
}
