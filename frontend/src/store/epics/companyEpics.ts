import { ofType } from 'redux-observable'
import { switchMap, map, catchError, of, from } from 'rxjs'
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
  getCompaniesByUserAppointmentsRequest,
  getCompaniesByUserAppointmentsSuccess,
  getCompaniesByUserAppointmentsFailure
} from '../actions/companyActions'
import { apiService } from '../../services/api'

// Create company epic
export const createCompanyEpic = (action$: any) =>
  action$.pipe(
    ofType(createCompanyRequest.type),
    switchMap((action: any) => {
      return from(apiService.createCompany(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.company) {
            return createCompanySuccess(response.data.company)
          } else {
            return createCompanyFailure(response.message || 'Failed to create company')
          }
        }),
        catchError((error) => {
          return of(createCompanyFailure(error.message || 'Failed to create company'))
        })
      )
    })
  )

// Update company epic
export const updateCompanyEpic = (action$: any) =>
  action$.pipe(
    ofType(updateCompanyRequest.type),
    switchMap((action: any) => {
      const { id, data } = action.payload
      return from(apiService.updateCompany(id, data)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.company) {
            return updateCompanySuccess(response.data.company)
          } else {
            return updateCompanyFailure(response.message || 'Failed to update company')
          }
        }),
        catchError((error) => {
          return of(updateCompanyFailure(error.message || 'Failed to update company'))
        })
      )
    })
  )

// Get company by user epic
export const getCompanyByUserEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompanyByUserRequest.type),
    switchMap((action: any) => {
      const userId = action.payload
      return from(apiService.getCompanyByUser(userId)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.company) {
            return getCompanyByUserSuccess(response.data.company)
          } else {
            return getCompanyByUserFailure(response.message || 'Failed to fetch company')
          }
        }),
        catchError((error) => {
          return of(getCompanyByUserFailure(error.message || 'Failed to fetch company'))
        })
      )
    })
  )

// Get company by ID epic
export const getCompanyByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompanyByIdRequest.type),
    switchMap((action: any) => {
      const companyId = action.payload
      return from(apiService.getCompanyById(companyId)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.company) {
            return getCompanyByIdSuccess(response.data.company)
          } else {
            return getCompanyByIdFailure(response.message || 'Failed to fetch company')
          }
        }),
        catchError((error) => {
          return of(getCompanyByIdFailure(error.message || 'Failed to fetch company'))
        })
      )
    })
  )

// Get companies for booking epic (authenticated users)
export const getCompaniesForBookingEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompaniesForBookingRequest.type),
    switchMap(() => {
      return from(apiService.getCompaniesForBooking()).pipe(
        map((response: any) => {
          if (response.success && response.data && response.data.companies) {
            return getCompaniesForBookingSuccess(response.data.companies)
          } else {
            return getCompaniesForBookingFailure(response.message || 'Failed to fetch companies')
          }
        }),
        catchError((error) => {
          return of(getCompaniesForBookingFailure(error.message || 'Failed to fetch companies'))
        })
      )
    })
  )

// Get all companies epic (admin only)
export const getAllCompaniesEpic = (action$: any) =>
  action$.pipe(
    ofType(getAllCompaniesRequest.type),
    switchMap(() => {
      return from(apiService.getAllCompanies()).pipe(
        map((response) => {
          if (response.success && response.data && response.data.companies) {
            return getAllCompaniesSuccess(response.data.companies)
          } else {
            return getAllCompaniesFailure(response.message || 'Failed to fetch companies')
          }
        }),
        catchError((error) => {
          return of(getAllCompaniesFailure(error.message || 'Failed to fetch companies'))
        })
      )
    })
  )

// Update company status epic (admin only)
export const updateCompanyStatusEpic = (action$: any) =>
  action$.pipe(
    ofType(updateCompanyStatusRequest.type),
    switchMap((action: any) => {
      const { id, status } = action.payload
      return from(apiService.updateCompanyStatus(id, status)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.company) {
            return updateCompanyStatusSuccess(response.data.company)
          } else {
            return updateCompanyStatusFailure(response.message || 'Failed to update company status')
          }
        }),
        catchError((error) => {
          return of(updateCompanyStatusFailure(error.message || 'Failed to update company status'))
        })
      )
    })
  )

// Delete company epic (admin only)
export const deleteCompanyEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteCompanyRequest.type),
    switchMap((action: any) => {
      const companyId = action.payload
      return from(apiService.deleteCompany(companyId)).pipe(
        map((response) => {
          if (response.success) {
            return deleteCompanySuccess(companyId)
          } else {
            return deleteCompanyFailure(response.message || 'Failed to delete company')
          }
        }),
        catchError((error) => {
          return of(deleteCompanyFailure(error.message || 'Failed to delete company'))
        })
      )
    })
  )


// Get companies by user appointments epic
export const getCompaniesByUserAppointmentsEpic = (action$: any) =>
  action$.pipe(
    ofType(getCompaniesByUserAppointmentsRequest.type),
    switchMap(() => {
      console.log('getCompaniesByUserAppointmentsEpic: API call starting')
      return from(apiService.getCompaniesByUserAppointments()).pipe(
        map((response) => {
          console.log('getCompaniesByUserAppointmentsEpic: API response:', response)
          if (response.success && response.data) {
            return getCompaniesByUserAppointmentsSuccess(response.data)
          } else {
            return getCompaniesByUserAppointmentsFailure(response.error || 'Failed to fetch companies')
          }
        }),
        catchError((error) => {
          console.error('getCompaniesByUserAppointmentsEpic: API error:', error)
          return of(getCompaniesByUserAppointmentsFailure(error.message || 'Failed to fetch companies'))
        })
      )
    })
  )

