import {
  Visibility as ViewIcon
} from '@mui/icons-material'
import { getRoleDisplayName } from '../../../../constants/roles'
import { format } from 'date-fns'

// Generate row actions for company users
export const generateCompanyUserRowActions = (
  onViewAppointments: (userId: number) => void
) => {
  const actions = []

  // Add View Appointments
  actions.push({
    id: 'viewAppointments',
    label: 'View All Appointments',
    icon: <ViewIcon fontSize="small" />,
    onClick: (rowData: any) => onViewAppointments(rowData.id),
    color: 'primary'
  })

  return actions
}

// Get table headers for company users
export const getCompanyUserTableHeaders = () => {
  return ['Name', 'Email', 'Phone', 'Total Appointments', 'First Appointment', 'Last Appointment', 'Member Since', 'Actions']
}

// Get role display name
export const getCompanyUserRoleDisplayName = (role: number): string => {
  return getRoleDisplayName(role as any)
}

// Format date display
export const formatCompanyUserDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'MMM dd, yyyy')
}

// Format phone display
export const formatCompanyUserPhone = (phone?: string): string => {
  return phone || 'N/A'
}

// Format total appointments
export const formatTotalAppointments = (count: number): string => {
  return count.toString()
}
