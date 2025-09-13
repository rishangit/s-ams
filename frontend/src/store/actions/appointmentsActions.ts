import { createAction } from '@reduxjs/toolkit'

// Appointment interface
export interface Appointment {
  id: number
  userId: number
  companyId: number
  serviceId: number
  staffId?: number
  staffPreferences?: number[]
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  // Joined data
  userName?: string
  userEmail?: string
  userProfileImage?: string
  companyName?: string
  serviceName?: string
  servicePrice?: number
  staffName?: string
  staffEmail?: string
  staffProfileImage?: string
}

// Create appointment
export const createAppointmentRequest = createAction<{
  companyId: number
  serviceId: number
  appointmentDate: string
  appointmentTime: string
  notes?: string
}>('appointments/createAppointmentRequest')

export const createAppointmentSuccess = createAction<Appointment>('appointments/createAppointmentSuccess')
export const createAppointmentFailure = createAction<string>('appointments/createAppointmentFailure')


// Unified appointments endpoint
export const getAppointmentsRequest = createAction('appointments/getAppointmentsRequest')
export const getAppointmentsSuccess = createAction<Appointment[]>('appointments/getAppointmentsSuccess')
export const getAppointmentsFailure = createAction<string>('appointments/getAppointmentsFailure')

// Get all appointments (admin)
export const getAllAppointmentsRequest = createAction('appointments/getAllAppointmentsRequest')
export const getAllAppointmentsSuccess = createAction<Appointment[]>('appointments/getAllAppointmentsSuccess')
export const getAllAppointmentsFailure = createAction<string>('appointments/getAllAppointmentsFailure')

// Get appointment by ID
export const getAppointmentByIdRequest = createAction<number>('appointments/getAppointmentByIdRequest')
export const getAppointmentByIdSuccess = createAction<Appointment>('appointments/getAppointmentByIdSuccess')
export const getAppointmentByIdFailure = createAction<string>('appointments/getAppointmentByIdFailure')

// Update appointment
export const updateAppointmentRequest = createAction<{
  id: number
  appointmentDate?: string
  appointmentTime?: string
  notes?: string
}>('appointments/updateAppointmentRequest')

export const updateAppointmentSuccess = createAction<Appointment>('appointments/updateAppointmentSuccess')
export const updateAppointmentFailure = createAction<string>('appointments/updateAppointmentFailure')

// Update appointment status
export const updateAppointmentStatusRequest = createAction<{
  id: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}>('appointments/updateAppointmentStatusRequest')

export const updateAppointmentStatusSuccess = createAction<Appointment>('appointments/updateAppointmentStatusSuccess')
export const updateAppointmentStatusFailure = createAction<string>('appointments/updateAppointmentStatusFailure')

// Delete appointment
export const deleteAppointmentRequest = createAction<number>('appointments/deleteAppointmentRequest')
export const deleteAppointmentSuccess = createAction<number>('appointments/deleteAppointmentSuccess')
export const deleteAppointmentFailure = createAction<string>('appointments/deleteAppointmentFailure')

// Get appointment statistics
export const getAppointmentStatsRequest = createAction('appointments/getAppointmentStatsRequest')
export const getAppointmentStatsSuccess = createAction<{
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}>('appointments/getAppointmentStatsSuccess')
export const getAppointmentStatsFailure = createAction<string>('appointments/getAppointmentStatsFailure')

// Clear messages
export const clearAppointmentsMessages = createAction('appointments/clearAppointmentsMessages')

