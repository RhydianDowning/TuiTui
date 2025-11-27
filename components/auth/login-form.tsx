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
import { apiClient, type LoginRequest } from '@/lib/api'

interface LoginFormProps {
  onSuccess: (tokens: { access_token: string; refresh_token: string; id_token: string }) => void
  onError: (error: string) => void
  onNeedsVerification: (email: string) => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onError, onNeedsVerification, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await apiClient.login(data)
      onSuccess({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        id_token: response.id_token,
      })
    } catch (error) {
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : 'Login failed. Please check your credentials and try again.'
      
      // Check if the error is about email verification
      if (errorMessage.includes('verify your email') || errorMessage.includes('UserNotConfirmedException')) {
        onNeedsVerification(data.email)
      } else {
        onError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-primary hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </Form>
  )
}