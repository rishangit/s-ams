import { createAction } from '@reduxjs/toolkit'

// User Settings Types
export interface UserSettings {
  id: number
  user_id: number
  calendar_view: 'month' | 'week' | 'day'
  appointments_view: 'grid' | 'list' | 'card'
  services_view: 'grid' | 'list' | 'card'
  staff_view: 'grid' | 'list' | 'card'
  products_view: 'grid' | 'list' | 'card'
  users_view: 'grid' | 'list' | 'card'
  companies_view: 'grid' | 'list' | 'card'
  theme_mode: 'light' | 'dark'
  theme_primary_color: string
  compact_mode: boolean
  created_at: string
  updated_at: string
}

export interface UpdateUserSettingsPayload {
  calendar_view?: 'month' | 'week' | 'day'
  appointments_view?: 'grid' | 'list' | 'card'
  services_view?: 'grid' | 'list' | 'card'
  staff_view?: 'grid' | 'list' | 'card'
  products_view?: 'grid' | 'list' | 'card'
  users_view?: 'grid' | 'list' | 'card'
  companies_view?: 'grid' | 'list' | 'card'
  theme_mode?: 'light' | 'dark'
  theme_primary_color?: string
  compact_mode?: boolean
}

// Get User Settings Actions
export const getUserSettingsRequest = createAction('userSettings/getUserSettingsRequest')
export const getUserSettingsSuccess = createAction<UserSettings>('userSettings/getUserSettingsSuccess')
export const getUserSettingsFailure = createAction<string>('userSettings/getUserSettingsFailure')

// Update User Settings Actions
export const updateUserSettingsRequest = createAction<UpdateUserSettingsPayload>('userSettings/updateUserSettingsRequest')
export const updateUserSettingsSuccess = createAction<UserSettings>('userSettings/updateUserSettingsSuccess')
export const updateUserSettingsFailure = createAction<string>('userSettings/updateUserSettingsFailure')

// Reset User Settings Actions
export const resetUserSettingsRequest = createAction('userSettings/resetUserSettingsRequest')
export const resetUserSettingsSuccess = createAction<UserSettings>('userSettings/resetUserSettingsSuccess')
export const resetUserSettingsFailure = createAction<string>('userSettings/resetUserSettingsFailure')

// Local Settings Actions (for immediate UI updates)
export const setCalendarView = createAction<'month' | 'week' | 'day'>('userSettings/setCalendarView')
export const setAppointmentsView = createAction<'grid' | 'list' | 'card'>('userSettings/setAppointmentsView')
export const setServicesView = createAction<'grid' | 'list' | 'card'>('userSettings/setServicesView')
export const setStaffView = createAction<'grid' | 'list' | 'card'>('userSettings/setStaffView')
export const setProductsView = createAction<'grid' | 'list' | 'card'>('userSettings/setProductsView')
export const setUsersView = createAction<'grid' | 'list' | 'card'>('userSettings/setUsersView')
export const setCompaniesView = createAction<'grid' | 'list' | 'card'>('userSettings/setCompaniesView')
export const setThemeMode = createAction<'light' | 'dark'>('userSettings/setThemeMode')
export const setThemePrimaryColor = createAction<string>('userSettings/setThemePrimaryColor')
export const setCompactMode = createAction<boolean>('userSettings/setCompactMode')

// Clear User Settings (on logout)
export const clearUserSettings = createAction('userSettings/clearUserSettings')


