import { ofType } from 'redux-observable'
import { switchMap, map, catchError, of, from } from 'rxjs'
import {
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailure,
  updateUserRoleRequest,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  getUsersByRoleRequest,
  getUsersByRoleSuccess,
  getUsersByRoleFailure
} from '../actions/userActions'
import { apiService } from '../../services/api'

// Get all users epic
export const getAllUsersEpic = (action$: any) =>
  action$.pipe(
    ofType(getAllUsersRequest.type),
    switchMap(() => {
  
      return from(apiService.getAllUsers()).pipe(
        map((response) => {
          if (response.success && response.data) {

            return getAllUsersSuccess(response.data)
          } else {

            return getAllUsersFailure(response.message || 'Failed to fetch users')
          }
        }),
        catchError((error) => {
          console.error('getAllUsersEpic: Error -', error.message)
          return of(getAllUsersFailure(error.message || 'Failed to fetch users'))
        })
      )
    })
  )

// Update user role epic
export const updateUserRoleEpic = (action$: any) =>
  action$.pipe(
    ofType(updateUserRoleRequest.type),
    switchMap((action: any) => {
      const { userId, role } = action.payload
      return from(apiService.updateUserRole(userId, role)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return updateUserRoleSuccess(response.data)
          } else {
            return updateUserRoleFailure(response.message || 'Failed to update user role')
          }
        }),
        catchError((error) => of(updateUserRoleFailure(error.message || 'Failed to update user role')))
      )
    })
  )

// Get users by role epic
export const getUsersByRoleEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsersByRoleRequest.type),
    switchMap((action: any) => {
      const role = action.payload
      return from(apiService.getUsersByRole(role)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getUsersByRoleSuccess(response.data)
          } else {
            return getUsersByRoleFailure(response.message || 'Failed to fetch users by role')
          }
        }),
        catchError((error) => of(getUsersByRoleFailure(error.message || 'Failed to fetch users by role')))
      )
    })
  ) 