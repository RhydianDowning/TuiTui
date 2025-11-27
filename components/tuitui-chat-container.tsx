import { useRef, useEffect } from "react"

interface Message {
  type: "user" | "bot"
  text: string
}

interface TuiTuiChatContainerProps {
  messages: Message[]
}

export default function TuiTuiChatContainer({ messages }: TuiTuiChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="tui-chat-container">
      {messages.length === 0 ? (
        <div className="tui-chat-empty">
          <div className="text-6xl mb-6"></div>
          <h2 className="tui-heading-md mb-3">Welcome to TuiTui</h2>
          <p className="tui-text-body max-w-sm">
            Send a message to get started!
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
  )
}
