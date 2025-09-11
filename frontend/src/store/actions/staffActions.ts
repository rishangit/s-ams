import { createAction } from '@reduxjs/toolkit'
import { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../services/api'

// Get staff
export const getStaffRequest = createAction('staff/getStaffRequest')
export const getStaffSuccess = createAction<Staff[]>('staff/getStaffSuccess')
export const getStaffFailure = createAction<string>('staff/getStaffFailure')

// Get staff by company ID
export const getStaffByCompanyIdRequest = createAction<number>('staff/getStaffByCompanyIdRequest')
export const getStaffByCompanyIdSuccess = createAction<Staff[]>('staff/getStaffByCompanyIdSuccess')
export const getStaffByCompanyIdFailure = createAction<string>('staff/getStaffByCompanyIdFailure')

// Get staff by ID
export const getStaffByIdRequest = createAction<number>('staff/getStaffByIdRequest')
export const getStaffByIdSuccess = createAction<Staff>('staff/getStaffByIdSuccess')
export const getStaffByIdFailure = createAction<string>('staff/getStaffByIdFailure')

// Create staff
export const createStaffRequest = createAction<CreateStaffRequest>('staff/createStaffRequest')
export const createStaffSuccess = createAction<Staff>('staff/createStaffSuccess')
export const createStaffFailure = createAction<string>('staff/createStaffFailure')

// Update staff
export const updateStaffRequest = createAction<{ id: number; data: UpdateStaffRequest }>('staff/updateStaffRequest')
export const updateStaffSuccess = createAction<Staff>('staff/updateStaffSuccess')
export const updateStaffFailure = createAction<string>('staff/updateStaffFailure')

// Delete staff
export const deleteStaffRequest = createAction<number>('staff/deleteStaffRequest')
export const deleteStaffSuccess = createAction<number>('staff/deleteStaffSuccess')
export const deleteStaffFailure = createAction<string>('staff/deleteStaffFailure')

// Get available users
export const getAvailableUsersRequest = createAction('staff/getAvailableUsersRequest')
export const getAvailableUsersSuccess = createAction<any[]>('staff/getAvailableUsersSuccess')
export const getAvailableUsersFailure = createAction<string>('staff/getAvailableUsersFailure')

// Clear messages
export const clearStaffMessages = createAction('staff/clearStaffMessages')

