import { createAction } from '@reduxjs/toolkit'
import { Company, CompanyFormData } from '../../constants/company'

// Create company request
export const createCompanyRequest = createAction<CompanyFormData>('company/createCompanyRequest')
export const createCompanySuccess = createAction<Company>('company/createCompanySuccess')
export const createCompanyFailure = createAction<string>('company/createCompanyFailure')

// Update company request
export const updateCompanyRequest = createAction<{ id: number; data: CompanyFormData }>('company/updateCompanyRequest')
export const updateCompanySuccess = createAction<Company>('company/updateCompanySuccess')
export const updateCompanyFailure = createAction<string>('company/updateCompanyFailure')

// Get company by user request
export const getCompanyByUserRequest = createAction<number>('company/getCompanyByUserRequest')
export const getCompanyByUserSuccess = createAction<Company>('company/getCompanyByUserSuccess')
export const getCompanyByUserFailure = createAction<string>('company/getCompanyByUserFailure')

// Get company by ID request
export const getCompanyByIdRequest = createAction<number>('company/getCompanyByIdRequest')
export const getCompanyByIdSuccess = createAction<Company>('company/getCompanyByIdSuccess')
export const getCompanyByIdFailure = createAction<string>('company/getCompanyByIdFailure')

// Get companies for booking request (authenticated users)
export const getCompaniesForBookingRequest = createAction('company/getCompaniesForBookingRequest')
export const getCompaniesForBookingSuccess = createAction<Company[]>('company/getCompaniesForBookingSuccess')
export const getCompaniesForBookingFailure = createAction<string>('company/getCompaniesForBookingFailure')

// Get all companies request (admin only)
export const getAllCompaniesRequest = createAction('company/getAllCompaniesRequest')
export const getAllCompaniesSuccess = createAction<Company[]>('company/getAllCompaniesSuccess')
export const getAllCompaniesFailure = createAction<string>('company/getAllCompaniesFailure')

// Update company status request (admin only)
export const updateCompanyStatusRequest = createAction<{ id: number; status: string }>('company/updateCompanyStatusRequest')
export const updateCompanyStatusSuccess = createAction<Company>('company/updateCompanyStatusSuccess')
export const updateCompanyStatusFailure = createAction<string>('company/updateCompanyStatusFailure')

// Delete company request (admin only)
export const deleteCompanyRequest = createAction<number>('company/deleteCompanyRequest')
export const deleteCompanySuccess = createAction<number>('company/deleteCompanySuccess')
export const deleteCompanyFailure = createAction<string>('company/deleteCompanyFailure')

// Clear company state
export const clearCompanyError = createAction('company/clearCompanyError')
export const clearCompanySuccess = createAction('company/clearCompanySuccess')
export const clearCompanyData = createAction('company/clearCompanyData')
