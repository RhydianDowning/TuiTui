"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, Paperclip, X, File } from "lucide-react"

interface TuiTuiMessageBarProps {
  input: string
  setInput: (value: string) => void
  onSend: (files?: File[]) => void
}

export default function TuiTuiMessageBar({ input, setInput, onSend }: TuiTuiMessageBarProps) {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    onSend(attachedFiles.length > 0 ? attachedFiles : undefined)
    setAttachedFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileType = (file: File) => {
    const type = file.type
    if (type.startsWith("image/")) return "Image"
    if (type.startsWith("video/")) return "Video"
    if (type.startsWith("audio/")) return "Audio"
    if (type === "application/pdf") return "PDF"
    if (type.includes("document") || type.includes("word")) return "Document"
    if (type.includes("sheet") || type.includes("excel")) return "Spreadsheet"
    return "File"
  }

  return (
    <div className="tui-chat-input-area">
      <div className="tui-chat-input-container">
        {/* Attached Files Display */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <File size={16} className="text-gray-500 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {getFileType(file)} • {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="tui-button-icon"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
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
            disabled={!input.trim() && attachedFiles.length === 0}
            className="tui-button-icon"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
