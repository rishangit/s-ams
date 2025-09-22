import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import {
  getUserSettingsRequest,
  getUserSettingsSuccess,
  getUserSettingsFailure,
  updateUserSettingsRequest,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  resetUserSettingsRequest,
  resetUserSettingsSuccess,
  resetUserSettingsFailure
} from '../actions/userSettingsActions'
import { apiService } from '../../services/api'


// Get User Settings Epic
export const getUserSettingsEpic = (action$: any) =>
  action$.pipe(
    ofType(getUserSettingsRequest.type),
    switchMap(() => {
      console.log('Making user settings request...')
      return from(apiService.getUserSettings()).pipe(
        switchMap((response) => {
          if (response.success && response.data) {
            console.log('User settings request successful')
            return of(getUserSettingsSuccess(response.data))
          } else {
            console.log('User settings request failed:', response.message)
            return of(getUserSettingsFailure(response.message || 'Failed to get user settings'))
          }
        }),
        catchError((error) => {
          console.error('Get user settings error:', error)
          return of(getUserSettingsFailure(error.message || 'Failed to get user settings'))
        })
      )
    })
  )

// Update User Settings Epic
export const updateUserSettingsEpic = (action$: any) =>
  action$.pipe(
    ofType(updateUserSettingsRequest.type),
    switchMap((action: any) => {
      return from(apiService.updateUserSettings(action.payload)).pipe(
        switchMap((response) => {
          if (response.success && response.data) {
            return of(updateUserSettingsSuccess(response.data))
          } else {
            return of(updateUserSettingsFailure(response.message || 'Failed to update user settings'))
          }
        }),
        catchError((error) => {
          console.error('Update user settings error:', error)
          return of(updateUserSettingsFailure(error.message || 'Failed to update user settings'))
        })
      )
    })
  )

// Reset User Settings Epic
export const resetUserSettingsEpic = (action$: any) =>
  action$.pipe(
    ofType(resetUserSettingsRequest.type),
    switchMap(() => {
      return from(apiService.resetUserSettings()).pipe(
        switchMap((response) => {
          if (response.success && response.data) {
            return of(resetUserSettingsSuccess(response.data))
          } else {
            return of(resetUserSettingsFailure(response.message || 'Failed to reset user settings'))
          }
        }),
        catchError((error) => {
          console.error('Reset user settings error:', error)
          return of(resetUserSettingsFailure(error.message || 'Failed to reset user settings'))
        })
      )
    })
  )
