'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface TuiTuiHeaderProps {
  onAuthClick: () => void
}

export default function TuiTuiHeader({ onAuthClick }: TuiTuiHeaderProps) {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="tui-chat-header">
      <div className="tui-chat-header-content">
        <h1 className="tui-heading-xl-white mb-2">TuiTui</h1>
        <p className="tui-text-caption">Auxiliary Tasks Assistant</p>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">
              Welcome, {user?.name || user?.email || 'User'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onAuthClick}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}
