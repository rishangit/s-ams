import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createServiceRequest,
  createServiceSuccess,
  createServiceFailure,
  getServicesRequest,
  getServicesSuccess,
  getServicesFailure,
  getServicesByCompanyIdRequest,
  getServicesByCompanyIdSuccess,
  getServicesByCompanyIdFailure,
  getServiceByIdRequest,
  getServiceByIdSuccess,
  getServiceByIdFailure,
  updateServiceRequest,
  updateServiceSuccess,
  updateServiceFailure,
  updateServiceStatusRequest,
  updateServiceStatusSuccess,
  updateServiceStatusFailure,
  deleteServiceRequest,
  deleteServiceSuccess,
  deleteServiceFailure,
  clearServicesMessages,
  Service
} from '../actions/servicesActions'

interface ServicesState {
  services: Service[] | null
  currentService: Service | null
  loading: boolean
  getServiceByIdLoading: boolean
  error: string | null
  success: string | null
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: ServicesState = {
  services: null,
  currentService: null,
  loading: false,
  getServiceByIdLoading: false,
  error: null,
  success: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create service
    builder
      .addCase(createServiceRequest, (state) => {
        state.createLoading = true
        state.error = null
        state.success = null
      })
      .addCase(createServiceSuccess, (state, action: PayloadAction<Service>) => {
        state.createLoading = false
        state.currentService = action.payload
        state.success = 'Service created successfully!'
        // Add to services list if it exists
        if (state.services) {
          state.services.push(action.payload)
        }
      })
      .addCase(createServiceFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
      })

    // Get services
    builder
      .addCase(getServicesRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getServicesSuccess, (state, action: PayloadAction<Service[]>) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(getServicesFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get services by company ID
    builder
      .addCase(getServicesByCompanyIdRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getServicesByCompanyIdSuccess, (state, action: PayloadAction<Service[]>) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(getServicesByCompanyIdFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get service by ID
    builder
      .addCase(getServiceByIdRequest, (state) => {
        state.getServiceByIdLoading = true
        state.error = null
      })
      .addCase(getServiceByIdSuccess, (state, action: PayloadAction<Service>) => {
        state.getServiceByIdLoading = false
        state.currentService = action.payload
      })
      .addCase(getServiceByIdFailure, (state, action: PayloadAction<string>) => {
        state.getServiceByIdLoading = false
        state.error = action.payload
      })

    // Update service
    builder
      .addCase(updateServiceRequest, (state) => {
        state.updateLoading = true
        state.error = null
        state.success = null
      })
      .addCase(updateServiceSuccess, (state, action: PayloadAction<Service>) => {
        state.updateLoading = false
        state.currentService = action.payload
        state.success = 'Service updated successfully!'
        // Update in services list if it exists
        if (state.services) {
          const index = state.services.findIndex(service => service.id === action.payload.id)
          if (index !== -1) {
            state.services[index] = action.payload
          }
        }
      })
      .addCase(updateServiceFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Update service status
    builder
      .addCase(updateServiceStatusRequest, (state) => {
        state.updateLoading = true
        state.error = null
        state.success = null
      })
      .addCase(updateServiceStatusSuccess, (state, action: PayloadAction<Service>) => {
        state.updateLoading = false
        state.currentService = action.payload
        state.success = 'Service status updated successfully!'
        // Update in services list if it exists
        if (state.services) {
          const index = state.services.findIndex(service => service.id === action.payload.id)
          if (index !== -1) {
            state.services[index] = action.payload
          }
        }
      })
      .addCase(updateServiceStatusFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Delete service
    builder
      .addCase(deleteServiceRequest, (state) => {
        state.deleteLoading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteServiceSuccess, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false
        state.success = 'Service deleted successfully!'
        // Remove from services list if it exists
        if (state.services) {
          state.services = state.services.filter(service => service.id !== action.payload)
        }
        // Clear current service if it was deleted
        if (state.currentService && state.currentService.id === action.payload) {
          state.currentService = null
        }
      })
      .addCase(deleteServiceFailure, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.error = action.payload
      })

    // Clear messages
    builder
      .addCase(clearServicesMessages, (state) => {
        state.error = null
        state.success = null
      })
  }
})

export default servicesSlice.reducer
