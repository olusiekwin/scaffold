export interface User {
  phoneNumber: string
  id: string
  tokens: number
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const clearUser = () => {
  localStorage.removeItem("user")
}

export const updateUserTokens = (tokens: number) => {
  const user = getUser()
  if (user) {
    user.tokens = tokens
    setUser(user)
  }
}
