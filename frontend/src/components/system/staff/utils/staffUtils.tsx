import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { STAFF_STATUS, getStatusDisplayName } from '../../../../constants/staffStatus'

// Generate row actions for staff
export const generateStaffRowActions = (
  onEditStaff: (staffId: number) => void,
  onDeleteStaff: (staffId: number) => void
) => {
  const actions = []

  // Add Edit Staff
  actions.push({
    id: 'edit',
    label: 'Edit Staff',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditStaff(rowData.id),
    color: 'primary'
  })

  actions.push({
    id: 'delete',
    label: 'Delete Staff',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteStaff(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers for staff
export const getStaffTableHeaders = () => {
  return ['Staff Member', 'Email', 'Phone', 'Working Hours', 'Skills', 'Status', 'Actions']
}

// Get status color for staff
export const getStaffStatusColor = (status: number): string => {
  switch (status) {
    case STAFF_STATUS.ACTIVE:
      return '#10b981' // Green
    case STAFF_STATUS.INACTIVE:
      return '#6b7280' // Gray
    case STAFF_STATUS.SUSPENDED:
      return '#f59e0b' // Orange
    case STAFF_STATUS.TERMINATED:
      return '#ef4444' // Red
    default:
      return '#6b7280' // Gray
  }
}

// Get status display name
export const getStaffStatusDisplayName = (status: number): string => {
  return getStatusDisplayName(status)
}

// Format working hours
export const formatWorkingHours = (start?: string, end?: string): string => {
  if (start && end) {
    return `${start} - ${end}`
  } else if (start) {
    return `From ${start}`
  } else if (end) {
    return `Until ${end}`
  }
  return 'Not set'
}

// Format skills display
export const formatSkills = (skills?: string): string => {
  if (!skills) return 'None'
  return skills.length > 50 ? skills.substring(0, 50) + '...' : skills
}
