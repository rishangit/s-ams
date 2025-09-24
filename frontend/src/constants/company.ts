export enum CompanyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const getCompanyStatusDisplayName = (status: CompanyStatus): string => {
  switch (status) {
    case CompanyStatus.PENDING:
      return 'Pending'
    case CompanyStatus.ACTIVE:
      return 'Active'
    case CompanyStatus.INACTIVE:
      return 'Inactive'
    default:
      return 'Unknown'
  }
}

export const getCompanyStatusColor = (status: CompanyStatus): string => {
  switch (status) {
    case CompanyStatus.PENDING:
      return '#f59e0b' // Amber
    case CompanyStatus.ACTIVE:
      return '#10b981' // Green
    case CompanyStatus.INACTIVE:
      return '#ef4444' // Red
    default:
      return '#6b7280' // Gray
  }
}

export interface Company {
  id?: number
  name: string
  address: string
  phoneNumber: string
  landPhone: string
  status: CompanyStatus
  geoLocation: string
  userId: number
  categoryId?: number
  subcategoryId?: number
  createdAt?: string
  updatedAt?: string
  // User information (for admin views)
  userFirstName?: string
  userLastName?: string
  userEmail?: string
  // Category information
  categoryName?: string
  subcategoryName?: string
}

export interface CompanyFormData {
  name: string
  address: string
  phoneNumber: string
  landPhone: string
  geoLocation: string
  categoryId?: number
  subcategoryId?: number
}
