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
} from '../actions'
import { logoutAndClearData } from '../actions/logoutActions'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
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
      })

    // Logout
    builder.addCase(logout, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('authToken')
    })

    // Logout and clear all data
    builder.addCase(logoutAndClearData, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('authToken')
    })

    // Get Profile
    builder
      .addCase(getProfileRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfileSuccess, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(getProfileFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
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
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
