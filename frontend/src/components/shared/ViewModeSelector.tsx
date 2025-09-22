import React from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import {
  GridView as GridIcon,
  List as ListIcon,
  ViewModule as CardIcon,
  CalendarMonth,
  CalendarViewWeek,
  CalendarToday
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  setCalendarView,
  setAppointmentsView,
  setServicesView,
  setStaffView,
  setProductsView,
  setUsersView,
  setCompaniesView
} from '../../store/actions/userSettingsActions'
import { updateUserSettingsRequest } from '../../store/actions/userSettingsActions'

interface ViewModeSelectorProps {
  section: 'calendar' | 'appointments' | 'services' | 'staff' | 'products' | 'users' | 'companies'
  currentView: 'month' | 'week' | 'day' | 'grid' | 'list' | 'card'
  onViewChange?: (view: string) => void
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  section,
  currentView,
  onViewChange
}) => {
  const dispatch = useDispatch()
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  const handleViewChange = (view: string) => {
    const settingsUpdate: any = {}
    
    // Dispatch the appropriate action based on section
    switch (section) {
      case 'calendar':
        dispatch(setCalendarView(view))
        settingsUpdate.calendar_view = view
        break
      case 'appointments':
        dispatch(setAppointmentsView(view))
        settingsUpdate.appointments_view = view
        break
      case 'services':
        dispatch(setServicesView(view))
        settingsUpdate.services_view = view
        break
      case 'staff':
        dispatch(setStaffView(view))
        settingsUpdate.staff_view = view
        break
      case 'products':
        dispatch(setProductsView(view))
        settingsUpdate.products_view = view
        break
      case 'users':
        dispatch(setUsersView(view))
        settingsUpdate.users_view = view
        break
      case 'companies':
        dispatch(setCompaniesView(view))
        settingsUpdate.companies_view = view
        break
    }
    
    // Save to backend
    dispatch(updateUserSettingsRequest(settingsUpdate))
    
    // Call the optional callback
    if (onViewChange) {
      onViewChange(view)
    }
  }

  const dataViewModes = [
    { key: 'grid', icon: GridIcon, label: 'Grid View' },
    { key: 'list', icon: ListIcon, label: 'List View' },
    { key: 'card', icon: CardIcon, label: 'Card View' }
  ] as const

  const calendarViewModes = [
    { key: 'month', icon: CalendarMonth, label: 'Month View' },
    { key: 'week', icon: CalendarViewWeek, label: 'Week View' },
    { key: 'day', icon: CalendarToday, label: 'Day View' }
  ] as const

  const viewModes = section === 'calendar' ? calendarViewModes : dataViewModes

  return (
    <Box className="flex items-center gap-1">
      {viewModes.map(({ key, icon: Icon, label }) => (
        <Tooltip key={key} title={label}>
          <IconButton
            size="small"
            onClick={() => handleViewChange(key)}
            style={{
              color: currentView === key ? uiTheme.primary : uiTheme.textSecondary,
              backgroundColor: currentView === key ? `${uiTheme.primary}20` : 'transparent'
            }}
            className="hover:opacity-80 transition-all duration-200"
          >
            <Icon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  )
}

export default ViewModeSelector

