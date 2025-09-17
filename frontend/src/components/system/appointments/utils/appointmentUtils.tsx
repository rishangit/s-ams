import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle
} from '@mui/icons-material'
import { 
  APPOINTMENT_STATUS, 
  getStatusDisplayName, 
  getStatusColor, 
  getNextStatus, 
  getNextStatusLabel, 
  getNextStatusColor 
} from '../../../../constants/appointmentStatus'

// Re-export status utility functions for use in components
export { getStatusDisplayName, getStatusColor }
import { isOwnerRole, isAdminRole, isStaffRole, isUserRole } from '../../../../constants/roles'

// Helper function to convert status to number
export const getStatusId = (status: string | number): number => {
  if (typeof status === 'number') return status
  switch (status) {
    case 'pending': return APPOINTMENT_STATUS.PENDING
    case 'confirmed': return APPOINTMENT_STATUS.CONFIRMED
    case 'completed': return APPOINTMENT_STATUS.COMPLETED
    case 'cancelled': return APPOINTMENT_STATUS.CANCELLED
    default: return APPOINTMENT_STATUS.PENDING
  }
}

// Generate row actions based on user role
export const generateRowActions = (
  user: any,
  onStatusChange: (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => void,
  onEditAppointment: (appointmentId: number) => void,
  onDeleteAppointment: (appointmentId: number) => void
) => {
  const isAdmin = user && isAdminRole(user.role as any)
  const isOwner = user && isOwnerRole(user.role as any)

  const actions = []

  // Add dynamic next status action for admin/owner (first)
  if (isAdmin || isOwner) {
    actions.push({
      id: 'nextStatus',
      label: (rowData: any) => {
        const statusId = getStatusId(rowData.status)
        return getNextStatusLabel(statusId)
      },
      icon: <CheckCircle fontSize="small" />,
      onClick: (rowData: any) => {
        const statusId = getStatusId(rowData.status)
        const nextStatus = getNextStatus(statusId)
        if (nextStatus !== null) {
          const nextStatusName = nextStatus === APPOINTMENT_STATUS.CONFIRMED ? 'confirmed' : 'completed'
          onStatusChange(rowData.id, nextStatusName as 'confirmed' | 'completed', rowData)
        }
      },
      color: (rowData: any) => {
        const statusId = getStatusId(rowData.status)
        return getNextStatusColor(statusId)
      },
      disabled: (rowData: any) => {
        const statusId = getStatusId(rowData.status)
        return statusId === APPOINTMENT_STATUS.COMPLETED || statusId === APPOINTMENT_STATUS.CANCELLED
      }
    })
  }

  // Add Edit Appointment (second)
  actions.push({
    id: 'edit',
    label: 'Edit Appointment',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditAppointment(rowData.id),
    color: 'primary'
  })

  actions.push({
    id: 'delete',
    label: 'Delete Appointment',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteAppointment(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers based on user role
export const getTableHeaders = (user: any) => {
  const headers = ['Date', 'Time', 'Service', 'Status', 'Staff Assignment', 'Notes', 'Created', 'Actions']
  
  if (user && isAdminRole(user.role as any)) {
    return ['Customer', 'Company', ...headers]
  } else if (user && isOwnerRole(user.role as any)) {
    return ['Customer', ...headers]
  } else if (user && isStaffRole(user.role as any)) {
    return ['Customer', 'Company', ...headers]
  } else if (user && isUserRole(user.role as any)) {
    return ['Company', ...headers]
  }
  
  return headers
}

// Check if user should see specific columns
export const shouldShowCustomerColumn = (user: any) => {
  return user && (isAdminRole(user.role as any) || isOwnerRole(user.role as any) || isStaffRole(user.role as any))
}

export const shouldShowCompanyColumn = (user: any) => {
  return user && (isAdminRole(user.role as any) || isStaffRole(user.role as any) || isUserRole(user.role as any))
}
