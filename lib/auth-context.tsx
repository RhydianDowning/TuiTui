'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  email: string
  name?: string
  user_id: string
}

interface AuthTokens {
  access_token: string
  refresh_token: string
  id_token: string
}

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tokens: AuthTokens) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'tuitui_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const authData = JSON.parse(stored)
        setTokens(authData.tokens)
        setUser(authData.user)
      }
    } catch (error) {
      console.error('Failed to load auth data:', error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (tokens && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ tokens, user }))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [tokens, user])

  const login = (newTokens: AuthTokens) => {
    setTokens(newTokens)
    // Note: user info would typically be decoded from the ID token
    // For now, we'll set a basic user object
    setUser({
      email: 'user@example.com', // This should be extracted from the token
      user_id: 'temp-user-id',
    })
  }

  const logout = () => {
    setTokens(null)
    setUser(null)
  }

  const updateUser = (newUser: User) => {
    setUser(newUser)
  }

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!tokens,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}