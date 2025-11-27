"use client"

import { useState } from "react"
import TuiTuiHeader from "@/components/tuitui-header"
import TuiTuiChatContainer from "@/components/tuitui-chat-container"
import TuiTuiMessageBar from "@/components/tuitui-message-bar"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/lib/auth-context"

export default function TuiTuiPage() {
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([])
  const [input, setInput] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, tokens } = useAuth()

  const handleSend = async (files?: File[]) => {
    if (!input.trim() && (!files || files.length === 0)) return

    if (!isAuthenticated || !tokens) {
      setAuthModalOpen(true)
      return
    }

    const userMessage = input.trim()

    // Add user message if there's text
    if (userMessage) {
      setMessages((prev) => [...prev, { type: "user", text: userMessage }])
    }

    // Add file info to user message if files are attached
    if (files && files.length > 0) {
      const fileInfo = files.map(file => {
        const sizeInKB = (file.size / 1024).toFixed(2)
        return `📎 ${file.name} (${file.type || 'unknown type'}, ${sizeInKB} KB)`
      }).join('\n')

      setMessages((prev) => [...prev, { type: "user", text: fileInfo }])
    }

    // Clear input immediately
    setInput("")

    setIsLoading(true)

    try {
      // Import apiClient dynamically to avoid SSR issues
      const { apiClient } = await import('@/lib/api')

      // Get settings from localStorage
      const savedSettings = localStorage.getItem('tuitui-settings')
      const settings = savedSettings ? JSON.parse(savedSettings) : {}

      // Prepare additional data
      const additionalData: any = {}
      if (settings.team && settings.team !== 'add-new') {
        additionalData.team = settings.team
        additionalData.teamInfo = Array(11).fill('example.com') // As per the mock
      }
      if (settings.markdownFile) {
        additionalData.markdownContent = settings.markdownFile.content
      }

      console.log('Sending chat request with token:', tokens.access_token.substring(0, 20) + '...')

      // Call the chat API with additional data
      const response = await apiClient.chat(
        { message: userMessage, ...additionalData },
        tokens.access_token
      )

      console.log('Chat response:', response)

      // Add bot response
      setMessages((prev) => [...prev, { type: "bot", text: response.message }])
    } catch (error) {
      console.error('Chat API error:', error)
      
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('401')
      
      // Add error message
      setMessages((prev) => [...prev, {
        type: "bot",
        text: isAuthError 
          ? 'Your session has expired. Please log out and log back in.' 
          : `Sorry, I encountered an error: ${errorMessage}`
      }])
      
      // If it's an auth error, show the auth modal
      if (isAuthError) {
        setTimeout(() => setAuthModalOpen(true), 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="tui-chat-layout">
      <TuiTuiHeader onAuthClick={() => setAuthModalOpen(true)} />
      <TuiTuiChatContainer messages={messages} />
      <TuiTuiMessageBar input={input} setInput={setInput} onSend={handleSend} isLoading={isLoading} />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </main>
  )
}
