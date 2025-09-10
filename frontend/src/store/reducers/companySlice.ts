import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Company } from '../../constants/company'
import {
  createCompanyRequest,
  createCompanySuccess,
  createCompanyFailure,
  updateCompanyRequest,
  updateCompanySuccess,
  updateCompanyFailure,
  getCompanyByUserRequest,
  getCompanyByUserSuccess,
  getCompanyByUserFailure,
  getCompanyByIdRequest,
  getCompanyByIdSuccess,
  getCompanyByIdFailure,
  getCompaniesForBookingRequest,
  getCompaniesForBookingSuccess,
  getCompaniesForBookingFailure,
  getAllCompaniesRequest,
  getAllCompaniesSuccess,
  getAllCompaniesFailure,
  updateCompanyStatusRequest,
  updateCompanyStatusSuccess,
  updateCompanyStatusFailure,
  deleteCompanyRequest,
  deleteCompanySuccess,
  deleteCompanyFailure,
  clearCompanyError,
  clearCompanySuccess,
  clearCompanyData
} from '../actions/companyActions'
import { logoutAndClearData } from '../actions/logoutActions'
import { logout } from '../actions/authActions'

interface CompanyState {
  company: Company | null
  companies: Company[] | null
  loading: boolean
  error: string | null
  success: string | null
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: CompanyState = {
  company: null,
  companies: null,
  loading: false,
  error: null,
  success: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create company
    builder
      .addCase(createCompanyRequest, (state) => {
        state.createLoading = true
        state.error = null
        state.success = null
      })
      .addCase(createCompanySuccess, (state, action: PayloadAction<Company>) => {
        state.createLoading = false
        state.company = action.payload
        state.success = 'Company registration request submitted successfully!'
      })
      .addCase(createCompanyFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
      })

    // Update company
    builder
      .addCase(updateCompanyRequest, (state) => {
        state.updateLoading = true
        state.error = null
        state.success = null
      })
      .addCase(updateCompanySuccess, (state, action: PayloadAction<Company>) => {
        state.updateLoading = false
        state.company = action.payload
        state.success = 'Company details updated successfully!'
      })
      .addCase(updateCompanyFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Get company by user
    builder
      .addCase(getCompanyByUserRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCompanyByUserSuccess, (state, action: PayloadAction<Company>) => {
        state.loading = false
        state.company = action.payload
      })
      .addCase(getCompanyByUserFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get company by ID
    builder
      .addCase(getCompanyByIdRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCompanyByIdSuccess, (state, action: PayloadAction<Company>) => {
        state.loading = false
        state.company = action.payload
      })
      .addCase(getCompanyByIdFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get companies for booking
    builder
      .addCase(getCompaniesForBookingRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCompaniesForBookingSuccess, (state, action: PayloadAction<Company[]>) => {
        state.loading = false
        state.companies = action.payload
      })
      .addCase(getCompaniesForBookingFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

                // Get all companies
            builder
              .addCase(getAllCompaniesRequest, (state) => {
                state.loading = true
                state.error = null
              })
              .addCase(getAllCompaniesSuccess, (state, action: PayloadAction<Company[]>) => {
                state.loading = false
                state.companies = action.payload
              })
              .addCase(getAllCompaniesFailure, (state, action: PayloadAction<string>) => {
                state.loading = false
                state.error = action.payload
              })

            // Update company status
            builder
              .addCase(updateCompanyStatusRequest, (state) => {
                state.updateLoading = true
                state.error = null
                state.success = null
              })
              .addCase(updateCompanyStatusSuccess, (state, action: PayloadAction<Company>) => {
                state.updateLoading = false
                // Update the company in the companies list
                if (state.companies) {
                  const index = state.companies.findIndex(c => c.id === action.payload.id)
                  if (index !== -1) {
                    state.companies[index] = action.payload
                  }
                }
                state.success = 'Company status updated successfully!'
              })
              .addCase(updateCompanyStatusFailure, (state, action: PayloadAction<string>) => {
                state.updateLoading = false
                state.error = action.payload
              })

            // Delete company
            builder
              .addCase(deleteCompanyRequest, (state) => {
                state.deleteLoading = true
                state.error = null
                state.success = null
              })
              .addCase(deleteCompanySuccess, (state, action: PayloadAction<number>) => {
                state.deleteLoading = false
                // Remove the company from the companies list
                if (state.companies) {
                  state.companies = state.companies.filter(c => c.id !== action.payload)
                }
                state.success = 'Company deleted successfully!'
              })
              .addCase(deleteCompanyFailure, (state, action: PayloadAction<string>) => {
                state.deleteLoading = false
                state.error = action.payload
              })

            // Clear messages
            builder
              .addCase(clearCompanyError, (state) => {
                state.error = null
              })
              .addCase(clearCompanySuccess, (state) => {
                state.success = null
              })
              .addCase(clearCompanyData, (state) => {
                state.company = null
                state.companies = null
                state.loading = false
                state.error = null
                state.success = null
                state.createLoading = false
                state.updateLoading = false
                state.deleteLoading = false
              })
              .addCase(logoutAndClearData, (state) => {
                state.company = null
                state.companies = null
                state.loading = false
                state.error = null
                state.success = null
                state.createLoading = false
                state.updateLoading = false
                state.deleteLoading = false
              })
              .addCase(logout, (state) => {
                state.company = null
                state.companies = null
                state.loading = false
                state.error = null
                state.success = null
                state.createLoading = false
                state.updateLoading = false
                state.deleteLoading = false
              })
  }
})

export default companySlice.reducer
