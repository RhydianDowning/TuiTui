'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { apiClient, type VerifyEmailRequest } from '@/lib/api'

interface VerifyEmailFormProps {
  email: string
  onSuccess: () => void
  onError: (error: string) => void
  onResendCode: () => void
}

export function VerifyEmailForm({ email, onSuccess, onError, onResendCode }: VerifyEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<VerifyEmailRequest>({
    defaultValues: {
      email: email,
      code: '',
    },
  })

  const onSubmit = async (data: VerifyEmailRequest) => {
    setIsLoading(true)
    try {
      console.log('Attempting email verification with:', { email: data.email })
      await apiClient.verifyEmail(data)
      console.log('Email verification successful')
      onSuccess()
    } catch (error) {
      console.error('Email verification error:', error)
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : 'Verification failed. Please try again.'
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await apiClient.resendVerificationCode({ email })
      onResendCode()
    } catch (error) {
      console.error('Resend code error:', error)
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : 'Failed to resend code. Please try again.'
      onError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          We've sent a verification code to <strong>{email}</strong>. Please enter it below.
        </div>

        <FormField
          control={form.control}
          name="code"
          rules={{
            required: 'Verification code is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'Code must be 6 digits',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend verification code'}
          </button>
        </div>
      </form>
    </Form>
  )
}
