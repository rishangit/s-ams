import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailure,
  updateUserRoleRequest,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  getUsersByRoleRequest,
  getUsersByRoleSuccess,
  getUsersByRoleFailure,
  clearUsersError,
  clearUsersSuccess
} from '../actions/userActions'
import { logoutAndClearData, logout } from '../actions'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number
  profileImage?: string
  createdAt: string
  updatedAt: string
}

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  success: string | null
  updateLoading: boolean
  updateError: string | null
  updateSuccess: string | null
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  success: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get all users
    builder
      .addCase(getAllUsersRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllUsersSuccess, (state, action: PayloadAction<{ users: User[] }>) => {
        state.loading = false
        state.users = action.payload.users
        state.error = null
      })
      .addCase(getAllUsersFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Update user role
    builder
      .addCase(updateUserRoleRequest, (state) => {
        state.updateLoading = true
        state.updateError = null
        state.updateSuccess = null
      })
      .addCase(updateUserRoleSuccess, (state, action: PayloadAction<{ user: User }>) => {
        state.updateLoading = false
        state.updateSuccess = 'User role updated successfully'
        state.updateError = null
        
        // Update the user in the users array
        const updatedUser = action.payload.user
        const userIndex = state.users.findIndex(user => user.id === updatedUser.id)
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser
        }
      })
      .addCase(updateUserRoleFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.updateError = action.payload
        state.updateSuccess = null
      })

    // Get users by role
    builder
      .addCase(getUsersByRoleRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUsersByRoleSuccess, (state, action: PayloadAction<{ users: User[] }>) => {
        state.loading = false
        state.users = action.payload.users
        state.error = null
      })
      .addCase(getUsersByRoleFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear messages
    builder
      .addCase(clearUsersError, (state) => {
        state.error = null
        state.updateError = null
      })
      .addCase(clearUsersSuccess, (state) => {
        state.success = null
        state.updateSuccess = null
      })

    // Clear data on logout
    builder
      .addCase(logoutAndClearData, (state) => {
        state.users = []
        state.loading = false
        state.error = null
        state.success = null
        state.updateLoading = false
        state.updateError = null
        state.updateSuccess = null
      })
      .addCase(logout, (state) => {
        state.users = []
        state.loading = false
        state.error = null
        state.success = null
        state.updateLoading = false
        state.updateError = null
        state.updateSuccess = null
      })
  }
})

export default usersSlice.reducer
