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
  CalendarToday as CalendarIcon,
  Group as StaffIcon,
  Inventory as ProductsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../../store'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { logoutAndClearData } from '../../../store/actions/logoutActions'
import { setSidebarOpen } from '../../../store/reducers/uiSlice'
import { isRoleInList, isOwner, isUser } from '../../../utils/roleHelpers'
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

  // Helper function to get navigation button styles
  const getNavButtonStyles = (path: string) => {
    const isActive = location.pathname === path
    return {
      backgroundColor: isActive ? uiTheme.primary : 'transparent',
      color: isActive ? '#ffffff' : uiTheme.text,
      borderRight: isActive ? `2px solid ${uiTheme.primary}` : 'none',
      margin: '0 8px',
      borderRadius: '8px'
    }
  }

  // Helper function to get icon styles
  const getIconStyles = (path: string) => {
    const isActive = location.pathname === path
    return {
      color: isActive ? '#ffffff' : uiTheme.textSecondary
    }
  }

  // Helper function to get text styles
  const getTextStyles = (path: string) => {
    const isActive = location.pathname === path
    return {
      color: isActive ? '#ffffff' : uiTheme.text
    }
  }

  const drawerContent = (
    <Box
      className="h-full flex flex-col"
      style={{ backgroundColor: uiTheme.background }}
    >
      {/* Logo/Brand Section - aligned with header */}
      <Box
        className="p-4 border-b"
        style={{
          borderBottomColor: uiTheme.border,
          backgroundColor: uiTheme.background
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
            style={getNavButtonStyles('/system/dashboard')}
            className="hover:opacity-80 transition-all duration-200"
          >
            <ListItemIcon>
              <DashboardIcon style={getIconStyles('/system/dashboard')} />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              style={getTextStyles('/system/dashboard')}
            />
          </ListItemButton>
        </ListItem>

        {/* Calendar - Owner (role 1), Staff (role 2), and User (role 3) */}
        {user && isRoleInList(user.role, [1, 2, 3]) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/calendar')}
              style={getNavButtonStyles('/system/calendar')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <CalendarIcon style={getIconStyles('/system/calendar')} />
              </ListItemIcon>
              <ListItemText
                primary="Calendar"
                style={getTextStyles('/system/calendar')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Appointments - Owner (role 1), Staff (role 2), and User (role 3) */}
        {user && isRoleInList(user.role, [1, 2, 3]) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/appointments')}
              style={getNavButtonStyles('/system/appointments')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <EventIcon style={getIconStyles('/system/appointments')} />
              </ListItemIcon>
              <ListItemText
                primary="Appointments"
                style={getTextStyles('/system/appointments')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Users Management - Admin Only (excludes owners) */}
        {user && isAdminOnlyRole(user.role as any) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/users')}
              style={getNavButtonStyles('/system/users')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <PeopleIcon style={getIconStyles('/system/users')} />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                style={getTextStyles('/system/users')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Companies Management - Admin Only (excludes owners) */}
        {user && isAdminOnlyRole(user.role as any) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/companies')}
              style={getNavButtonStyles('/system/companies')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <BusinessIcon style={getIconStyles('/system/companies')} />
              </ListItemIcon>
              <ListItemText
                primary="Companies"
                style={getTextStyles('/system/companies')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Services Management - Owner Only (role 1) */}
        {user && isOwner(user.role) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/services')}
              style={getNavButtonStyles('/system/services')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <ServicesIcon style={getIconStyles('/system/services')} />
              </ListItemIcon>
              <ListItemText
                primary="Services"
                style={getTextStyles('/system/services')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Staff Management - Owner Only (role 1) */}
        {user && isOwner(user.role) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/staff')}
              style={getNavButtonStyles('/system/staff')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <StaffIcon style={getIconStyles('/system/staff')} />
              </ListItemIcon>
              <ListItemText
                primary="Staff"
                style={getTextStyles('/system/staff')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Products Management - Owner Only (role 1) */}
        {user && isOwner(user.role) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/products')}
              style={getNavButtonStyles('/system/products')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <ProductsIcon style={getIconStyles('/system/products')} />
              </ListItemIcon>
              <ListItemText
                primary="Products"
                style={getTextStyles('/system/products')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Company Users - Owner Only (role 1) */}
        {user && isOwner(user.role) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/company-users')}
              style={getNavButtonStyles('/system/company-users')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <PeopleIcon style={getIconStyles('/system/company-users')} />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                style={getTextStyles('/system/company-users')}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* My Companies - User (role 3) only */}
        {user && isUser(user.role) && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/system/my-companies')}
              style={getNavButtonStyles('/system/my-companies')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <BusinessIcon style={getIconStyles('/system/my-companies')} />
              </ListItemIcon>
              <ListItemText
                primary="My Companies"
                style={getTextStyles('/system/my-companies')}
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

        {/* Settings - Available for all authenticated users */}
        {user && (
          <ListItem disablePadding className="mb-4">
            <ListItemButton
              onClick={() => handleNavigation('/system/settings')}
              style={getNavButtonStyles('/system/settings')}
              className="hover:opacity-80 transition-all duration-200"
            >
              <ListItemIcon>
                <SettingsIcon style={getIconStyles('/system/settings')} />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                style={getTextStyles('/system/settings')}
              />
            </ListItemButton>
          </ListItem>
        )}

      {/* User Section at Bottom */}
      <Box
        className="border-t"
        style={{
          borderTopColor: uiTheme.border,
          backgroundColor: uiTheme.background
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
              {(() => {
                const profileImageUrl = getProfileImageUrl(user?.profileImage)
                return (
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
                    {...(profileImageUrl && { src: profileImageUrl })}
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
                )
              })()}
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
            className="bg-red-600 text-white rounded-lg mt-2 hover:opacity-80 transition-all duration-200"
          >
            <ListItemIcon>
              <LogoutIcon className="text-white" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              className="text-white"
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      className="flex-shrink-0 fixed left-0 top-0 h-screen z-[70] min-w-0"
      style={{
        width: isMobile ? 0 : drawerWidth
      }}
    >
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          className="block"
          style={{
            width: drawerWidth,
            backgroundColor: uiTheme.background
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
              backgroundColor: uiTheme.background,
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
            backgroundColor: uiTheme.background
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              zIndex: 75,
              backgroundColor: uiTheme.background,
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
