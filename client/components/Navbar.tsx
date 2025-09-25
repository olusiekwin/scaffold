"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface User {
  phoneNumber: string
  id: string
  tokens: number
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-foreground">
            EdTech Platform
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/recharge" className="text-foreground hover:text-primary transition-colors">
                  Recharge
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{user.phoneNumber}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
