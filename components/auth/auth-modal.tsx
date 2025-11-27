'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { VerifyEmailForm } from './verify-email-form'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login')
  const [emailToVerify, setEmailToVerify] = useState<string>('')
  const { login } = useAuth()
  const { toast } = useToast()

  const handleLoginSuccess = (tokens: { access_token: string; refresh_token: string; id_token: string }) => {
    login(tokens)
    toast({
      title: 'Welcome back!',
      description: 'You have been successfully signed in.',
    })
    onClose()
  }

  const handleRegisterSuccess = (email: string) => {
    setEmailToVerify(email)
    toast({
      title: 'Account created!',
      description: 'Please check your email for the verification code.',
    })
    setMode('verify')
  }

  const handleNeedsVerification = (email: string) => {
    setEmailToVerify(email)
    toast({
      title: 'Email verification required',
      description: 'Please verify your email address to continue.',
      variant: 'default',
    })
    setMode('verify')
  }

  const handleVerifySuccess = () => {
    toast({
      title: 'Email verified!',
      description: 'You can now sign in with your account.',
    })
    setMode('login')
  }

  const handleResendCode = () => {
    toast({
      title: 'Code sent!',
      description: 'A new verification code has been sent to your email.',
    })
  }

  const handleError = (error: string) => {
    toast({
      title: 'Error',
      description: error || 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Verify Email'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Enter your credentials to access your account.'
              : mode === 'register'
              ? 'Create a new account to get started.'
              : 'Enter the verification code sent to your email.'
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onError={handleError}
            onNeedsVerification={handleNeedsVerification}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : mode === 'register' ? (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onError={handleError}
            onSwitchToLogin={() => setMode('login')}
          />
        ) : (
          <VerifyEmailForm
            email={emailToVerify}
            onSuccess={handleVerifySuccess}
            onError={handleError}
            onResendCode={handleResendCode}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}