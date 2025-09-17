import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { getRoleDisplayName } from '../../../../constants/roles'

// Generate row actions for users
export const generateUserRowActions = (
  onViewUser: (userId: number) => void,
  onEditUser: (userId: number) => void,
  onDeleteUser: (userId: number) => void,
  currentUserId?: number
) => {
  const actions = []

  // Add View User
  actions.push({
    id: 'view',
    label: 'View User',
    icon: <ViewIcon fontSize="small" />,
    onClick: (rowData: any) => onViewUser(rowData.id),
    color: 'primary'
  })

  // Add Edit User
  actions.push({
    id: 'edit',
    label: 'Edit User',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditUser(rowData.id),
    color: 'info'
  })

  // Add Delete User (disabled for current user)
  actions.push({
    id: 'delete',
    label: 'Delete User',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteUser(rowData.id),
    color: 'error',
    disabled: (rowData: any) => rowData.id === currentUserId
  })

  return actions
}

// Get table headers for users
export const getUserTableHeaders = () => {
  return ['User', 'Email', 'Phone', 'Role', 'Created', 'Actions']
}

// Get role color for users
export const getUserRoleColor = (role: number): string => {
  switch (role) {
    case 0: // Admin
      return '#d32f2f' // Red
    case 1: // Owner
      return '#1976d2' // Blue
    case 2: // Staff
      return '#388e3c' // Green
    case 3: // User
      return '#f57c00' // Orange
    default:
      return '#757575' // Grey
  }
}

// Get role display name
export const getUserRoleDisplayName = (role: number): string => {
  return getRoleDisplayName(role as any)
}

// Format date display
export const formatUserDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format phone display
export const formatUserPhone = (phone?: string): string => {
  return phone || 'N/A'
}
