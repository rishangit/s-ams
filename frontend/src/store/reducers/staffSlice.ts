import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getStaffRequest,
  getStaffSuccess,
  getStaffFailure,
  getStaffByCompanyIdRequest,
  getStaffByCompanyIdSuccess,
  getStaffByCompanyIdFailure,
  getStaffByIdRequest,
  getStaffByIdSuccess,
  getStaffByIdFailure,
  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,
  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
  getAvailableUsersRequest,
  getAvailableUsersSuccess,
  getAvailableUsersFailure,
  clearStaffMessages,
  Staff
} from '../actions/staffActions'

interface StaffState {
  staff: Staff[] | null
  currentStaff: Staff | null
  availableUsers: any[] | null
  loading: boolean
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  error: string | null
  success: string | null
}

const initialState: StaffState = {
  staff: null,
  currentStaff: null,
  availableUsers: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  success: null
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffMessages: (state) => {
      state.error = null
      state.success = null
    }
  },
  extraReducers: (builder) => {
    // Get staff
    builder
      .addCase(getStaffRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStaffSuccess, (state, action: PayloadAction<Staff[]>) => {
        state.loading = false
        state.staff = action.payload
        state.error = null
      })
      .addCase(getStaffFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get staff by company ID
    builder
      .addCase(getStaffByCompanyIdRequest, (state) => {
        console.log('getStaffByCompanyIdRequest reducer triggered')
        state.loading = true
        state.error = null
      })
      .addCase(getStaffByCompanyIdSuccess, (state, action: PayloadAction<Staff[]>) => {
        console.log('getStaffByCompanyIdSuccess reducer triggered with data:', action.payload)
        state.loading = false
        state.staff = action.payload
        state.error = null
      })
      .addCase(getStaffByCompanyIdFailure, (state, action: PayloadAction<string>) => {
        console.log('getStaffByCompanyIdFailure reducer triggered with error:', action.payload)
        state.loading = false
        state.error = action.payload
      })

    // Get staff by ID
    builder
      .addCase(getStaffByIdRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStaffByIdSuccess, (state, action: PayloadAction<Staff>) => {
        state.loading = false
        state.currentStaff = action.payload
        state.error = null
      })
      .addCase(getStaffByIdFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Create staff
    builder
      .addCase(createStaffRequest, (state) => {
        state.createLoading = true
        state.error = null
        state.success = null
      })
      .addCase(createStaffSuccess, (state, action: PayloadAction<Staff>) => {
        state.createLoading = false
        state.success = 'Staff member added successfully'
        if (state.staff) {
          state.staff.unshift(action.payload)
        } else {
          state.staff = [action.payload]
        }
        state.error = null
      })
      .addCase(createStaffFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
        state.success = null
      })

    // Update staff
    builder
      .addCase(updateStaffRequest, (state) => {
        state.updateLoading = true
        state.error = null
        state.success = null
      })
      .addCase(updateStaffSuccess, (state, action: PayloadAction<Staff>) => {
        state.updateLoading = false
        state.success = 'Staff member updated successfully'
        if (state.staff) {
          const index = state.staff.findIndex((staff: Staff) => staff.id === action.payload.id)
          if (index !== -1) {
            state.staff[index] = action.payload
          }
        }
        if (state.currentStaff && state.currentStaff.id === action.payload.id) {
          state.currentStaff = action.payload
        }
        state.error = null
      })
      .addCase(updateStaffFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
        state.success = null
      })

    // Delete staff
    builder
      .addCase(deleteStaffRequest, (state) => {
        state.deleteLoading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteStaffSuccess, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false
        state.success = 'Staff member removed successfully'
        if (state.staff) {
          state.staff = state.staff.filter((staff: Staff) => staff.id !== action.payload)
        }
        if (state.currentStaff && state.currentStaff.id === action.payload) {
          state.currentStaff = null
        }
        state.error = null
      })
      .addCase(deleteStaffFailure, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.error = action.payload
        state.success = null
      })

    // Get available users
    builder
      .addCase(getAvailableUsersRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAvailableUsersSuccess, (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.availableUsers = action.payload
        state.error = null
      })
      .addCase(getAvailableUsersFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear messages
    builder
      .addCase(clearStaffMessages, (state) => {
        state.error = null
        state.success = null
      })
  }
})

export const { clearStaffMessages: clearStaffMessagesAction } = staffSlice.actions
export default staffSlice.reducer

