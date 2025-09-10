import { ofType } from 'redux-observable'
import { switchMap, map, catchError, of, from } from 'rxjs'
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
  getAppointmentStatsFailure
} from '../actions/appointmentsActions'
import { apiService } from '../../services/api'

// Create appointment epic
export const createAppointmentEpic = (action$: any) =>
  action$.pipe(
    ofType(createAppointmentRequest.type),
    switchMap((action: any) => {
      return from(apiService.createAppointment(action.payload)).pipe(
        map((response) => {
          if (response.success) {
            return createAppointmentSuccess(response.data)
          } else {
            return createAppointmentFailure(response.message || 'Failed to create appointment')
          }
        }),
        catchError((error) => {
          return of(createAppointmentFailure(error.message || 'Failed to create appointment'))
        })
      )
    })
  )

// Get appointments by user epic
export const getAppointmentsByUserEpic = (action$: any) =>
  action$.pipe(
    ofType(getAppointmentsByUserRequest.type),
    switchMap(() => {
      return from(apiService.getAppointmentsByUser()).pipe(
        map((response) => {
          if (response.success) {
            return getAppointmentsByUserSuccess(response.data)
          } else {
            return getAppointmentsByUserFailure(response.message || 'Failed to fetch appointments')
          }
        }),
        catchError((error) => {
          return of(getAppointmentsByUserFailure(error.message || 'Failed to fetch appointments'))
        })
      )
    })
  )

// Get appointments by company epic
export const getAppointmentsByCompanyEpic = (action$: any) =>
  action$.pipe(
    ofType(getAppointmentsByCompanyRequest.type),
    switchMap(() => {
      return from(apiService.getAppointmentsByCompany()).pipe(
        map((response) => {
          if (response.success) {
            return getAppointmentsByCompanySuccess(response.data)
          } else {
            return getAppointmentsByCompanyFailure(response.message || 'Failed to fetch appointments')
          }
        }),
        catchError((error) => {
          return of(getAppointmentsByCompanyFailure(error.message || 'Failed to fetch appointments'))
        })
      )
    })
  )

// Get all appointments epic (admin)
export const getAllAppointmentsEpic = (action$: any) =>
  action$.pipe(
    ofType(getAllAppointmentsRequest.type),
    switchMap(() => {
      return from(apiService.getAllAppointments()).pipe(
        map((response) => {
          if (response.success) {
            return getAllAppointmentsSuccess(response.data)
          } else {
            return getAllAppointmentsFailure(response.message || 'Failed to fetch appointments')
          }
        }),
        catchError((error) => {
          return of(getAllAppointmentsFailure(error.message || 'Failed to fetch appointments'))
        })
      )
    })
  )

// Get appointment by ID epic
export const getAppointmentByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getAppointmentByIdRequest.type),
    switchMap((action: any) => {
      const appointmentId = action.payload
      return from(apiService.getAppointmentById(appointmentId)).pipe(
        map((response) => {
          if (response.success) {
            return getAppointmentByIdSuccess(response.data)
          } else {
            return getAppointmentByIdFailure(response.message || 'Failed to fetch appointment')
          }
        }),
        catchError((error) => {
          return of(getAppointmentByIdFailure(error.message || 'Failed to fetch appointment'))
        })
      )
    })
  )

// Update appointment epic
export const updateAppointmentEpic = (action$: any) =>
  action$.pipe(
    ofType(updateAppointmentRequest.type),
    switchMap((action: any) => {
      const { id, ...updateData } = action.payload
      return from(apiService.updateAppointment(id, updateData)).pipe(
        map((response) => {
          if (response.success) {
            return updateAppointmentSuccess(response.data)
          } else {
            return updateAppointmentFailure(response.message || 'Failed to update appointment')
          }
        }),
        catchError((error) => {
          return of(updateAppointmentFailure(error.message || 'Failed to update appointment'))
        })
      )
    })
  )

// Update appointment status epic
export const updateAppointmentStatusEpic = (action$: any) =>
  action$.pipe(
    ofType(updateAppointmentStatusRequest.type),
    switchMap((action: any) => {
      const { id, status } = action.payload
      return from(apiService.updateAppointmentStatus(id, status)).pipe(
        map((response) => {
          if (response.success) {
            return updateAppointmentStatusSuccess(response.data)
          } else {
            return updateAppointmentStatusFailure(response.message || 'Failed to update appointment status')
          }
        }),
        catchError((error) => {
          return of(updateAppointmentStatusFailure(error.message || 'Failed to update appointment status'))
        })
      )
    })
  )

// Delete appointment epic
export const deleteAppointmentEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteAppointmentRequest.type),
    switchMap((action: any) => {
      const appointmentId = action.payload
      return from(apiService.deleteAppointment(appointmentId)).pipe(
        map((response) => {
          if (response.success) {
            return deleteAppointmentSuccess(appointmentId)
          } else {
            return deleteAppointmentFailure(response.message || 'Failed to delete appointment')
          }
        }),
        catchError((error) => {
          return of(deleteAppointmentFailure(error.message || 'Failed to delete appointment'))
        })
      )
    })
  )

// Get appointment statistics epic
export const getAppointmentStatsEpic = (action$: any) =>
  action$.pipe(
    ofType(getAppointmentStatsRequest.type),
    switchMap(() => {
      return from(apiService.getAppointmentStats()).pipe(
        map((response) => {
          if (response.success) {
            return getAppointmentStatsSuccess(response.data)
          } else {
            return getAppointmentStatsFailure(response.message || 'Failed to fetch appointment statistics')
          }
        }),
        catchError((error) => {
          return of(getAppointmentStatsFailure(error.message || 'Failed to fetch appointment statistics'))
        })
      )
    })
  )