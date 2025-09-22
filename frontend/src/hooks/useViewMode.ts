import { useSelector } from 'react-redux'
import { RootState } from '../store'

export type ViewMode = 'grid' | 'list' | 'card'
export type CalendarViewMode = 'month' | 'week' | 'day'

export const useViewMode = () => {
  const { settings } = useSelector((state: RootState) => state.userSettings)

  return {
    // Calendar view mode
    calendarView: settings?.calendar_view || 'month',
    
    // Data view modes
    appointmentsView: settings?.appointments_view || 'grid',
    servicesView: settings?.services_view || 'grid',
    staffView: settings?.staff_view || 'grid',
    productsView: settings?.products_view || 'grid',
    usersView: settings?.users_view || 'grid',
    companiesView: settings?.companies_view || 'grid',
    
    // Theme settings
    themeMode: settings?.theme_mode || 'light',
    compactMode: settings?.compact_mode || false,
    
    // Helper function to get view mode for a specific section
    getViewMode: (section: 'appointments' | 'services' | 'staff' | 'products' | 'users' | 'companies'): ViewMode => {
      switch (section) {
        case 'appointments':
          return settings?.appointments_view || 'grid'
        case 'services':
          return settings?.services_view || 'grid'
        case 'staff':
          return settings?.staff_view || 'grid'
        case 'products':
          return settings?.products_view || 'grid'
        case 'users':
          return settings?.users_view || 'grid'
        case 'companies':
          return settings?.companies_view || 'grid'
        default:
          return 'grid'
      }
    },
    
    // Helper function to get calendar view mode
    getCalendarViewMode: (): CalendarViewMode => {
      return settings?.calendar_view || 'month'
    }
  }
}


