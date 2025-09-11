import { ofType } from 'redux-observable'
import { switchMap, map, catchError, of, from } from 'rxjs'
import {
  getStaffRequest,
  getStaffSuccess,
  getStaffFailure,
  getStaffByCompanyIdRequest,
  getStaffByCompanyIdSuccess,
  getStaffByCompanyIdFailure,
  getStaffByIdRequest,
  getStaffByIdSuccess,
  getStaffByIdFailure,
  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,
  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
  getAvailableUsersRequest,
  getAvailableUsersSuccess,
  getAvailableUsersFailure
} from '../actions/staffActions'
import { apiService } from '../../services/api'

// Get staff epic
export const getStaffEpic = (action$: any) =>
  action$.pipe(
    ofType(getStaffRequest.type),
    switchMap(() =>
      from(apiService.getStaff()).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getStaffSuccess(response.data)
          } else {
            return getStaffFailure(response.error || 'Failed to fetch staff')
          }
        }),
        catchError((error) => of(getStaffFailure(error.message || 'Failed to fetch staff')))
      )
    )
  )

// Get staff by company ID epic
export const getStaffByCompanyIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getStaffByCompanyIdRequest.type),
    switchMap((action) => {
      console.log('getStaffByCompanyIdEpic triggered with companyId:', action.payload)
      return from(apiService.getStaffByCompanyId(action.payload)).pipe(
        map((response) => {
          console.log('getStaffByCompanyId API response:', response)
          console.log('Response success:', response.success)
          console.log('Response data:', response.data)
          console.log('Response error:', response.error)
          if (response.success && response.data) {
            console.log('Dispatching getStaffByCompanyIdSuccess with data:', response.data)
            return getStaffByCompanyIdSuccess(response.data)
          } else {
            console.log('Dispatching getStaffByCompanyIdFailure with error:', response.error || 'Failed to fetch staff')
            return getStaffByCompanyIdFailure(response.error || 'Failed to fetch staff')
          }
        }),
        catchError((error) => {
          console.error('getStaffByCompanyId API error:', error)
          return of(getStaffByCompanyIdFailure(error.message || 'Failed to fetch staff'))
        })
      )
    })
  )

// Get staff by ID epic
export const getStaffByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getStaffByIdRequest.type),
    switchMap((action: any) =>
      from(apiService.getStaffById(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getStaffByIdSuccess(response.data)
          } else {
            return getStaffByIdFailure(response.error || 'Failed to fetch staff member')
          }
        }),
        catchError((error) => of(getStaffByIdFailure(error.message || 'Failed to fetch staff member')))
      )
    )
  )

// Create staff epic
export const createStaffEpic = (action$: any) =>
  action$.pipe(
    ofType(createStaffRequest.type),
    switchMap((action: any) =>
      from(apiService.createStaff(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return createStaffSuccess(response.data)
          } else {
            return createStaffFailure(response.error || 'Failed to create staff member')
          }
        }),
        catchError((error) => of(createStaffFailure(error.message || 'Failed to create staff member')))
      )
    )
  )

// Update staff epic
export const updateStaffEpic = (action$: any) =>
  action$.pipe(
    ofType(updateStaffRequest.type),
    switchMap((action: any) =>
      from(apiService.updateStaff(action.payload.id, action.payload.data)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return updateStaffSuccess(response.data)
          } else {
            return updateStaffFailure(response.error || 'Failed to update staff member')
          }
        }),
        catchError((error) => of(updateStaffFailure(error.message || 'Failed to update staff member')))
      )
    )
  )

// Delete staff epic
export const deleteStaffEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteStaffRequest.type),
    switchMap((action: any) =>
      from(apiService.deleteStaff(action.payload)).pipe(
        map((response) => {
          if (response.success) {
            return deleteStaffSuccess(action.payload)
          } else {
            return deleteStaffFailure(response.error || 'Failed to delete staff member')
          }
        }),
        catchError((error) => of(deleteStaffFailure(error.message || 'Failed to delete staff member')))
      )
    )
  )

// Get available users epic
export const getAvailableUsersEpic = (action$: any) =>
  action$.pipe(
    ofType(getAvailableUsersRequest.type),
    switchMap(() =>
      from(apiService.getAvailableUsers()).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getAvailableUsersSuccess(response.data)
          } else {
            return getAvailableUsersFailure(response.error || 'Failed to fetch available users')
          }
        }),
        catchError((error) => of(getAvailableUsersFailure(error.message || 'Failed to fetch available users')))
      )
    )
  )

