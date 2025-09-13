import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  SwapHoriz as SwapIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  PersonPin as UserIcon
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { getRoleDisplayName, ROLES, RoleId } from '../../constants/roles'
import { parseUserRole } from '../../utils/roleUtils'

const RoleSwitcher: React.FC = () => {
  const { 
    user, 
    availableRoles, 
    roleSwitching, 
    error,
    getAvailableRoles,
    switchRole,
    switchBack,
    clearError
  } = useAuth()

  const [showSwitcher, setShowSwitcher] = useState(false)
  const [selectedRole, setSelectedRole] = useState<number | ''>('')

  useEffect(() => {
    if (user && !availableRoles.length) {
      getAvailableRoles()
    }
  }, [user, availableRoles.length, getAvailableRoles])

  const handleSwitchRole = (targetRole: number) => {
    clearError()
    switchRole(targetRole)
    setSelectedRole('') // Reset selection after switching
  }

  const handleRoleSelection = (roleId: number) => {
    setSelectedRole(roleId)
  }

  const handleSwitchBack = () => {
    clearError()
    switchBack()
  }

  const getRoleIcon = (roleId: number) => {
    switch (roleId) {
      case ROLES.ADMIN:
        return <AdminIcon />
      case ROLES.OWNER:
        return <BusinessIcon />
      case ROLES.STAFF:
        return <GroupIcon />
      case ROLES.USER:
        return <UserIcon />
      default:
        return <PersonIcon />
    }
  }


  if (!user) {
    return null
  }

  // Don't show role switcher for users (they can't switch to any other role)
  if (parseUserRole(user.role) === ROLES.USER) {
    return null
  }

  return (
    <Box className="mb-4">
      {/* Current Role Display */}
      <Paper
        className="p-4"
        style={{
          backgroundColor: user.isRoleSwitched ? '#fff3cd' : '#f8f9fa',
          border: `1px solid ${user.isRoleSwitched ? '#ffc107' : '#dee2e6'}`
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            {getRoleIcon(parseUserRole(user.role))}
            <Box>
              <Typography variant="h6" className="font-semibold">
                Current Role: {getRoleDisplayName(parseUserRole(user.role))}
              </Typography>
              {user.isRoleSwitched && (
                <Typography variant="body2" color="text.secondary">
                  Temporarily switched from {getRoleDisplayName((user.originalRole || 0) as RoleId)}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box className="flex items-center space-x-2">
            {user.isRoleSwitched && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSwitchBack}
                disabled={roleSwitching}
                startIcon={<SwapIcon />}
              >
                {roleSwitching ? <CircularProgress size={20} /> : 'Switch Back'}
              </Button>
            )}
            
            {availableRoles.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowSwitcher(!showSwitcher)
                  if (showSwitcher) {
                    setSelectedRole('') // Reset selection when hiding
                  }
                }}
                startIcon={<SwapIcon />}
              >
                {showSwitcher ? 'Hide' : 'Switch Role'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" className="mt-2" onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Role Switcher */}
      {showSwitcher && (
        <Paper className="p-4 mt-4">
          <Typography variant="h6" className="mb-3 font-semibold">
            Switch Role
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Select a role to temporarily switch to and test the system from that perspective.
          </Typography>
          
          <Box className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <FormControl fullWidth className="md:max-w-xs">
              <InputLabel>Select Role to Switch To</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => handleRoleSelection(e.target.value as number)}
                label="Select Role to Switch To"
                disabled={roleSwitching}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box className="flex items-center space-x-2">
                      {getRoleIcon(role.id)}
                      <Box>
                        <Typography variant="body1" className="font-medium">
                          {role.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => selectedRole && handleSwitchRole(selectedRole)}
              disabled={!selectedRole || roleSwitching}
              startIcon={roleSwitching ? <CircularProgress size={20} /> : <SwapIcon />}
              className="md:min-w-[140px]"
            >
              {roleSwitching ? 'Switching...' : 'Switch Role'}
            </Button>
          </Box>

          <Divider className="my-4" />
          
          <Box className="bg-blue-50 p-3 rounded-lg">
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Role switching is temporary and only affects your current session. 
              You can switch back to your original role at any time using the "Switch Back" button above.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default RoleSwitcher
