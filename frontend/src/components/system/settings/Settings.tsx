import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { setSettingsOpen, toggleTheme } from '../../../store/reducers/uiSlice'

interface SettingsProps {
  // Add any props if needed in the future
}

const Settings: React.FC<SettingsProps> = () => {
  const dispatch = useDispatch()
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { settingsOpen } = useSelector((state: RootState) => state.ui)

  const handleSettingsClose = () => {
    dispatch(setSettingsOpen(false))
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

    return (
    <Drawer
      anchor="right"
      open={settingsOpen}
      onClose={handleSettingsClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100vh',
          width: 300,
          boxSizing: 'border-box',
          zIndex: 50,
          backgroundColor: uiTheme.surface,
          borderLeft: `1px solid ${uiTheme.border}`
        },
        '& .MuiBackdrop-root': {
          zIndex: 45
        }
      }}
    >
      <Box className="h-full flex flex-col">
        {/* Settings Header */}
        <Box className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Typography
            variant="h6"
            className="font-semibold"
            style={{ color: uiTheme.text }}
          >
            Settings
          </Typography>
          <IconButton
            onClick={handleSettingsClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ 
              color: uiTheme.text,
              backgroundColor: 'transparent'
            }}
          >
            <CloseIcon style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>

                 {/* Settings Content */}
         <Box className="flex-1 p-4">
           <Typography
             variant="h6"
             style={{ color: uiTheme.text }}
             className="mb-4 font-semibold"
           >
             Settings
           </Typography>
           
           {/* Settings Items */}
           <Box className="space-y-4">
             {/* Theme Settings */}
             <Box className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
               <Typography
                 variant="subtitle1"
                 style={{ color: uiTheme.text }}
                 className="mb-3 font-medium"
               >
                 Theme Settings
               </Typography>
               <Typography
                 variant="body2"
                 style={{ color: uiTheme.textSecondary }}
                 className="mb-3"
               >
                 Customize your application theme
               </Typography>
               
               <FormControlLabel
                 control={
                   <Switch
                     checked={uiTheme.mode === 'dark'}
                     onChange={handleThemeToggle}
                     className="text-blue-600"
                   />
                 }
                 label={
                   <Typography
                     variant="body2"
                     style={{ color: uiTheme.text }}
                   >
                     Dark Mode
                   </Typography>
                 }
               />
             </Box>
             
             {/* Notification Settings */}
             <Box className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
               <Typography
                 variant="subtitle1"
                 style={{ color: uiTheme.text }}
                 className="mb-3 font-medium"
               >
                 Notification Settings
               </Typography>
               <Typography
                 variant="body2"
                 style={{ color: uiTheme.textSecondary }}
                 className="mb-3"
               >
                 Manage your notification preferences
               </Typography>
               
               <FormControlLabel
                 control={
                   <Switch
                     checked={true}
                     onChange={() => {}}
                     className="text-green-600"
                   />
                 }
                 label={
                   <Typography
                     variant="body2"
                     style={{ color: uiTheme.text }}
                   >
                     Email Notifications
                   </Typography>
                 }
               />
             </Box>
             
             {/* Account Settings */}
             <Box className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
               <Typography
                 variant="subtitle1"
                 style={{ color: uiTheme.text }}
                 className="mb-3 font-medium"
               >
                 Account Settings
               </Typography>
               <Typography
                 variant="body2"
                 style={{ color: uiTheme.textSecondary }}
                 className="mb-3"
               >
                 Update your account information
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
                     style={{ color: uiTheme.textSecondary }}
                   >
                     Two-Factor Authentication
                   </Typography>
                 }
               />
             </Box>
           </Box>
         </Box>
      </Box>
    </Drawer>
  )
}

export default Settings
