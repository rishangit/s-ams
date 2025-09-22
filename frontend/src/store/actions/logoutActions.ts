import { createAction } from '@reduxjs/toolkit'
import { clearUserSettings } from './userSettingsActions'

// Logout and clear all data action
export const logoutAndClearData = createAction('auth/logoutAndClearData')

// Enhanced logout action that clears all data including user settings
export const logoutAndClearAllData = () => (dispatch: any) => {
  dispatch(logoutAndClearData())
  dispatch(clearUserSettings())
}
