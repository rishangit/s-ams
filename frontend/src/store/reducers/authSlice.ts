import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, AuthResponse } from '../../services/api'
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
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
import { logoutAndClearData } from '../actions/logoutActions'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  profileRequestInProgress: boolean
  lastProfileRequestTime: number | null
  availableRoles: any[]
  currentRole: any
  roleSwitching: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
  profileRequestInProgress: false,
  lastProfileRequestTime: null,
  availableRoles: [],
  currentRole: null,
  roleSwitching: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerSuccess, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
        state.availableRoles = []
        state.currentRole = null
        state.roleSwitching = false
      })

    // Login
    builder
      .addCase(loginRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginSuccess, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
        state.availableRoles = []
        state.currentRole = null
        state.roleSwitching = false
      })

    // Logout
    builder.addCase(logout, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.availableRoles = []
      state.currentRole = null
      state.roleSwitching = false
      localStorage.removeItem('authToken')
    })

    // Logout and clear all data
    builder.addCase(logoutAndClearData, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.availableRoles = []
      state.currentRole = null
      state.roleSwitching = false
      localStorage.removeItem('authToken')
    })

    // Get Profile
    builder
      .addCase(getProfileRequest, (state) => {
        const now = Date.now()
        const timeSinceLastRequest = state.lastProfileRequestTime ? now - state.lastProfileRequestTime : Infinity
        
        // Only proceed if no request is in progress and enough time has passed (1 second cooldown)
        if (!state.profileRequestInProgress && timeSinceLastRequest > 1000) {
          state.loading = true
          state.error = null
          state.profileRequestInProgress = true
          state.lastProfileRequestTime = now
        }
      })
      .addCase(getProfileSuccess, (state, action: PayloadAction<{ user: User, availableRoles?: any[], currentRole?: any }>) => {
        state.loading = false
        state.user = action.payload.user
        state.error = null
        state.profileRequestInProgress = false
        
        // Update available roles and current role if provided
        if (action.payload.availableRoles) {
          state.availableRoles = action.payload.availableRoles
        }
        if (action.payload.currentRole) {
          state.currentRole = action.payload.currentRole
        }
      })
      .addCase(getProfileFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
        state.profileRequestInProgress = false
        // If profile request fails, it might be due to invalid token
        // Check if token was removed from localStorage
        const token = localStorage.getItem('authToken')
        if (!token) {
          state.isAuthenticated = false
          state.token = null
          state.user = null
          state.availableRoles = []
          state.currentRole = null
          state.roleSwitching = false
        }
      })

    // Update Profile
    builder
      .addCase(updateProfileRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileSuccess, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(updateProfileFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get Available Roles
    builder
      .addCase(getAvailableRolesRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAvailableRolesSuccess, (state, action: PayloadAction<{ currentRole: any, availableRoles: any[] }>) => {
        state.loading = false
        state.currentRole = action.payload.currentRole
        state.availableRoles = action.payload.availableRoles
        state.error = null
      })
      .addCase(getAvailableRolesFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Switch Role
    builder
      .addCase(switchRoleRequest, (state) => {
        state.roleSwitching = true
        state.error = null
      })
      .addCase(switchRoleSuccess, (state, action: PayloadAction<AuthResponse & { availableRoles?: any[], currentRole?: any }>) => {
        state.roleSwitching = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        
        // Update available roles and current role if provided
        if (action.payload.availableRoles) {
          state.availableRoles = action.payload.availableRoles
        }
        if (action.payload.currentRole) {
          state.currentRole = action.payload.currentRole
        }
      })
      .addCase(switchRoleFailure, (state, action: PayloadAction<string>) => {
        state.roleSwitching = false
        state.error = action.payload
      })

    // Switch Back
    builder
      .addCase(switchBackRequest, (state) => {
        state.roleSwitching = true
        state.error = null
      })
      .addCase(switchBackSuccess, (state, action: PayloadAction<AuthResponse & { availableRoles?: any[], currentRole?: any }>) => {
        state.roleSwitching = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        
        // Update available roles and current role if provided
        if (action.payload.availableRoles) {
          state.availableRoles = action.payload.availableRoles
        }
        if (action.payload.currentRole) {
          state.currentRole = action.payload.currentRole
        }
      })
      .addCase(switchBackFailure, (state, action: PayloadAction<string>) => {
        state.roleSwitching = false
        state.error = action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
