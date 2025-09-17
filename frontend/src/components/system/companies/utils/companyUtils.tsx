import React from 'react'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../../constants/company'

// Re-export the imported functions
export { getCompanyStatusDisplayName, getCompanyStatusColor }

// Generate row actions for companies
export const generateCompanyRowActions = (
  onViewCompany: (companyId: number) => void,
  onEditCompany: (companyId: number) => void,
  onDeleteCompany: (companyId: number) => void
) => {
  const actions = []

  // Add View Company
  actions.push({
    id: 'view',
    label: 'View Company',
    icon: <ViewIcon fontSize="small" />,
    onClick: (rowData: any) => onViewCompany(rowData.id),
    color: 'primary'
  })

  // Add Edit Company
  actions.push({
    id: 'edit',
    label: 'Edit Company',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditCompany(rowData.id),
    color: 'info'
  })

  // Add Delete Company
  actions.push({
    id: 'delete',
    label: 'Delete Company',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteCompany(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers for companies
export const getCompanyTableHeaders = () => {
  return ['Company', 'Contact Info', 'Location', 'Status', 'Owner', 'Actions']
}

// Format phone display
export const formatCompanyPhone = (phone?: string): string => {
  return phone || 'N/A'
}

// Format address display
export const formatCompanyAddress = (address?: string): string => {
  return address || 'N/A'
}

// Format geo location display
export const formatCompanyGeoLocation = (geoLocation?: string): string => {
  return geoLocation || ''
}
