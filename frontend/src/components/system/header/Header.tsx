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
  Person as PersonIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { getRoleDisplayName, RoleId } from '../../../constants/roles'
import { useAuth } from '../../../hooks/useAuth'
import { parseUserRole } from '../../../utils/roleUtils'

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
  const { user } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { switchBack } = useAuth()

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
            <Box className="flex items-center space-x-2">
              <Typography
                variant="body2"
                style={{ color: uiTheme.textSecondary }}
              >
                Welcome, {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>
              {user && user.isRoleSwitched && (
                <Box
                  className="px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-yellow-100"
                  style={{ 
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    border: '1px solid #ffc107'
                  }}
                  onClick={switchBack}
                  title={`Currently in ${getRoleDisplayName(parseUserRole(user.role))} role. Click to switch back to ${getRoleDisplayName((user.originalRole || 0) as RoleId)}`}
                >
                  {getRoleDisplayName(parseUserRole(user.role))} (Switch Back)
                </Box>
              )}
            </Box>
          )}
          
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
