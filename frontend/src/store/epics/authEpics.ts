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
  getAvailableRolesRequest,
  getAvailableRolesSuccess,
  getAvailableRolesFailure,
  switchRoleRequest,
  switchRoleSuccess,
  switchRoleFailure,
  switchBackRequest,
  switchBackSuccess,
  switchBackFailure,
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
        switchMap((response) => {
          if (response.success && response.data) {
            console.log('Profile request successful')
            // After successful profile fetch, also fetch available roles
            return from(apiService.getAvailableRoles()).pipe(
              map((rolesResponse) => {
                if (rolesResponse.success && rolesResponse.data) {
                  // Return both profile and roles data
                  return getProfileSuccess({
                    user: response.data.user,
                    availableRoles: rolesResponse.data.availableRoles,
                    currentRole: rolesResponse.data.currentRole
                  })
                } else {
                  // If roles fetch fails, still return profile success
                  return getProfileSuccess(response.data)
                }
              }),
              catchError((rolesError) => {
                console.log('Available roles fetch failed:', rolesError.message)
                // If roles fetch fails, still return profile success
                return of(getProfileSuccess(response.data))
              })
            )
          } else {
            console.log('Profile request failed:', response.message, 'Status:', (response as any).status)
            // If profile request fails with 401/403, clear the token
            if ((response as any).status === 401 || (response as any).status === 403 || (response as any).status === 429 || (response as any).status === 0 ||
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

// Get Available Roles Epic
export const getAvailableRolesEpic = (action$: any) =>
  action$.pipe(
    ofType(getAvailableRolesRequest.type),
    switchMap(() =>
      from(apiService.getAvailableRoles()).pipe(
        map((response) => {
          if (response.success && response.data) {
            return getAvailableRolesSuccess(response.data)
          } else {
            return getAvailableRolesFailure(response.message)
          }
        }),
        catchError((error) => of(getAvailableRolesFailure(error.message)))
      )
    )
  )

// Switch Role Epic
export const switchRoleEpic = (action$: any) =>
  action$.pipe(
    ofType(switchRoleRequest.type),
    switchMap((action: any) =>
      from(apiService.switchRole(action.payload)).pipe(
        switchMap((response) => {
          if (response.success && response.data) {
            // Store new token in localStorage
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token)
            }
            
            // After successful role switch, fetch available roles for the new role
            return from(apiService.getAvailableRoles()).pipe(
              map((rolesResponse) => {
                if (rolesResponse.success && rolesResponse.data) {
                  // Return both switch role and roles data
                  return switchRoleSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    availableRoles: rolesResponse.data.availableRoles,
                    currentRole: rolesResponse.data.currentRole
                  })
                } else {
                  // If roles fetch fails, still return switch role success
                  return switchRoleSuccess(response.data)
                }
              }),
              catchError((rolesError) => {
                console.log('Available roles fetch failed after role switch:', rolesError.message)
                // If roles fetch fails, still return switch role success
                return of(switchRoleSuccess(response.data))
              })
            )
          } else {
            return of(switchRoleFailure(response.message))
          }
        }),
        catchError((error) => of(switchRoleFailure(error.message)))
      )
    )
  )

// Switch Back Epic
export const switchBackEpic = (action$: any) =>
  action$.pipe(
    ofType(switchBackRequest.type),
    switchMap(() =>
      from(apiService.switchBackToOriginalRole()).pipe(
        switchMap((response) => {
          if (response.success && response.data) {
            // Store new token in localStorage
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token)
            }
            
            // After successful switch back, fetch available roles for the original role
            return from(apiService.getAvailableRoles()).pipe(
              map((rolesResponse) => {
                if (rolesResponse.success && rolesResponse.data) {
                  // Return both switch back and roles data
                  return switchBackSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    availableRoles: rolesResponse.data.availableRoles,
                    currentRole: rolesResponse.data.currentRole
                  })
                } else {
                  // If roles fetch fails, still return switch back success
                  return switchBackSuccess(response.data)
                }
              }),
              catchError((rolesError) => {
                console.log('Available roles fetch failed after switch back:', rolesError.message)
                // If roles fetch fails, still return switch back success
                return of(switchBackSuccess(response.data))
              })
            )
          } else {
            return of(switchBackFailure(response.message))
          }
        }),
        catchError((error) => of(switchBackFailure(error.message)))
      )
    )
  )

// Export all auth epics
export const authEpics = [
  registerEpic, 
  loginEpic, 
  getProfileEpic, 
  updateProfileEpic,
  getAvailableRolesEpic,
  switchRoleEpic,
  switchBackEpic
]
