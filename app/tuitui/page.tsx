"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

export default function TuiTuiPage() {
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { type: "user", text: userMessage }])

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text: `Tui Tui - ${userMessage}` }])
    }, 500)

    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="tui-chat-layout">
      {/* Header */}
      <div className="tui-chat-header">
        <div className="tui-chat-header-content">
          <h1 className="tui-heading-lg mb-2">TuiTui</h1>
          <p className="tui-text-caption">Auxiliary Tasks Assistant</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="tui-chat-container">
        {messages.length === 0 ? (
          <div className="tui-chat-empty">
            <div className="text-6xl mb-6">🌴</div>
            <h2 className="tui-heading-md mb-3">Welcome to TuiTui</h2>
            <p className="tui-text-body max-w-sm">
              Your friendly holiday-themed assistant. Send a message to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={message.type === "user" ? "tui-message-user" : "tui-message-bot"}>
                  <p className="text-sm lg:text-base break-words">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="tui-chat-input-area">
        <div className="tui-chat-input-container">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="tui-input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="tui-button-icon"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
