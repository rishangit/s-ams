import { combineReducers } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import authReducer from './authSlice'
import usersReducer from './usersSlice'

export const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  users: usersReducer,
})
