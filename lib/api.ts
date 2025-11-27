// API client for TuiTui backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ResendCodeRequest {
  email: string
}

export interface ChatRequest {
  message: string
}

export interface LoginResponse {
  message: string
  access_token: string
  refresh_token: string
  id_token: string
  token_type: string
  expires_in: number
}

export interface ChatResponse {
  message: string
  environment: string
  aws_region: string
  api_version: string
  status: string
}

export interface HealthResponse {
  message: string
  environment: string
  aws_region: string
  api_version: string
  status: string
}

export interface ApiError {
  error: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log('API Request:', { url, method: config.method || 'GET' })
      const response = await fetch(url, config)
      console.log('API Response:', { status: response.status, statusText: response.statusText })

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`
        
        try {
          const errorData: ApiError = await response.json()
          console.error('API Error Response:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, use status text
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      console.error('API Request Failed:', error)
      // Handle network errors or other fetch errors
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error: Unable to connect to the server')
    }
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health')
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async register(data: RegisterRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resendVerificationCode(data: ResendCodeRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async chat(data: ChatRequest, accessToken: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)