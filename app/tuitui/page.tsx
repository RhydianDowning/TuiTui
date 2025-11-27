"use client"

import { useState } from "react"
import TuiTuiHeader from "@/components/tuitui-header"
import TuiTuiChatContainer from "@/components/tuitui-chat-container"
import TuiTuiMessageBar from "@/components/tuitui-message-bar"

export default function TuiTuiPage() {
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([])
  const [input, setInput] = useState("")

  const handleSend = (files?: File[]) => {
    if (!input.trim() && (!files || files.length === 0)) return

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

    // Simulate bot response
    setTimeout(() => {
      let botResponse = ""
      
      if (userMessage) {
        botResponse += `Message received: "${userMessage}"`
      }
      
      if (files && files.length > 0) {
        if (botResponse) botResponse += "\n\n"
        botResponse += `I received ${files.length} file${files.length > 1 ? 's' : ''}:\n`
        files.forEach((file, index) => {
          const sizeInKB = (file.size / 1024).toFixed(2)
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
          const displaySize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`
          botResponse += `\n${index + 1}. ${file.name}\n   Type: ${file.type || 'unknown'}\n   Size: ${displaySize}`
        })
      }
      
      setMessages((prev) => [...prev, { type: "bot", text: botResponse }])
    }, 500)

    setInput("")
  }

  return (
    <main className="tui-chat-layout">
      <TuiTuiHeader />
      <TuiTuiChatContainer messages={messages} />
      <TuiTuiMessageBar input={input} setInput={setInput} onSend={handleSend} />
    </main>
  )
}
