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
  drawerWidth: number
  onDrawerToggle: () => void
}

const Header: React.FC<HeaderProps> = ({
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
      className="z-20 w-full shadow-none"
      style={{
        backgroundColor: `${uiTheme.background}80`,
        borderBottom: 'none'
      }}
      elevation={0}
    >
      <Toolbar 
        className="flex justify-between items-center px-4"
        style={{ minHeight: '64px', height: '64px' }}
      >
        <Box className="flex items-center space-x-3">
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              className="mr-2 transition-colors duration-200 hover:scale-105"
              style={{
                color: uiTheme.text,
                backgroundColor: 'transparent'
              }}
              sx={{
                '&:hover': {
                  backgroundColor: `${uiTheme.primary}10`
                },
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
              <MenuIcon className="text-2xl" />
            </IconButton>
          )}
          <Typography
            variant="h6"
            className="font-bold text-lg md:text-xl"
            style={{ color: uiTheme.text }}
          >
            S-AMS
          </Typography>
        </Box>

        <Box className="flex items-center space-x-4">
          {!isMobile && (
            <Box className="flex items-center space-x-3">
              <Typography
                variant="body2"
                className="text-sm font-medium"
                style={{ color: uiTheme.textSecondary }}
              >
                Welcome, {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>
              {user && user.isRoleSwitched && (
                <Box
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  style={{
                    backgroundColor: `${uiTheme.primary}15`,
                    color: uiTheme.primary,
                    border: `1px solid ${uiTheme.primary}30`
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
            className="w-12 h-12 border-2 border-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: uiTheme.primary }}
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
              <PersonIcon className="text-white text-xl" />
            )}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
