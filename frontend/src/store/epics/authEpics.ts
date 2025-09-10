import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { map, catchError, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
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
    debounceTime(100), // Debounce to prevent rapid successive requests
    distinctUntilChanged(), // Only proceed if the action is different from the previous one
    switchMap(() => {
      console.log('Making profile request...')
      return from(apiService.getProfile()).pipe(
        map((response) => {
          if (response.success && response.data) {
            console.log('Profile request successful')
            return getProfileSuccess(response.data)
          } else {
            console.log('Profile request failed:', response.message, 'Status:', (response as any).status)
            // If profile request fails with 401/403, clear the token
            if ((response as any).status === 401 || (response as any).status === 403 || (response as any).status === 429 || 
                response.message?.includes('Token expired') || 
                response.message?.includes('Invalid token') ||
                response.message?.includes('Access token required') ||
                response.message?.includes('Too many requests')) {
              console.log('Clearing auth token due to authentication failure')
              localStorage.removeItem('authToken')
            }
            return getProfileFailure(response.message)
          }
        }),
        catchError((error) => {
          console.log('Profile request error:', error.message)
          // If there's a network error or 401/403, clear the token
          if (error.message?.includes('401') || error.message?.includes('403') || 
              error.message?.includes('Token expired') || error.message?.includes('Invalid token') ||
              error.message?.includes('Network error') || error.message?.includes('Too many requests')) {
            localStorage.removeItem('authToken')
          }
          return of(getProfileFailure(error.message))
        })
      )
    })
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
