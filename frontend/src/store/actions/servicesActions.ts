import { createAction } from '@reduxjs/toolkit'

// Service interface
export interface Service {
  id: number
  name: string
  description: string
  duration: string
  price: number
  status: string
  companyId: number
  createdAt: string
  updatedAt: string
}

// Create service actions
export const createServiceRequest = createAction<{
  name: string
  description: string
  duration: string
  price: number
  status: string
}>('services/createServiceRequest')

export const createServiceSuccess = createAction<Service>('services/createServiceSuccess')
export const createServiceFailure = createAction<string>('services/createServiceFailure')

// Get services actions
export const getServicesRequest = createAction('services/getServicesRequest')
export const getServicesSuccess = createAction<Service[]>('services/getServicesSuccess')
export const getServicesFailure = createAction<string>('services/getServicesFailure')

// Get services by company ID actions
export const getServicesByCompanyIdRequest = createAction<number>('services/getServicesByCompanyIdRequest')
export const getServicesByCompanyIdSuccess = createAction<Service[]>('services/getServicesByCompanyIdSuccess')
export const getServicesByCompanyIdFailure = createAction<string>('services/getServicesByCompanyIdFailure')

// Get service by ID actions
export const getServiceByIdRequest = createAction<number>('services/getServiceByIdRequest')
export const getServiceByIdSuccess = createAction<Service>('services/getServiceByIdSuccess')
export const getServiceByIdFailure = createAction<string>('services/getServiceByIdFailure')

// Update service actions
export const updateServiceRequest = createAction<{
  id: number
  name: string
  description: string
  duration: string
  price: number
  status: string
}>('services/updateServiceRequest')

export const updateServiceSuccess = createAction<Service>('services/updateServiceSuccess')
export const updateServiceFailure = createAction<string>('services/updateServiceFailure')

// Update service status actions
export const updateServiceStatusRequest = createAction<{
  id: number
  status: string
}>('services/updateServiceStatusRequest')

export const updateServiceStatusSuccess = createAction<Service>('services/updateServiceStatusSuccess')
export const updateServiceStatusFailure = createAction<string>('services/updateServiceStatusFailure')

// Delete service actions
export const deleteServiceRequest = createAction<number>('services/deleteServiceRequest')
export const deleteServiceSuccess = createAction<number>('services/deleteServiceSuccess')
export const deleteServiceFailure = createAction<string>('services/deleteServiceFailure')

// Clear messages
export const clearServicesMessages = createAction('services/clearMessages')
