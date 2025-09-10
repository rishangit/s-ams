import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { map, catchError, switchMap } from 'rxjs/operators'
import { apiService } from '../../services/api'
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from '../actions'

// Register Epic
export const registerEpic = (action$: any) =>
  action$.pipe(
    ofType(registerRequest.type),
    switchMap((action: any) =>
      from(apiService.register(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            // Store token in localStorage
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token)
            }
            return registerSuccess(response.data)
          } else {
            // Handle error response
            return registerFailure(response.message)
          }
        }),
        catchError((error) => of(registerFailure(error.message)))
      )
    )
  )

// Login Epic
export const loginEpic = (action$: any) =>
  action$.pipe(
    ofType(loginRequest.type),
    switchMap((action: any) =>
      from(apiService.login(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            // Store token in localStorage
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token)
            }
            return loginSuccess(response.data)
          } else {
            // Handle error response
            return loginFailure(response.message)
          }
        }),
        catchError((error) => of(loginFailure(error.message)))
      )
    )
  )

// Get Profile Epic
export const getProfileEpic = (action$: any) =>
  action$.pipe(
    ofType(getProfileRequest.type),
    switchMap(() =>
      from(apiService.getProfile()).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getProfileSuccess(response.data)
          } else {
            return getProfileFailure(response.message)
          }
        }),
        catchError((error) => of(getProfileFailure(error.message)))
      )
    )
  )

// Update Profile Epic
export const updateProfileEpic = (action$: any) =>
  action$.pipe(
    ofType(updateProfileRequest.type),
    switchMap((action: any) =>
      from(apiService.updateProfile(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return updateProfileSuccess(response.data)
          } else {
            return updateProfileFailure(response.message)
          }
        }),
        catchError((error) => of(updateProfileFailure(error.message)))
      )
    )
  )

// Export all auth epics
export const authEpics = [registerEpic, loginEpic, getProfileEpic, updateProfileEpic]
