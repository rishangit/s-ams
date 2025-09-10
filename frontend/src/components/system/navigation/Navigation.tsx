import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Build as ServicesIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../../store'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { logoutAndClearData } from '../../../store/actions/logoutActions'
import { setSidebarOpen } from '../../../store/reducers/uiSlice'
import { isAdminOnlyRole, getRoleDisplayName } from '../../../constants/roles'

interface NavigationProps {
  drawerWidth: number
  mobileOpen: boolean
  onDrawerToggle: () => void
}

const Navigation: React.FC<NavigationProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)



  const handleLogout = () => {
    dispatch(logoutAndClearData())
    navigate('/system/login')
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      dispatch(setSidebarOpen(false))
    }
  }

  const drawerContent = (
    <Box
      className="h-full flex flex-col"
      style={{ backgroundColor: uiTheme.surface }}
    >
      {/* Logo/Brand Section - aligned with header */}
      <Box
        className="p-4"
        style={{
          borderBottom: `1px solid ${uiTheme.border}`,
          backgroundColor: uiTheme.surface
        }}
      >
        <Typography
          variant="h6"
          className="font-bold text-center"
          style={{ color: uiTheme.text }}
        >
          S-AMS
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List className="flex-1 py-2">
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/system/dashboard')}
            style={{
              backgroundColor: location.pathname === '/system/dashboard'
                ? uiTheme.primary
                : 'transparent',
              color: location.pathname === '/system/dashboard'
                ? '#ffffff'
                : uiTheme.text,
              borderRight: location.pathname === '/system/dashboard'
                ? `2px solid ${uiTheme.primary}`
                : 'none',
              margin: '0 8px',
              borderRadius: '8px'
            }}
            className="hover:opacity-80 transition-all duration-200"
          >
            <ListItemIcon>
              <DashboardIcon
                style={{
                  color: location.pathname === '/system/dashboard'
                    ? '#ffffff'
                    : uiTheme.textSecondary
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              style={{
                color: location.pathname === '/system/dashboard'
                  ? '#ffffff'
                  : uiTheme.text
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Users Management - Admin Only (excludes owners) */}
        {user && isAdminOnlyRole(user.role as any) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/users')}
              style={{
                backgroundColor: location.pathname === '/system/users'
                  ? uiTheme.primary
                  : 'transparent',
                color: location.pathname === '/system/users'
                  ? '#ffffff'
                  : uiTheme.text,
                borderRight: location.pathname === '/system/users'
                  ? `2px solid ${uiTheme.primary}`
                  : 'none',
                margin: '0 8px',
                borderRadius: '8px'
              }}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <PeopleIcon
                  style={{
                    color: location.pathname === '/system/users'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                style={{
                  color: location.pathname === '/system/users'
                    ? '#ffffff'
                    : uiTheme.text
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Companies Management - Admin Only (excludes owners) */}
        {user && isAdminOnlyRole(user.role as any) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/companies')}
              style={{
                backgroundColor: location.pathname === '/system/companies'
                  ? uiTheme.primary
                  : 'transparent',
                color: location.pathname === '/system/companies'
                  ? '#ffffff'
                  : uiTheme.text,
                borderRight: location.pathname === '/system/companies'
                  ? `2px solid ${uiTheme.primary}`
                  : 'none',
                margin: '0 8px',
                borderRadius: '8px'
              }}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <BusinessIcon
                  style={{
                    color: location.pathname === '/system/companies'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Companies"
                style={{
                  color: location.pathname === '/system/companies'
                    ? '#ffffff'
                    : uiTheme.text
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Services Management - Owner Only (role 1) */}
        {user && parseInt(user.role) === 1 && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/services')}
              style={{
                backgroundColor: location.pathname === '/system/services'
                  ? uiTheme.primary
                  : 'transparent',
                color: location.pathname === '/system/services'
                  ? '#ffffff'
                  : uiTheme.text,
                borderRight: location.pathname === '/system/services'
                  ? `2px solid ${uiTheme.primary}`
                  : 'none',
                margin: '0 8px',
                borderRadius: '8px'
              }}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <ServicesIcon
                  style={{
                    color: location.pathname === '/system/services'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Services"
                style={{
                  color: location.pathname === '/system/services'
                    ? '#ffffff'
                    : uiTheme.text
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Appointments - Owner (role 1) and User (role 3) */}
        {user && [1, 3].includes(parseInt(user.role)) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/appointments')}
              style={{
                backgroundColor: location.pathname === '/system/appointments'
                  ? uiTheme.primary
                  : 'transparent',
                color: location.pathname === '/system/appointments'
                  ? '#ffffff'
                  : uiTheme.text,
                borderRight: location.pathname === '/system/appointments'
                  ? `2px solid ${uiTheme.primary}`
                  : 'none',
                margin: '0 8px',
                borderRadius: '8px'
              }}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <EventIcon
                  style={{
                    color: location.pathname === '/system/appointments'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Appointments"
                style={{
                  color: location.pathname === '/system/appointments'
                    ? '#ffffff'
                    : uiTheme.text
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Calendar - Owner (role 1) and User (role 3) */}
        {user && [1, 3].includes(parseInt(user.role)) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/calendar')}
              style={{
                backgroundColor: location.pathname === '/system/calendar'
                  ? uiTheme.primary
                  : 'transparent',
                color: location.pathname === '/system/calendar'
                  ? '#ffffff'
                  : uiTheme.text,
                borderRight: location.pathname === '/system/calendar'
                  ? `2px solid ${uiTheme.primary}`
                  : 'none',
                margin: '0 8px',
                borderRadius: '8px'
              }}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <CalendarIcon
                  style={{
                    color: location.pathname === '/system/calendar'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Calendar"
                style={{
                  color: location.pathname === '/system/calendar'
                    ? '#ffffff'
                    : uiTheme.text
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Add more navigation items here as needed */}
        {/* Example:
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/system/attendance')}>
            <ListItemIcon>
              <AttendanceIcon />
            </ListItemIcon>
            <ListItemText primary="Attendance" />
          </ListItemButton>
        </ListItem>
        */}
      </List>

      {/* User Section at Bottom */}
      <Box
        style={{
          borderTop: `1px solid ${uiTheme.border}`,
          backgroundColor: uiTheme.surface
        }}
      >
        <Box className="p-3">
          <ListItemButton
            onClick={() => handleNavigation('/system/profile')}
            style={{
              backgroundColor: location.pathname === '/system/profile'
                ? uiTheme.primary
                : 'transparent',
              color: location.pathname === '/system/profile'
                ? '#ffffff'
                : uiTheme.text,
              borderRadius: '8px',
              marginBottom: '8px',
              padding: '8px',
              border: location.pathname === '/system/profile'
                ? `2px solid ${uiTheme.primary}`
                : 'none'
            }}
            className="hover:opacity-80 transition-all duration-200"
          >
            <Box className="flex items-center space-x-2 w-full">
              <Avatar
                className="w-8 h-8 border shadow-sm"
                style={{
                  backgroundColor: location.pathname === '/system/profile'
                    ? '#ffffff'
                    : uiTheme.primary,
                  borderColor: location.pathname === '/system/profile'
                    ? uiTheme.primary
                    : uiTheme.border
                }}
                src={getProfileImageUrl(user?.profileImage)}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  console.error('Navigation Avatar image failed to load:', target.src)
                }}

              >
                {user ? (
                  <span
                    className="font-semibold text-xs"
                    style={{
                      color: location.pathname === '/system/profile'
                        ? uiTheme.primary
                        : '#ffffff'
                    }}
                  >
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                ) : (
                  <PersonIcon
                    style={{
                      color: location.pathname === '/system/profile'
                        ? uiTheme.primary
                        : '#ffffff',
                      fontSize: '1rem'
                    }}
                  />
                )}
              </Avatar>
              <Box className="flex-1 min-w-0">
                <Typography
                  variant="subtitle2"
                  className="font-medium truncate text-sm"
                  style={{
                    color: location.pathname === '/system/profile'
                      ? '#ffffff'
                      : uiTheme.text
                  }}
                >
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </Typography>
                <Typography
                  variant="caption"
                  className="block truncate text-xs"
                  style={{
                    color: location.pathname === '/system/profile'
                      ? '#ffffff'
                      : uiTheme.textSecondary
                  }}
                >
                  {user?.role !== undefined ? getRoleDisplayName(user.role as any) : 'User'}
                </Typography>
              </Box>
            </Box>
          </ListItemButton>

          <ListItemButton
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              borderRadius: '8px',
              marginTop: '8px'
            }}
            className="hover:opacity-80 transition-all duration-200"
          >
            <ListItemIcon>
              <LogoutIcon style={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              style={{ color: '#ffffff' }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      className="flex-shrink-0"
      style={{
        width: isMobile ? 0 : drawerWidth,
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 70,
        minWidth: 0
      }}
    >
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          className="block"
          style={{
            width: drawerWidth,
            backgroundColor: uiTheme.surface
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              zIndex: 70,
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100vh',
              minWidth: 0,
              backgroundColor: uiTheme.surface,
              borderRight: `1px solid ${uiTheme.border}`
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          style={{
            width: drawerWidth,
            backgroundColor: uiTheme.surface
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              zIndex: 75,
              backgroundColor: uiTheme.surface,
              borderRight: `1px solid ${uiTheme.border}`
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  )
}

export default Navigation
