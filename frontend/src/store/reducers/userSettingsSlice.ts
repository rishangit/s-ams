import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getUserSettingsRequest,
  getUserSettingsSuccess,
  getUserSettingsFailure,
  updateUserSettingsRequest,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  resetUserSettingsRequest,
  resetUserSettingsSuccess,
  resetUserSettingsFailure,
  setCalendarView,
  setAppointmentsView,
  setServicesView,
  setStaffView,
  setProductsView,
  setUsersView,
  setCompaniesView,
  setCategoriesView,
  setThemeMode,
  setThemePrimaryColor,
  setCompactMode,
  clearUserSettings,
  UserSettings
} from '../actions/userSettingsActions'
import { CalendarView, DataView, ThemeMode, stringToCalendarView, stringToDataView, stringToThemeMode } from '../../constants/viewTypes'

interface UserSettingsState {
  settings: UserSettings | null
  loading: boolean
  error: string | null
  updating: boolean
  lastUpdated: number | null
}

const initialState: UserSettingsState = {
  settings: null,
  loading: false,
  error: null,
  updating: false,
  lastUpdated: null
}

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Get User Settings
    builder
      .addCase(getUserSettingsRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserSettingsSuccess, (state, action: PayloadAction<UserSettings>) => {
        state.loading = false
        state.settings = action.payload
        state.error = null
        state.lastUpdated = Date.now()
      })
      .addCase(getUserSettingsFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Update User Settings
    builder
      .addCase(updateUserSettingsRequest, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateUserSettingsSuccess, (state, action: PayloadAction<UserSettings>) => {
        state.updating = false
        state.settings = action.payload
        state.error = null
        state.lastUpdated = Date.now()
      })
      .addCase(updateUserSettingsFailure, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.error = action.payload
      })

    // Reset User Settings
    builder
      .addCase(resetUserSettingsRequest, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(resetUserSettingsSuccess, (state, action: PayloadAction<UserSettings>) => {
        state.updating = false
        state.settings = action.payload
        state.error = null
        state.lastUpdated = Date.now()
      })
      .addCase(resetUserSettingsFailure, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.error = action.payload
      })

    // Local Settings Updates (immediate UI updates)
    builder
      .addCase(setCalendarView, (state, action) => {
        if (state.settings) {
          state.settings.calendar_view = action.payload
        }
      })
      .addCase(setAppointmentsView, (state, action) => {
        if (state.settings) {
          state.settings.appointments_view = action.payload
        }
      })
      .addCase(setServicesView, (state, action) => {
        if (state.settings) {
          state.settings.services_view = action.payload
        }
      })
      .addCase(setStaffView, (state, action) => {
        if (state.settings) {
          state.settings.staff_view = action.payload
        }
      })
      .addCase(setProductsView, (state, action) => {
        if (state.settings) {
          state.settings.products_view = action.payload
        }
      })
      .addCase(setUsersView, (state, action) => {
        if (state.settings) {
          state.settings.users_view = action.payload
        }
      })
      .addCase(setCompaniesView, (state, action) => {
        if (state.settings) {
          state.settings.companies_view = action.payload
        }
      })
      .addCase(setCategoriesView, (state, action) => {
        if (state.settings) {
          state.settings.categories_view = action.payload
        }
      })
      .addCase(setThemeMode, (state, action) => {
        if (state.settings) {
          state.settings.theme_mode = action.payload
        }
      })
      .addCase(setThemePrimaryColor, (state, action) => {
        if (state.settings) {
          state.settings.theme_primary_color = action.payload
        }
      })
      .addCase(setCompactMode, (state, action) => {
        if (state.settings) {
          state.settings.compact_mode = action.payload
        }
      })

    // Clear User Settings (on logout)
    builder.addCase(clearUserSettings, (state) => {
      state.settings = null
      state.loading = false
      state.error = null
      state.updating = false
      state.lastUpdated = null
    })
  }
})

export const { clearError } = userSettingsSlice.actions
export default userSettingsSlice.reducer

