import { createAction } from '@reduxjs/toolkit'
import { UserHistoryFormData, UserHistoryFilters, CompanyStats } from '../../types/userHistory'

// User History interface (re-exported for consistency)
export interface UserHistory {
  id: number
  appointmentId: number
  userId: number
  companyId: number
  staffId?: number
  serviceId: number
  productsUsed: Array<{
    productId: number
    productName: string
    quantityUsed: number
    unitCost: number
    notes?: string
  }>
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

// Create User History Actions
export const createUserHistoryRequest = createAction<UserHistoryFormData>('userHistory/createUserHistoryRequest')
export const createUserHistorySuccess = createAction<UserHistory>('userHistory/createUserHistorySuccess')
export const createUserHistoryFailure = createAction<string>('userHistory/createUserHistoryFailure')

// Get User History Actions
export const getUserHistoryRequest = createAction<{ id: number }>('userHistory/getUserHistoryRequest')
export const getUserHistorySuccess = createAction<UserHistory>('userHistory/getUserHistorySuccess')
export const getUserHistoryFailure = createAction<string>('userHistory/getUserHistoryFailure')

// Get User History by Appointment ID Actions
export const getUserHistoryByAppointmentIdRequest = createAction<{ appointmentId: number }>('userHistory/getUserHistoryByAppointmentIdRequest')
export const getUserHistoryByAppointmentIdSuccess = createAction<UserHistory>('userHistory/getUserHistoryByAppointmentIdSuccess')
export const getUserHistoryByAppointmentIdFailure = createAction<string>('userHistory/getUserHistoryByAppointmentIdFailure')

// Get Company User History Actions
export const getCompanyUserHistoryRequest = createAction<{ limit?: number; offset?: number }>('userHistory/getCompanyUserHistoryRequest')
export const getCompanyUserHistorySuccess = createAction<UserHistory[]>('userHistory/getCompanyUserHistorySuccess')
export const getCompanyUserHistoryFailure = createAction<string>('userHistory/getCompanyUserHistoryFailure')

// Get User History by User ID Actions
export const getUserHistoryByUserIdRequest = createAction<{ userId: number; limit?: number; offset?: number }>('userHistory/getUserHistoryByUserIdRequest')
export const getUserHistoryByUserIdSuccess = createAction<UserHistory[]>('userHistory/getUserHistoryByUserIdSuccess')
export const getUserHistoryByUserIdFailure = createAction<string>('userHistory/getUserHistoryByUserIdFailure')

// Update User History Actions
export const updateUserHistoryRequest = createAction<{ id: number; data: Partial<UserHistoryFormData> }>('userHistory/updateUserHistoryRequest')
export const updateUserHistorySuccess = createAction<UserHistory>('userHistory/updateUserHistorySuccess')
export const updateUserHistoryFailure = createAction<string>('userHistory/updateUserHistoryFailure')

// Delete User History Actions
export const deleteUserHistoryRequest = createAction<{ id: number }>('userHistory/deleteUserHistoryRequest')
export const deleteUserHistorySuccess = createAction<{ id: number }>('userHistory/deleteUserHistorySuccess')
export const deleteUserHistoryFailure = createAction<string>('userHistory/deleteUserHistoryFailure')

// Get Company Stats Actions
export const getCompanyStatsRequest = createAction('userHistory/getCompanyStatsRequest')
export const getCompanyStatsSuccess = createAction<CompanyStats>('userHistory/getCompanyStatsSuccess')
export const getCompanyStatsFailure = createAction<string>('userHistory/getCompanyStatsFailure')

// Clear Messages Actions
export const clearUserHistoryMessages = createAction('userHistory/clearUserHistoryMessages')

