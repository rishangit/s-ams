import React, { useState, useEffect } from 'react'
import {
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Palette as ThemeIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  SettingsApplications as GeneralIcon,
  Tune as UIIcon,
  ViewModule as ViewModuleIcon,
  CalendarMonth as CalendarIcon,
  GridView as GridIcon,
  List as ListIcon,
  ViewModule as CardIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { toggleTheme } from '../../../store/reducers/uiSlice'
import { ROLES } from '../../../constants/roles'
import {
  getUserSettingsRequest,
  updateUserSettingsRequest,
  resetUserSettingsRequest,
  setCalendarView,
  setAppointmentsView,
  setServicesView,
  setStaffView,
  setProductsView,
  setUsersView,
  setCompaniesView,
  setThemeMode,
  setCompactMode
} from '../../../store/actions/userSettingsActions'

interface SettingsProps {
  // Add any props if needed in the future
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}

const Settings: React.FC<SettingsProps> = () => {
  const dispatch = useDispatch()
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { user } = useSelector((state: RootState) => state.auth)
  const { settings, loading, error, updating } = useSelector((state: RootState) => state.userSettings)
  
  const [tabValue, setTabValue] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Helper function to get available view preferences based on user role
  const getAvailableViewPreferences = (userRole: number) => {
    switch (userRole) {
      case ROLES.USER: // Role 3: User
        return ['calendar', 'appointments', 'companies'] // My companies
      case ROLES.STAFF: // Role 2: Staff
        return ['calendar', 'appointments']
      case ROLES.OWNER: // Role 1: Owner
        return ['calendar', 'appointments', 'services', 'staff', 'products', 'users']
      case ROLES.ADMIN: // Role 0: Admin
        return ['users', 'companies']
      default:
        return ['calendar', 'appointments'] // Default fallback
    }
  }

  // Helper function to check if a view preference should be shown
  const shouldShowViewPreference = (viewType: string) => {
    if (!user) return false
    const userRole = parseInt(String(user.role))
    const availablePreferences = getAvailableViewPreferences(userRole)
    return availablePreferences.includes(viewType)
  }

  // Load user settings on component mount
  useEffect(() => {
    console.log('Settings useEffect triggered:', { user: !!user, settings: !!settings, loading })
    if (user && !settings && !loading) {
      console.log('Dispatching getUserSettingsRequest...', getUserSettingsRequest.type)
      dispatch(getUserSettingsRequest())
    }
  }, [user, settings, dispatch]) // Removed 'loading' from dependencies to prevent infinite loop

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
    if (settings) {
      const newThemeMode = uiTheme.mode === 'dark' ? 'light' : 'dark'
      dispatch(setThemeMode(newThemeMode))
      setHasUnsavedChanges(true)
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleViewChange = (viewType: string, value: string) => {
    switch (viewType) {
      case 'calendar':
        dispatch(setCalendarView(value as 'month' | 'week' | 'day'))
        break
      case 'appointments':
        dispatch(setAppointmentsView(value as 'grid' | 'list' | 'card'))
        break
      case 'services':
        dispatch(setServicesView(value as 'grid' | 'list' | 'card'))
        break
      case 'staff':
        dispatch(setStaffView(value as 'grid' | 'list' | 'card'))
        break
      case 'products':
        dispatch(setProductsView(value as 'grid' | 'list' | 'card'))
        break
      case 'users':
        dispatch(setUsersView(value as 'grid' | 'list' | 'card'))
        break
      case 'companies':
        dispatch(setCompaniesView(value as 'grid' | 'list' | 'card'))
        break
    }
    setHasUnsavedChanges(true)
  }

  const handleCompactModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCompactMode(event.target.checked))
    setHasUnsavedChanges(true)
  }

  const handleSaveSettings = () => {
    if (settings) {
      dispatch(updateUserSettingsRequest({
        calendar_view: settings.calendar_view,
        appointments_view: settings.appointments_view,
        services_view: settings.services_view,
        staff_view: settings.staff_view,
        products_view: settings.products_view,
        users_view: settings.users_view,
        companies_view: settings.companies_view,
        theme_mode: settings.theme_mode,
        compact_mode: settings.compact_mode
      }))
      setHasUnsavedChanges(false)
    }
  }

  const handleResetSettings = () => {
    dispatch(resetUserSettingsRequest())
    setHasUnsavedChanges(false)
  }

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'grid':
        return <GridIcon className="w-4 h-4" />
      case 'list':
        return <ListIcon className="w-4 h-4" />
      case 'card':
        return <CardIcon className="w-4 h-4" />
      default:
        return <GridIcon className="w-4 h-4" />
    }
  }

  const getCalendarIcon = () => {
    return <CalendarIcon className="w-4 h-4" />
  }

  return (
    <div className="h-full md:p-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-3xl" style={{ color: uiTheme.primary }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white"
        >
          Settings
        </Typography>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          variant="standard"
          className="[&_.MuiTabs-indicator]:h-0.5 [&_.MuiTabs-indicator]:rounded-t-sm [&_.MuiTabs-flexContainer]:gap-0"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: uiTheme.primary
            }
          }}
        >
          <Tab 
            icon={<GeneralIcon className="text-lg mr-2" />} 
            label="General" 
            iconPosition="start"
            className="normal-case font-medium text-sm min-h-12 border-none hover:bg-transparent focus:outline-none focus:ring-0 focus:shadow-none"
            sx={{
              color: uiTheme.textSecondary,
              '&.Mui-selected': {
                color: uiTheme.primary,
                fontWeight: 600
              },
              '&:hover': {
                color: uiTheme.text
              }
            }}
          />
          <Tab 
            icon={<UIIcon className="text-lg mr-2" />} 
            label="UI" 
            iconPosition="start"
            className="normal-case font-medium text-sm min-h-12 border-none hover:bg-transparent focus:outline-none focus:ring-0 focus:shadow-none"
            sx={{
              color: uiTheme.textSecondary,
              '&.Mui-selected': {
                color: uiTheme.primary,
                fontWeight: 600
              },
              '&:hover': {
                color: uiTheme.text
              }
            }}
          />
        </Tabs>
      </div>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* General Settings */}
        <Grid container spacing={2}>
          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <NotificationIcon className="text-xl" style={{ color: uiTheme.primary }} />
                  <Typography
                    variant="subtitle1"
                    className="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    Notification Settings
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  className="mb-3 text-gray-600 dark:text-gray-400 text-sm"
                >
                  Manage your notification preferences
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={true}
                      onChange={() => {}}
                      className="text-green-500"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      className="text-gray-900 dark:text-white"
                    >
                      Email Notifications
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Account Settings */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <SecurityIcon className="text-xl" style={{ color: uiTheme.primary }} />
                  <Typography
                    variant="subtitle1"
                    className="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    Account Settings
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  className="mb-3 text-gray-600 dark:text-gray-400 text-sm"
                >
                  Update your account security and information
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={false}
                      onChange={() => {}}
                      className="text-gray-400"
                      disabled
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Two-Factor Authentication
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          {/* System Information */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <SettingsIcon className="text-xl" style={{ color: uiTheme.primary }} />
                  <Typography
                    variant="subtitle1"
                    className="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    System Information
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  className="mb-3 text-gray-600 dark:text-gray-400 text-sm"
                >
                  View system details and version information
                </Typography>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-sm">
                      Version
                    </Typography>
                    <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-sm">
                      1.0.0
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-sm">
                      Build
                    </Typography>
                    <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-sm">
                      2025.01
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-sm">
                      Environment
                    </Typography>
                    <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-sm">
                      Production
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Loading State */}
        {loading && (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress style={{ color: uiTheme.primary }} />
            <Typography variant="body2" className="ml-2" style={{ color: uiTheme.textSecondary }}>
              Loading settings...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* No User State */}
        {!user && !loading && (
          <Box className="flex justify-center items-center py-8">
            <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
              Please log in to access settings
            </Typography>
          </Box>
        )}

        {/* No Settings State */}
        {user && !settings && !loading && !error && (
          <Box className="flex justify-center items-center py-8">
            <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
              No settings found. Click the button below to create default settings.
            </Typography>
            <Button
              variant="contained"
              onClick={() => dispatch(getUserSettingsRequest())}
              style={{ marginLeft: '16px', backgroundColor: uiTheme.primary }}
            >
              Load Settings
            </Button>
          </Box>
        )}

        {/* UI Settings */}
        {settings && !loading && (
          <Grid container spacing={3}>
            {/* Theme Settings */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ThemeIcon className="text-xl" style={{ color: uiTheme.primary }} />
                    <Typography
                      variant="subtitle1"
                      className="font-semibold text-gray-900 dark:text-white text-sm"
                    >
                      Theme Settings
                    </Typography>
                  </div>
                  <Typography
                    variant="body2"
                    className="mb-4 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Customize your application theme and appearance
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.theme_mode === 'dark'}
                        onChange={handleThemeToggle}
                        style={{ color: uiTheme.primary }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        className="text-gray-900 dark:text-white"
                      >
                        Dark Mode
                      </Typography>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(settings.compact_mode)}
                        onChange={handleCompactModeChange}
                        style={{ color: uiTheme.primary }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        className="text-gray-900 dark:text-white"
                      >
                        Compact Mode
                      </Typography>
                    }
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* View Preferences */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ViewModuleIcon className="text-xl" style={{ color: uiTheme.primary }} />
                    <Typography
                      variant="subtitle1"
                      className="font-semibold text-gray-900 dark:text-white text-sm"
                    >
                      View Preferences
                    </Typography>
                  </div>
                  <Typography
                    variant="body2"
                    className="mb-4 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Set your preferred view modes for different sections
                  </Typography>
                  
                  <div className="space-y-4">
                    {/* Calendar View */}
                    {shouldShowViewPreference('calendar') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Calendar View</InputLabel>
                      <Select
                        value={settings.calendar_view}
                        onChange={(e) => handleViewChange('calendar', e.target.value)}
                        label="Calendar View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="month">
                          <Box className="flex items-center gap-2">
                            {getCalendarIcon()}
                            <span>Month</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="week">
                          <Box className="flex items-center gap-2">
                            {getCalendarIcon()}
                            <span>Week</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="day">
                          <Box className="flex items-center gap-2">
                            {getCalendarIcon()}
                            <span>Day</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Appointments View */}
                    {shouldShowViewPreference('appointments') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Appointments View</InputLabel>
                      <Select
                        value={settings.appointments_view}
                        onChange={(e) => handleViewChange('appointments', e.target.value)}
                        label="Appointments View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Services View */}
                    {shouldShowViewPreference('services') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Services View</InputLabel>
                      <Select
                        value={settings.services_view}
                        onChange={(e) => handleViewChange('services', e.target.value)}
                        label="Services View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Staff View */}
                    {shouldShowViewPreference('staff') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Staff View</InputLabel>
                      <Select
                        value={settings.staff_view}
                        onChange={(e) => handleViewChange('staff', e.target.value)}
                        label="Staff View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Products View */}
                    {shouldShowViewPreference('products') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Products View</InputLabel>
                      <Select
                        value={settings.products_view}
                        onChange={(e) => handleViewChange('products', e.target.value)}
                        label="Products View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Users View */}
                    {shouldShowViewPreference('users') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Users View</InputLabel>
                      <Select
                        value={settings.users_view}
                        onChange={(e) => handleViewChange('users', e.target.value)}
                        label="Users View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}

                    {/* Companies View */}
                    {shouldShowViewPreference('companies') && (
                      <FormControl fullWidth size="small">
                      <InputLabel style={{ color: uiTheme.textSecondary }}>Companies View</InputLabel>
                      <Select
                        value={settings.companies_view}
                        onChange={(e) => handleViewChange('companies', e.target.value)}
                        label="Companies View"
                        style={{ color: uiTheme.text }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: uiTheme.primary
                          }
                        }}
                      >
                        <MenuItem value="grid">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('grid')}
                            <span>Grid</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="list">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('list')}
                            <span>List</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="card">
                          <Box className="flex items-center gap-2">
                            {getViewIcon('card')}
                            <span>Card</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Card 
                elevation={0}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {hasUnsavedChanges && (
                        <Chip
                          label="Unsaved Changes"
                          color="warning"
                          size="small"
                          icon={<SaveIcon />}
                        />
                      )}
                      {updating && (
                        <Box className="flex items-center gap-2">
                          <CircularProgress size={16} style={{ color: uiTheme.primary }} />
                          <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
                            Saving...
                          </Typography>
                        </Box>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        onClick={handleResetSettings}
                        disabled={updating}
                        startIcon={<RefreshIcon />}
                        style={{
                          borderColor: uiTheme.border,
                          color: uiTheme.text
                        }}
                      >
                        Reset to Defaults
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        disabled={!hasUnsavedChanges || updating}
                        startIcon={<SaveIcon />}
                        style={{
                          backgroundColor: uiTheme.primary,
                          color: 'white'
                        }}
                      >
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>
    </div>
  )
}

export default Settings
