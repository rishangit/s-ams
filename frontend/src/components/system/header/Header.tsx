import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { setSettingsOpen } from '../../../store/reducers/uiSlice'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface HeaderProps {
  title: string
  drawerWidth: number
  onDrawerToggle: () => void
}

const Header: React.FC<HeaderProps> = ({
  title,
  drawerWidth: _drawerWidth,
  onDrawerToggle
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { settingsOpen } = useSelector((state: RootState) => state.ui)

  const handleSettingsToggle = () => {
    dispatch(setSettingsOpen(!settingsOpen))
  }

    return (
    <AppBar
      position="static"
      className="z-20"
      style={{
        backgroundColor: uiTheme.surface,
        borderBottom: `1px solid ${uiTheme.border}`,
        width: '100%'
      }}
      elevation={0}
    >
      <Toolbar className="flex justify-between">
        <Box className="flex items-center space-x-3">
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              className="mr-2"
              style={{ 
                color: uiTheme.text,
                backgroundColor: 'transparent'
              }}
              sx={{
                '&:focus': {
                  outline: 'none',
                  backgroundColor: 'transparent !important',
                  boxShadow: 'none !important'
                },
                '&:focus-visible': {
                  outline: 'none',
                  backgroundColor: 'transparent !important',
                  boxShadow: 'none !important'
                }
              }}
            >
              <MenuIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
          )}
          {!isMobile && (
            <Typography
              variant="h6"
              className="font-semibold"
              style={{ color: uiTheme.text }}
            >
              {title}
            </Typography>
          )}
        </Box>

        <Box className="flex items-center space-x-3">
          {!isMobile && (
            <Typography
              variant="body2"
              style={{ color: uiTheme.textSecondary }}
            >
              Welcome, {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
          )}
          
          {/* Settings Icon */}
          <IconButton
            onClick={handleSettingsToggle}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ 
              color: uiTheme.text,
              backgroundColor: 'transparent'
            }}
          >
            <SettingsIcon style={{ fontSize: '1.25rem' }} />
          </IconButton>
          
          {/* User Profile Image */}
                          <Avatar
                  className="w-12 h-12 bg-blue-500 border-2 border-white shadow-sm"
                  style={{ backgroundColor: '#3b82f6' }}
                                     src={getProfileImageUrl(user?.profileImage)}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    console.error('Header Avatar image failed to load:', target.src)
                  }}
                  
                >
            {user ? (
              <span className="text-white font-semibold text-sm">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            ) : (
              <PersonIcon style={{ color: '#ffffff' }} />
            )}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
