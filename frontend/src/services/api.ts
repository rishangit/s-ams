// Centralized API service for all API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  phone?: string
  department?: string
  position?: string
  role: string
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Return the error response data instead of throwing
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          error: data.message || `HTTP error! status: ${response.status}`
        }
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile')
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // User management endpoints (admin only)
  async getAllUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>('/auth/users')
  }

  async getUsersByRole(role: string): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>(`/auth/users/role/${role}`)
  }

  async updateUserRole(userId: number, role: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/auth/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health')
  }

  // Company management methods
  async createCompany(companyData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/company', {
      method: 'POST',
      body: JSON.stringify(companyData)
    })
  }

  async updateCompany(id: number, companyData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData)
    })
  }

  async getCompanyByUser(userId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/user/${userId}`)
  }

  // Admin company management methods
  async getAllCompanies(): Promise<ApiResponse<any>> {
    return this.request<any>('/company')
  }

  async updateCompanyStatus(id: number, status: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteCompany(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/${id}`, {
      method: 'DELETE'
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()
