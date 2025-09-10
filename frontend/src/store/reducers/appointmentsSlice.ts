import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  getAppointmentsByUserRequest,
  getAppointmentsByUserSuccess,
  getAppointmentsByUserFailure,
  getAppointmentsByCompanyRequest,
  getAppointmentsByCompanySuccess,
  getAppointmentsByCompanyFailure,
  getAllAppointmentsRequest,
  getAllAppointmentsSuccess,
  getAllAppointmentsFailure,
  getAppointmentByIdRequest,
  getAppointmentByIdSuccess,
  getAppointmentByIdFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  updateAppointmentStatusRequest,
  updateAppointmentStatusSuccess,
  updateAppointmentStatusFailure,
  deleteAppointmentRequest,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
  getAppointmentStatsRequest,
  getAppointmentStatsSuccess,
  getAppointmentStatsFailure,
  clearAppointmentsMessages,
  Appointment
} from '../actions/appointmentsActions'

interface AppointmentsState {
  appointments: Appointment[] | null
  currentAppointment: Appointment | null
  formAppointment: Appointment | null  // Separate state for form editing
  formLoading: boolean  // Separate loading state for form
  stats: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  } | null
  loading: boolean
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  error: string | null
  success: string | null
}

const initialState: AppointmentsState = {
  appointments: null,
  currentAppointment: null,
  formAppointment: null,
  formLoading: false,
  stats: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  success: null
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create appointment
    builder
      .addCase(createAppointmentRequest, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createAppointmentSuccess, (state, action: PayloadAction<Appointment>) => {
        state.createLoading = false
        state.currentAppointment = action.payload
        state.success = 'Appointment created successfully!'
        // Don't add the appointment to the list here since it doesn't have joined data
        // The grid will refresh automatically when the appointments are refetched
      })
      .addCase(createAppointmentFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
      })

    // Get appointments by user
    builder
      .addCase(getAppointmentsByUserRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAppointmentsByUserSuccess, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false
        state.appointments = action.payload
      })
      .addCase(getAppointmentsByUserFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get appointments by company
    builder
      .addCase(getAppointmentsByCompanyRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAppointmentsByCompanySuccess, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false
        state.appointments = action.payload
      })
      .addCase(getAppointmentsByCompanyFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get all appointments
    builder
      .addCase(getAllAppointmentsRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllAppointmentsSuccess, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false
        state.appointments = action.payload
      })
      .addCase(getAllAppointmentsFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get appointment by ID
    builder
      .addCase(getAppointmentByIdRequest, (state) => {
        // Don't set main loading state to avoid affecting grid
        state.error = null
      })
      .addCase(getAppointmentByIdSuccess, (state, action: PayloadAction<Appointment>) => {
        state.currentAppointment = action.payload
      })
      .addCase(getAppointmentByIdFailure, (state, action: PayloadAction<string>) => {
        state.error = action.payload
      })

    // Update appointment
    builder
      .addCase(updateAppointmentRequest, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateAppointmentSuccess, (state, action: PayloadAction<Appointment>) => {
        state.updateLoading = false
        state.currentAppointment = action.payload
        state.success = 'Appointment updated successfully!'
        if (state.appointments) {
          const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id)
          if (index !== -1) {
            state.appointments[index] = action.payload
          }
        }
      })
      .addCase(updateAppointmentFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Update appointment status
    builder
      .addCase(updateAppointmentStatusRequest, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateAppointmentStatusSuccess, (state, action: PayloadAction<Appointment>) => {
        state.updateLoading = false
        state.currentAppointment = action.payload
        state.success = 'Appointment status updated successfully!'
        if (state.appointments) {
          const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id)
          if (index !== -1) {
            state.appointments[index] = action.payload
          }
        }
      })
      .addCase(updateAppointmentStatusFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Delete appointment
    builder
      .addCase(deleteAppointmentRequest, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteAppointmentSuccess, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false
        state.success = 'Appointment deleted successfully!'
        if (state.appointments) {
          state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload)
        }
        if (state.currentAppointment && state.currentAppointment.id === action.payload) {
          state.currentAppointment = null
        }
      })
      .addCase(deleteAppointmentFailure, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.error = action.payload
      })

    // Get appointment statistics
    builder
      .addCase(getAppointmentStatsRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAppointmentStatsSuccess, (state, action: PayloadAction<{
        total: number
        pending: number
        confirmed: number
        completed: number
        cancelled: number
      }>) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(getAppointmentStatsFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear messages
    builder
      .addCase(clearAppointmentsMessages, (state) => {
        state.error = null
        state.success = null
      })
  }
})

export default appointmentsSlice.reducer

