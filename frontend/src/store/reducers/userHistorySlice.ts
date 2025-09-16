import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  getCompanyStatsFailure,
  clearUserHistoryMessages,
  UserHistory
} from '../actions/userHistoryActions'

interface UserHistoryState {
  userHistory: UserHistory[]
  currentHistory: UserHistory | null
  companyStats: {
    totalAppointments: number
    totalRevenue: number
    averageCost: number
    uniqueCustomers: number
  } | null
  loading: boolean
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  getHistoryLoading: boolean
  getStatsLoading: boolean
  error: string | null
  success: string | null
}

const initialState: UserHistoryState = {
  userHistory: [],
  currentHistory: null,
  companyStats: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  getHistoryLoading: false,
  getStatsLoading: false,
  error: null,
  success: null
}

const userHistorySlice = createSlice({
  name: 'userHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create User History
    builder
      .addCase(createUserHistoryRequest, (state) => {
        state.createLoading = true
        state.error = null
        state.success = null
      })
      .addCase(createUserHistorySuccess, (state, action: PayloadAction<UserHistory>) => {
        state.createLoading = false
        state.userHistory.unshift(action.payload)
        state.success = 'User history created successfully'
        state.error = null
      })
      .addCase(createUserHistoryFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
        state.success = null
      })

    // Get User History by ID
    builder
      .addCase(getUserHistoryRequest, (state) => {
        state.getHistoryLoading = true
        state.error = null
      })
      .addCase(getUserHistorySuccess, (state, action: PayloadAction<UserHistory>) => {
        state.getHistoryLoading = false
        state.currentHistory = action.payload
        state.error = null
      })
      .addCase(getUserHistoryFailure, (state, action: PayloadAction<string>) => {
        state.getHistoryLoading = false
        state.error = action.payload
      })

    // Get User History by Appointment ID
    builder
      .addCase(getUserHistoryByAppointmentIdRequest, (state) => {
        state.getHistoryLoading = true
        state.error = null
      })
      .addCase(getUserHistoryByAppointmentIdSuccess, (state, action: PayloadAction<UserHistory>) => {
        state.getHistoryLoading = false
        state.currentHistory = action.payload
        state.error = null
      })
      .addCase(getUserHistoryByAppointmentIdFailure, (state, action: PayloadAction<string>) => {
        state.getHistoryLoading = false
        state.error = action.payload
      })

    // Get Company User History
    builder
      .addCase(getCompanyUserHistoryRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCompanyUserHistorySuccess, (state, action: PayloadAction<UserHistory[]>) => {
        state.loading = false
        state.userHistory = action.payload
        state.error = null
      })
      .addCase(getCompanyUserHistoryFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get User History by User ID
    builder
      .addCase(getUserHistoryByUserIdRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserHistoryByUserIdSuccess, (state, action: PayloadAction<UserHistory[]>) => {
        state.loading = false
        state.userHistory = action.payload
        state.error = null
      })
      .addCase(getUserHistoryByUserIdFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Update User History
    builder
      .addCase(updateUserHistoryRequest, (state) => {
        state.updateLoading = true
        state.error = null
        state.success = null
      })
      .addCase(updateUserHistorySuccess, (state, action: PayloadAction<UserHistory>) => {
        state.updateLoading = false
        const index = state.userHistory.findIndex(history => history.id === action.payload.id)
        if (index !== -1) {
          state.userHistory[index] = action.payload
        }
        if (state.currentHistory && state.currentHistory.id === action.payload.id) {
          state.currentHistory = action.payload
        }
        state.success = 'User history updated successfully'
        state.error = null
      })
      .addCase(updateUserHistoryFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
        state.success = null
      })

    // Delete User History
    builder
      .addCase(deleteUserHistoryRequest, (state) => {
        state.deleteLoading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteUserHistorySuccess, (state, action: PayloadAction<{ id: number }>) => {
        state.deleteLoading = false
        state.userHistory = state.userHistory.filter(history => history.id !== action.payload.id)
        if (state.currentHistory && state.currentHistory.id === action.payload.id) {
          state.currentHistory = null
        }
        state.success = 'User history deleted successfully'
        state.error = null
      })
      .addCase(deleteUserHistoryFailure, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.error = action.payload
        state.success = null
      })

    // Get Company Stats
    builder
      .addCase(getCompanyStatsRequest, (state) => {
        state.getStatsLoading = true
        state.error = null
      })
      .addCase(getCompanyStatsSuccess, (state, action: PayloadAction<{
        totalAppointments: number
        totalRevenue: number
        averageCost: number
        uniqueCustomers: number
      }>) => {
        state.getStatsLoading = false
        state.companyStats = action.payload
        state.error = null
      })
      .addCase(getCompanyStatsFailure, (state, action: PayloadAction<string>) => {
        state.getStatsLoading = false
        state.error = action.payload
      })

    // Clear Messages
    builder
      .addCase(clearUserHistoryMessages, (state) => {
        state.error = null
        state.success = null
      })
  }
})

export default userHistorySlice.reducer

