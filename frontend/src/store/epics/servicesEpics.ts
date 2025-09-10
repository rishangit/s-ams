import { ofType } from 'redux-observable'
import { switchMap, map, catchError, of, from } from 'rxjs'
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
  deleteServiceFailure
} from '../actions/servicesActions'
import { apiService } from '../../services/api'

// Create service epic
export const createServiceEpic = (action$: any) =>
  action$.pipe(
    ofType(createServiceRequest.type),
    switchMap((action: any) => {
      return from(apiService.createService(action.payload)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.service) {
            return createServiceSuccess(response.data.service)
          } else {
            return createServiceFailure(response.message || 'Failed to create service')
          }
        }),
        catchError((error) => {
          return of(createServiceFailure(error.message || 'Failed to create service'))
        })
      )
    })
  )

// Get services epic
export const getServicesEpic = (action$: any) =>
  action$.pipe(
    ofType(getServicesRequest.type),
    switchMap(() => {
      return from(apiService.getServices()).pipe(
        map((response) => {
          if (response.success && response.data && response.data.services) {
            return getServicesSuccess(response.data.services)
          } else {
            return getServicesFailure(response.message || 'Failed to fetch services')
          }
        }),
        catchError((error) => {
          return of(getServicesFailure(error.message || 'Failed to fetch services'))
        })
      )
    })
  )

// Get services by company ID epic
export const getServicesByCompanyIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getServicesByCompanyIdRequest.type),
    switchMap((action: any) => {
      return from(apiService.getServicesByCompanyId(action.payload)).pipe(
        map((response: any) => {
          if (response.success && response.data && response.data.services) {
            return getServicesByCompanyIdSuccess(response.data.services)
          } else {
            return getServicesByCompanyIdFailure(response.message || 'Failed to fetch services')
          }
        }),
        catchError((error) => {
          return of(getServicesByCompanyIdFailure(error.message || 'Failed to fetch services'))
        })
      )
    })
  )

// Get service by ID epic
export const getServiceByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getServiceByIdRequest.type),
    switchMap((action: any) => {
      const serviceId = action.payload
      return from(apiService.getServiceById(serviceId)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.service) {
            return getServiceByIdSuccess(response.data.service)
          } else {
            return getServiceByIdFailure(response.message || 'Failed to fetch service')
          }
        }),
        catchError((error) => {
          return of(getServiceByIdFailure(error.message || 'Failed to fetch service'))
        })
      )
    })
  )

// Update service epic
export const updateServiceEpic = (action$: any) =>
  action$.pipe(
    ofType(updateServiceRequest.type),
    switchMap((action: any) => {
      const { id, ...serviceData } = action.payload
      return from(apiService.updateService(id, serviceData)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.service) {
            return updateServiceSuccess(response.data.service)
          } else {
            return updateServiceFailure(response.message || 'Failed to update service')
          }
        }),
        catchError((error) => {
          return of(updateServiceFailure(error.message || 'Failed to update service'))
        })
      )
    })
  )

// Update service status epic
export const updateServiceStatusEpic = (action$: any) =>
  action$.pipe(
    ofType(updateServiceStatusRequest.type),
    switchMap((action: any) => {
      const { id, status } = action.payload
      return from(apiService.updateServiceStatus(id, status)).pipe(
        map((response) => {
          if (response.success && response.data && response.data.service) {
            return updateServiceStatusSuccess(response.data.service)
          } else {
            return updateServiceStatusFailure(response.message || 'Failed to update service status')
          }
        }),
        catchError((error) => {
          return of(updateServiceStatusFailure(error.message || 'Failed to update service status'))
        })
      )
    })
  )

// Delete service epic
export const deleteServiceEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteServiceRequest.type),
    switchMap((action: any) => {
      const serviceId = action.payload
      return from(apiService.deleteService(serviceId)).pipe(
        map((response) => {
          if (response.success) {
            return deleteServiceSuccess(serviceId)
          } else {
            return deleteServiceFailure(response.message || 'Failed to delete service')
          }
        }),
        catchError((error) => {
          return of(deleteServiceFailure(error.message || 'Failed to delete service'))
        })
      )
    })
  )
