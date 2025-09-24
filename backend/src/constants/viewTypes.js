// Calendar View Types
export const CalendarView = {
  MONTH: 0,
  WEEK: 1,
  DAY: 2
}

// Data View Types (for Appointments, Services, Staff, Products, Users)
export const DataView = {
  GRID: 0,
  LIST: 1,
  CARD: 2
}

// Theme Mode Types
export const ThemeMode = {
  LIGHT: 0,
  DARK: 1
}

// Helper functions to convert between enum and string values
export const calendarViewToString = (view) => {
  switch (view) {
    case CalendarView.MONTH: return 'month'
    case CalendarView.WEEK: return 'week'
    case CalendarView.DAY: return 'day'
    default: return 'month'
  }
}

export const stringToCalendarView = (view) => {
  switch (view) {
    case 'month': return CalendarView.MONTH
    case 'week': return CalendarView.WEEK
    case 'day': return CalendarView.DAY
    default: return CalendarView.MONTH
  }
}

export const dataViewToString = (view) => {
  switch (view) {
    case DataView.GRID: return 'grid'
    case DataView.LIST: return 'list'
    case DataView.CARD: return 'card'
    default: return 'grid'
  }
}

export const stringToDataView = (view) => {
  switch (view) {
    case 'grid': return DataView.GRID
    case 'list': return DataView.LIST
    case 'card': return DataView.CARD
    default: return DataView.GRID
  }
}

export const themeModeToString = (mode) => {
  switch (mode) {
    case ThemeMode.LIGHT: return 'light'
    case ThemeMode.DARK: return 'dark'
    default: return 'light'
  }
}

export const stringToThemeMode = (mode) => {
  switch (mode) {
    case 'light': return ThemeMode.LIGHT
    case 'dark': return ThemeMode.DARK
    default: return ThemeMode.LIGHT
  }
}


