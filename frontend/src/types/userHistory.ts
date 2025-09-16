// User History Types

export interface ProductUsed {
  id?: number // Unique ID for grid row identification
  productId: number
  productName: string
  quantityUsed: number
  unitCost: number
  notes?: string
}

export interface UserHistory {
  id: number
  appointmentId: number
  userId: number
  companyId: number
  staffId?: number
  serviceId: number
  productsUsed: ProductUsed[]
  totalCost: number
  notes?: string
  completionDate: string
  createdAt: string
  updatedAt: string
  
  // Related data
  userName?: string
  userEmail?: string
  companyName?: string
  staffName?: string
  staffEmail?: string
  serviceName?: string
  servicePrice?: number
}

export interface UserHistoryFormData {
  appointmentId: number
  productsUsed: ProductUsed[]
  totalCost: number
  notes?: string
}

export interface UserHistoryFilters {
  userId?: number
  companyId?: number
  staffId?: number
  serviceId?: number
  dateFrom?: string
  dateTo?: string
  minCost?: number
  maxCost?: number
}

export interface CompanyStats {
  totalAppointments: number
  totalRevenue: number
  averageCost: number
  uniqueCustomers: number
}

export interface UserHistoryState {
  userHistory: UserHistory[]
  currentHistory: UserHistory | null
  companyStats: CompanyStats | null
  loading: boolean
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  getHistoryLoading: boolean
  getStatsLoading: boolean
  error: string | null
  success: string | null
}

// API Response types
export interface CreateUserHistoryRequest {
  appointmentId: number
  productsUsed: ProductUsed[]
  totalCost: number
  notes?: string
}

export interface UpdateUserHistoryRequest {
  productsUsed: ProductUsed[]
  totalCost: number
  notes?: string
}

export interface GetUserHistoryParams {
  limit?: number
  offset?: number
  userId?: number
  companyId?: number
  staffId?: number
  serviceId?: number
  dateFrom?: string
  dateTo?: string
}

