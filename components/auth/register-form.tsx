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
import { apiClient, type RegisterRequest } from '@/lib/api'

interface RegisterFormProps {
  onSuccess: (email: string) => void
  onError: (error: string) => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSuccess, onError, onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterRequest>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true)
    try {
      console.log('Attempting registration with:', { email: data.email, name: data.name })
      const response = await apiClient.register(data)
      console.log('Registration successful:', response)
      onSuccess(data.email)
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : 'Registration failed. Please try again.'
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
            validate: (value) => {
              const domain = value.split('@')[1]?.toLowerCase()
              if (domain !== 'tui.co.uk') {
                return 'Only @tui.co.uk email addresses are allowed'
              }
              return true
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-primary hover:underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </Form>
  )
}