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
  getAllCompaniesRequest,
  getAllCompaniesSuccess,
  getAllCompaniesFailure,
  updateCompanyStatusRequest,
  updateCompanyStatusSuccess,
  updateCompanyStatusFailure,
  deleteCompanyRequest,
  deleteCompanySuccess,
  deleteCompanyFailure
} from '../actions/companyActions'
import { apiService } from '../../services/api'

// Create company epic
export const createCompanyEpic = (action$: any) =>
  action$.pipe(
    ofType(createCompanyRequest.type),
    switchMap((action: any) => {
      return from(apiService.createCompany(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data) {
            return createCompanySuccess(response.data)
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
          if (response.success && response.data) {
            return updateCompanySuccess(response.data)
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
          if (response.success && response.data) {
            return getCompanyByUserSuccess(response.data)
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
          if (response.success && response.data) {
            return updateCompanyStatusSuccess(response.data)
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
