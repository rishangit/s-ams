import { combineReducers } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import authReducer from './authSlice'
import usersReducer from './usersSlice'
import companyReducer from './companySlice'
import servicesReducer from './servicesSlice'
import appointmentsReducer from './appointmentsSlice'
import staffReducer from './staffSlice'
import productsReducer from './productsSlice'
import userHistoryReducer from './userHistorySlice'
import userSettingsReducer from './userSettingsSlice'

export const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  users: usersReducer,
  company: companyReducer,
  services: servicesReducer,
  appointments: appointmentsReducer,
  staff: staffReducer,
  products: productsReducer,
  userHistory: userHistoryReducer,
  userSettings: userSettingsReducer
})
