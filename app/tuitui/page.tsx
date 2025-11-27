"use client"

import { useState } from "react"
import TuiTuiHeader from "@/components/tuitui-header"
import TuiTuiChatContainer from "@/components/tuitui-chat-container"
import TuiTuiMessageBar from "@/components/tuitui-message-bar"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/lib/auth-context"
import type { ChatMessage } from "@/lib/api"

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

    // Add user message to display
    if (userMessage) {
      setMessages((prev) => [...prev, { type: "user", text: userMessage }])
    }

    if (files && files.length > 0) {
      const fileInfo = files.map((file: File) => {
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

      const savedSettings = localStorage.getItem('tuitui-settings')
      const settings = savedSettings ? JSON.parse(savedSettings) : {}

      // Build conversation history from current messages (includes all previous messages)
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))

      // Prepare request data with conversation history
      const requestData: any = {
        message: userMessage,
        conversationHistory,
      }

      if (settings.team && settings.team !== 'add-new') {
        requestData.team = settings.team
        try {
          const response = await fetch('/list.txt')
          const content = await response.text()
          const links = content.split('\n').filter(line => line.trim() !== '')
          requestData.teamInfo = links
        } catch (error) {
          console.error('Failed to load team info:', error)
          requestData.teamInfo = []
        }
      }
      if (settings.markdownFile) {
        requestData.markdownContent = settings.markdownFile.content
      }

      // Call the chat API with conversation history and additional data
      const response = await apiClient.chat(requestData, tokens!.access_token)


      // Add bot response
      setMessages((prev) => [...prev, { type: "bot", text: response.message }])
    } catch (error) {
      console.error('Chat API error:', error)

      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('401')

      // Add error message
      setMessages((prev) => [...prev, { type: "bot", text: isAuthError
        ? 'Your session has expired. Please log out and log back in.'
        : `Sorry, I encountered an error: ${errorMessage}` }])

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
