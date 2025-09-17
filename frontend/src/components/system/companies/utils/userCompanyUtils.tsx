import React from 'react'
import {
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'

// Generate row actions for user companies
export const generateUserCompanyRowActions = (
  onViewCompany: (companyId: number) => void,
  onBookAppointment: (companyId: number) => void
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

  // Add Book Appointment
  actions.push({
    id: 'book',
    label: 'Book Appointment',
    icon: <CalendarIcon fontSize="small" />,
    onClick: (rowData: any) => onBookAppointment(rowData.id),
    color: 'success'
  })

  return actions
}

// Get table headers for user companies
export const getUserCompanyTableHeaders = () => {
  return ['Company', 'Contact Info', 'Location', 'Total Appointments', 'Actions']
}

// Format phone display
export const formatUserCompanyPhone = (phone?: string): string => {
  return phone || 'N/A'
}

// Format address display
export const formatUserCompanyAddress = (address?: string): string => {
  return address || 'N/A'
}

// Format geo location display
export const formatUserCompanyGeoLocation = (geoLocation?: string): string => {
  return geoLocation || ''
}

// Format total appointments
export const formatTotalAppointments = (totalAppointments?: number): string => {
  return totalAppointments ? totalAppointments.toString() : '0'
}
