// Centralized API service for all API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  status?: number
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
  role: string | number
  originalRole?: number
  isRoleSwitched?: boolean
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface Staff {
  id: number
  userId: number
  companyId: number
  workingHoursStart?: string
  workingHoursEnd?: string
  skills?: string
  professionalQualifications?: string
  status: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  profileImage?: string
  companyName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStaffRequest {
  userId: number
  workingHoursStart?: string
  workingHoursEnd?: string
  skills?: string
  professionalQualifications?: string
  status?: number
}

export interface UpdateStaffRequest {
  workingHoursStart?: string
  workingHoursEnd?: string
  skills?: string
  professionalQualifications?: string
  status?: number
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
  private requestQueue: Map<string, Promise<any>> = new Map()

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const requestKey = `${options.method || 'GET'}:${endpoint}`

    // Check if there's already a request in progress for this endpoint
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey)!
    }

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

    const requestPromise = this.makeRequest<T>(url, config)
    this.requestQueue.set(requestKey, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      this.requestQueue.delete(requestKey)
    }
  }

  private async makeRequest<T>(url: string, config: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle 429 Too Many Requests specifically
        if (response.status === 429) {
          console.warn('Rate limit exceeded, clearing auth token')
          localStorage.removeItem('authToken')
        }
        
        // Return the error response data instead of throwing
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          error: data.message || `HTTP error! status: ${response.status}`,
          status: response.status
        }
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      }
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

  // Role switching endpoints
  async getAvailableRoles(): Promise<ApiResponse<{ currentRole: any, availableRoles: any[] }>> {
    return this.request<{ currentRole: any, availableRoles: any[] }>('/auth/available-roles')
  }

  async switchRole(targetRole: number): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    })
  }

  async switchBackToOriginalRole(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/switch-back', {
      method: 'POST',
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

  async getCompanyById(companyId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/${companyId}`)
  }

  // Get companies for appointment booking (authenticated users)
  async getCompaniesForBooking(): Promise<ApiResponse<any>> {
    return this.request<any>('/company/booking')
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

  async getCompaniesByUserAppointments(): Promise<ApiResponse<any>> {
    return this.request<any>('/company/user-appointments')
  }

  // Services endpoints
  async createService(serviceData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    })
  }

  async getServices(): Promise<ApiResponse<any>> {
    return this.request<any>('/services')
  }

  async getServicesByCompanyId(companyId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/company/${companyId}`)
  }

  async getServiceById(serviceId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/${serviceId}`)
  }

  async updateService(serviceId: number, serviceData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    })
  }

  async updateServiceStatus(serviceId: number, status: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/${serviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteService(serviceId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/${serviceId}`, {
      method: 'DELETE'
    })
  }

  // Appointments endpoints
  async createAppointment(appointmentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    })
  }


  async getAppointments(): Promise<ApiResponse<any>> {
    return this.request<any>('/appointments')
  }

  async getAllAppointments(): Promise<ApiResponse<any>> {
    return this.request<any>('/appointments/all')
  }

  async getAppointmentById(appointmentId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/appointments/${appointmentId}`)
  }

  async updateAppointment(appointmentId: number, appointmentData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    })
  }

  async updateAppointmentStatus(appointmentId: number, status: string, staffId?: number): Promise<ApiResponse<any>> {
    const body: any = { status }
    if (staffId) {
      body.staffId = staffId
    }
    return this.request<any>(`/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  async deleteAppointment(appointmentId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/appointments/${appointmentId}`, {
      method: 'DELETE'
    })
  }

  async getAppointmentStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/appointments/stats')
  }

  // Staff API methods
  async getStaff(): Promise<ApiResponse<Staff[]>> {
    return this.request<Staff[]>('/staff')
  }

  async getStaffByCompanyId(companyId: number): Promise<ApiResponse<Staff[]>> {
    return this.request<Staff[]>(`/staff/company/${companyId}`)
  }

  async getStaffById(staffId: number): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${staffId}`)
  }

  async createStaff(data: CreateStaffRequest): Promise<ApiResponse<Staff>> {
    return this.request<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateStaff(staffId: number, data: UpdateStaffRequest): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${staffId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteStaff(staffId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/staff/${staffId}`, {
      method: 'DELETE'
    })
  }

  async getAvailableUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/staff/available-users')
  }

  async getCompanyUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/company-users')
  }

  async getUserAppointments(userId: number): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/company-users/${userId}/appointments`)
  }

  async getUserAppointmentsByCompany(companyId: number): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/company/${companyId}/my-appointments`)
  }

  // Product API methods
  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  }

  async getProducts(filters?: any): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }
    const queryString = queryParams.toString()
    return this.request<any>(`/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProductsByUserAppointments(filters?: any): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }
    const queryString = queryParams.toString()
    return this.request<any>(`/products/user-appointments${queryString ? `?${queryString}` : ''}`)
  }

  async getProductById(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}`)
  }

  async updateProduct(id: number, productData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  }

  async updateProductQuantity(id: number, quantity: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}/quantity`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    })
  }

  async updateProductStatus(id: number, status: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteProduct(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE'
    })
  }

  async getLowStockProducts(): Promise<ApiResponse<any>> {
    return this.request<any>('/products/low-stock')
  }

  async getProductCategories(): Promise<ApiResponse<any>> {
    return this.request<any>('/products/categories')
  }

  // User History API methods
  async createUserHistory(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/user-history', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getUserHistoryById(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/user-history/${id}`)
  }

  async getUserHistoryByAppointmentId(appointmentId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/user-history/appointment/${appointmentId}`)
  }

  async getCompanyUserHistory(limit?: number, offset?: number): Promise<ApiResponse<any>> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    
    const queryString = params.toString()
    const url = queryString ? `/user-history/company?${queryString}` : '/user-history/company'
    return this.request<any>(url)
  }

  async getUserHistoryByUserId(userId: number, limit?: number, offset?: number): Promise<ApiResponse<any>> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    
    const queryString = params.toString()
    const url = queryString ? `/user-history/user/${userId}?${queryString}` : `/user-history/user/${userId}`
    return this.request<any>(url)
  }

  async updateUserHistory(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/user-history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUserHistory(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/user-history/${id}`, {
      method: 'DELETE'
    })
  }

  async getCompanyStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/user-history/company/stats')
  }
}

// Export singleton instance
export const apiService = new ApiService()
