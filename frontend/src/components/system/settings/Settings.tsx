import React, { useState } from 'react'
import {
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Palette as ThemeIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  SettingsApplications as GeneralIcon,
  Tune as UIIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { toggleTheme } from '../../../store/reducers/uiSlice'

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
  const [tabValue, setTabValue] = useState(0)

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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
        {/* UI Settings */}
        <Grid container spacing={2}>
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
                  className="mb-3 text-gray-600 dark:text-gray-400 text-sm"
                >
                  Customize your application theme and appearance
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={uiTheme.mode === 'dark'}
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
              </CardContent>
            </Card>
          </Grid>

          {/* UI Preferences */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <UIIcon className="text-xl" style={{ color: uiTheme.primary }} />
                  <Typography
                    variant="subtitle1"
                    className="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    UI Preferences
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  className="mb-3 text-gray-600 dark:text-gray-400 text-sm"
                >
                  Customize your user interface preferences
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
                      Compact Mode
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  )
}

export default Settings
