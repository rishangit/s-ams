// Calendar View Types
export enum CalendarView {
  MONTH = 0,
  WEEK = 1,
  DAY = 2
}

// Data View Types (for Appointments, Services, Staff, Products, Users)
export enum DataView {
  GRID = 0,
  LIST = 1,
  CARD = 2
}

// Theme Mode Types
export enum ThemeMode {
  LIGHT = 0,
  DARK = 1
}

// Helper functions to convert between enum and string values
export const calendarViewToString = (view: CalendarView): string => {
  switch (view) {
    case CalendarView.MONTH: return 'month'
    case CalendarView.WEEK: return 'week'
    case CalendarView.DAY: return 'day'
    default: return 'month'
  }
}

export const stringToCalendarView = (view: string): CalendarView => {
  switch (view) {
    case 'month': return CalendarView.MONTH
    case 'week': return CalendarView.WEEK
    case 'day': return CalendarView.DAY
    default: return CalendarView.MONTH
  }
}

export const dataViewToString = (view: DataView): string => {
  switch (view) {
    case DataView.GRID: return 'grid'
    case DataView.LIST: return 'list'
    case DataView.CARD: return 'card'
    default: return 'grid'
  }
}

export const stringToDataView = (view: string): DataView => {
  switch (view) {
    case 'grid': return DataView.GRID
    case 'list': return DataView.LIST
    case 'card': return DataView.CARD
    default: return DataView.GRID
  }
}

export const themeModeToString = (mode: ThemeMode): string => {
  switch (mode) {
    case ThemeMode.LIGHT: return 'light'
    case ThemeMode.DARK: return 'dark'
    default: return 'light'
  }
}

export const stringToThemeMode = (mode: string): ThemeMode => {
  switch (mode) {
    case 'light': return ThemeMode.LIGHT
    case 'dark': return ThemeMode.DARK
    default: return ThemeMode.LIGHT
  }
}


