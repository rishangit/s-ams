import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ThemeConfig {
  mode: 'light' | 'dark'
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  divider: string
}

interface UiState {
  theme: ThemeConfig
  sidebarOpen: boolean
  settingsOpen: boolean
  loading: boolean
}

const lightTheme: ThemeConfig = {
  mode: 'light',
  primary: '#1976d2',
  secondary: '#dc004e',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  divider: '#f3f4f6'
}

const darkTheme: ThemeConfig = {
  mode: 'dark',
  primary: '#90caf9',
  secondary: '#f48fb1',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  border: '#334155',
  divider: '#1e293b'
}

const initialState: UiState = {
  theme: lightTheme,
  sidebarOpen: false,
  settingsOpen: false,
  loading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme.mode === 'light' ? darkTheme : lightTheme
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload === 'light' ? lightTheme : darkTheme
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { toggleTheme, setTheme, setSidebarOpen, setSettingsOpen, setLoading } = uiSlice.actions
export default uiSlice.reducer
