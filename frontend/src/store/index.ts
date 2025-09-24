import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { rootReducer } from './reducers'
import { authEpics } from './epics'
import { getAllUsersEpic, updateUserRoleEpic, getUsersByRoleEpic } from './epics/usersEpics'
import { 
  createCompanyEpic, 
  updateCompanyEpic, 
  getCompanyByUserEpic,
  getCompanyByIdEpic,
  getCompaniesForBookingEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic,
  getCompaniesByUserAppointmentsEpic
} from './epics/companyEpics'
import {
  createServiceEpic,
  getServicesEpic,
  getServicesByCompanyIdEpic,
  getServiceByIdEpic,
  updateServiceEpic,
  updateServiceStatusEpic,
  deleteServiceEpic
} from './epics/servicesEpics'
import {
  createAppointmentEpic,
  getAppointmentsEpic,
  getAllAppointmentsEpic,
  getAppointmentByIdEpic,
  updateAppointmentEpic,
  updateAppointmentStatusEpic,
  deleteAppointmentEpic,
  getAppointmentStatsEpic
} from './epics/appointmentsEpics'
import {
  getStaffEpic,
  getStaffByCompanyIdEpic,
  getStaffByIdEpic,
  createStaffEpic,
  updateStaffEpic,
  deleteStaffEpic,
  getAvailableUsersEpic
} from './epics/staffEpics'
import {
  createProductEpic,
  getProductsEpic,
  getProductByIdEpic,
  updateProductEpic,
  updateProductQuantityEpic,
  updateProductStatusEpic,
  deleteProductEpic,
  getLowStockProductsEpic,
  getProductCategoriesEpic
} from './epics/productsEpics'
import {
  createUserHistoryEpic,
  getUserHistoryEpic,
  getUserHistoryByAppointmentIdEpic,
  getCompanyUserHistoryEpic,
  getUserHistoryByUserIdEpic,
  updateUserHistoryEpic,
  deleteUserHistoryEpic,
  getCompanyStatsEpic
} from './epics/userHistoryEpics'
import {
  getUserSettingsEpic,
  updateUserSettingsEpic,
  resetUserSettingsEpic
} from './epics/userSettingsEpics'
import { categoryEpics } from './epics/categoryEpics'

const epicMiddleware = createEpicMiddleware()

// Combine all epics into a root epic
const rootEpic = combineEpics(
  ...authEpics,
  getAllUsersEpic,
  updateUserRoleEpic,
  getUsersByRoleEpic,
  createCompanyEpic,
  updateCompanyEpic,
  getCompanyByUserEpic,
  getCompanyByIdEpic,
  getCompaniesForBookingEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic,
  getCompaniesByUserAppointmentsEpic,
  createServiceEpic,
  getServicesEpic,
  getServicesByCompanyIdEpic,
  getServiceByIdEpic,
  updateServiceEpic,
  updateServiceStatusEpic,
  deleteServiceEpic,
  getStaffEpic,
  getStaffByCompanyIdEpic,
  getStaffByIdEpic,
  createStaffEpic,
  updateStaffEpic,
  deleteStaffEpic,
  getAvailableUsersEpic,
  createAppointmentEpic,
  getAppointmentsEpic,
  getAllAppointmentsEpic,
  getAppointmentByIdEpic,
  updateAppointmentEpic,
  updateAppointmentStatusEpic,
  deleteAppointmentEpic,
  getAppointmentStatsEpic,
  createProductEpic,
  getProductsEpic,
  getProductByIdEpic,
  updateProductEpic,
  updateProductQuantityEpic,
  updateProductStatusEpic,
  deleteProductEpic,
  getLowStockProductsEpic,
  getProductCategoriesEpic,
  createUserHistoryEpic,
  getUserHistoryEpic,
  getUserHistoryByAppointmentIdEpic,
  getCompanyUserHistoryEpic,
  getUserHistoryByUserIdEpic,
  updateUserHistoryEpic,
  deleteUserHistoryEpic,
  getCompanyStatsEpic,
  getUserSettingsEpic,
  updateUserSettingsEpic,
  resetUserSettingsEpic,
  categoryEpics
)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(epicMiddleware),
  devTools: true,
})



// Run the root epic
epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
