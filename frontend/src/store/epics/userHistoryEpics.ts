import { of } from 'rxjs'
import { switchMap, map, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { apiService } from '../../services/api'
import {
  createUserHistoryRequest,
  createUserHistorySuccess,
  createUserHistoryFailure,
  getUserHistoryRequest,
  getUserHistorySuccess,
  getUserHistoryFailure,
  getUserHistoryByAppointmentIdRequest,
  getUserHistoryByAppointmentIdSuccess,
  getUserHistoryByAppointmentIdFailure,
  getCompanyUserHistoryRequest,
  getCompanyUserHistorySuccess,
  getCompanyUserHistoryFailure,
  getUserHistoryByUserIdRequest,
  getUserHistoryByUserIdSuccess,
  getUserHistoryByUserIdFailure,
  updateUserHistoryRequest,
  updateUserHistorySuccess,
  updateUserHistoryFailure,
  deleteUserHistoryRequest,
  deleteUserHistorySuccess,
  deleteUserHistoryFailure,
  getCompanyStatsRequest,
  getCompanyStatsSuccess,
  getCompanyStatsFailure
} from '../actions/userHistoryActions'

// Create User History Epic
export const createUserHistoryEpic = (action$: any) =>
  action$.pipe(
    ofType(createUserHistoryRequest.type),
    switchMap((action: any) => {
      return apiService.createUserHistory(action.payload).pipe(
        map((response) => {
          if (response.success) {
            return createUserHistorySuccess(response.data)
          } else {
            return createUserHistoryFailure(response.message || 'Failed to create user history')
          }
        }),
        catchError((error) => {
          return of(createUserHistoryFailure(error.message || 'Failed to create user history'))
        })
      )
    })
  )

// Get User History by ID Epic
export const getUserHistoryEpic = (action$: any) =>
  action$.pipe(
    ofType(getUserHistoryRequest.type),
    switchMap((action: any) => {
      const { id } = action.payload
      return apiService.getUserHistoryById(id).pipe(
        map((response) => {
          if (response.success) {
            return getUserHistorySuccess(response.data)
          } else {
            return getUserHistoryFailure(response.message || 'Failed to get user history')
          }
        }),
        catchError((error) => {
          return of(getUserHistoryFailure(error.message || 'Failed to get user history'))
        })
      )
    })
  )

// Get User History by Appointment ID Epic
export const getUserHistoryByAppointmentIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getUserHistoryByAppointmentIdRequest.type),
    switchMap((action: any) => {
      const { appointmentId } = action.payload
      return apiService.getUserHistoryByAppointmentId(appointmentId).pipe(
        map((response) => {
          if (response.success) {
            return getUserHistoryByAppointmentIdSuccess(response.data)
          } else {
            return getUserHistoryByAppointmentIdFailure(response.message || 'Failed to get user history')
          }
        }),
        catchError((error) => {
          return of(getUserHistoryByAppointmentIdFailure(error.message || 'Failed to get user history'))
        })
      )
    })
  )

// Get Company User History Epic
export const getCompanyUserHistoryEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompanyUserHistoryRequest.type),
    switchMap((action: any) => {
      const { limit, offset } = action.payload
      return apiService.getCompanyUserHistory(limit, offset).pipe(
        map((response) => {
          if (response.success) {
            return getCompanyUserHistorySuccess(response.data)
          } else {
            return getCompanyUserHistoryFailure(response.message || 'Failed to get company user history')
          }
        }),
        catchError((error) => {
          return of(getCompanyUserHistoryFailure(error.message || 'Failed to get company user history'))
        })
      )
    })
  )

// Get User History by User ID Epic
export const getUserHistoryByUserIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getUserHistoryByUserIdRequest.type),
    switchMap((action: any) => {
      const { userId, limit, offset } = action.payload
      return apiService.getUserHistoryByUserId(userId, limit, offset).pipe(
        map((response) => {
          if (response.success) {
            return getUserHistoryByUserIdSuccess(response.data)
          } else {
            return getUserHistoryByUserIdFailure(response.message || 'Failed to get user history')
          }
        }),
        catchError((error) => {
          return of(getUserHistoryByUserIdFailure(error.message || 'Failed to get user history'))
        })
      )
    })
  )

// Update User History Epic
export const updateUserHistoryEpic = (action$: any) =>
  action$.pipe(
    ofType(updateUserHistoryRequest.type),
    switchMap((action: any) => {
      const { id, data } = action.payload
      return apiService.updateUserHistory(id, data).pipe(
        map((response) => {
          if (response.success) {
            return updateUserHistorySuccess(response.data)
          } else {
            return updateUserHistoryFailure(response.message || 'Failed to update user history')
          }
        }),
        catchError((error) => {
          return of(updateUserHistoryFailure(error.message || 'Failed to update user history'))
        })
      )
    })
  )

// Delete User History Epic
export const deleteUserHistoryEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteUserHistoryRequest.type),
    switchMap((action: any) => {
      const { id } = action.payload
      return apiService.deleteUserHistory(id).pipe(
        map((response) => {
          if (response.success) {
            return deleteUserHistorySuccess({ id })
          } else {
            return deleteUserHistoryFailure(response.message || 'Failed to delete user history')
          }
        }),
        catchError((error) => {
          return of(deleteUserHistoryFailure(error.message || 'Failed to delete user history'))
        })
      )
    })
  )

// Get Company Stats Epic
export const getCompanyStatsEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompanyStatsRequest.type),
    switchMap(() => {
      return apiService.getCompanyStats().pipe(
        map((response) => {
          if (response.success) {
            return getCompanyStatsSuccess(response.data)
          } else {
            return getCompanyStatsFailure(response.message || 'Failed to get company stats')
          }
        }),
        catchError((error) => {
          return of(getCompanyStatsFailure(error.message || 'Failed to get company stats'))
        })
      )
    })
  )

