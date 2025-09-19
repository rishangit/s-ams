import React, { useMemo } from 'react'
import {
  Box,
  Chip
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'

interface UserCompaniesGridviewProps {
  filteredUserCompanies: any[]
  loading: boolean
  error: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onViewAppointments: (companyId: number) => void
  onBookAppointment: (companyId: number) => void
}

const UserCompaniesGridview: React.FC<UserCompaniesGridviewProps> = ({
  filteredUserCompanies,
  loading,
  error,
  uiTheme,
  onViewCompany,
  onViewAppointments,
  onBookAppointment
}) => {
  // Company Name Cell Renderer Component
  const CompanyNameCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2 h-full" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <BusinessIcon className="text-blue-600 flex-shrink-0" />
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <div 
            className="font-semibold text-sm text-gray-900 dark:text-gray-100"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {data.name}
          </div>
          <div 
            className="text-xs text-gray-600 dark:text-gray-400"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            ID: {data.id}
          </div>
        </Box>
      </Box>
    )
  }

  // Contact Info Cell Renderer Component
  const ContactInfoCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Box className="flex items-center gap-1 mb-1">
          <PhoneIcon fontSize="small" className="text-blue-600 flex-shrink-0" />
          <div 
            className="text-sm text-gray-900 dark:text-gray-100"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0
            }}
          >
            {data.phoneNumber}
          </div>
        </Box>
        {data.landPhone && data.landPhone !== data.phoneNumber && (
          <Box className="flex items-center gap-1">
            <PhoneIcon fontSize="small" className="text-blue-600 flex-shrink-0" />
            <div 
              className="text-sm text-gray-600 dark:text-gray-400"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {data.landPhone}
            </div>
          </Box>
        )}
      </Box>
    )
  }

  // Location Cell Renderer Component
  const LocationCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Box className="flex items-center gap-1 mb-1">
          <LocationIcon fontSize="small" className="text-blue-600 flex-shrink-0" />
          <div 
            className="text-sm text-gray-900 dark:text-gray-100"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0
            }}
          >
            {data.address}
          </div>
        </Box>
        {data.geoLocation && (
          <div 
            className="text-xs text-gray-600 dark:text-gray-400"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0
            }}
          >
            {data.geoLocation}
          </div>
        )}
      </Box>
    )
  }

  // Appointments Cell Renderer Component
  const AppointmentsCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2 h-full" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <CalendarIcon className="text-blue-600 flex-shrink-0" />
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <div 
            className="font-semibold text-sm text-gray-900 dark:text-gray-100"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {data.totalAppointments} Total
          </div>
          <div 
            className="text-xs text-gray-600 dark:text-gray-400"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            Last: {data.lastAppointmentDate ? new Date(data.lastAppointmentDate).toLocaleDateString() : 'N/A'}
          </div>
        </Box>
      </Box>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return { bg: '#d4edda', color: '#155724' }
        case 'pending':
          return { bg: '#fff3cd', color: '#856404' }
        case 'inactive':
          return { bg: '#f8d7da', color: '#721c24' }
        default:
          return { bg: '#e2e3e5', color: '#383d41' }
      }
    }
    
    const statusColors = getStatusColor(value)
    
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="small"
          className="text-xs font-bold"
          style={{
            backgroundColor: statusColors.bg,
            color: statusColors.color
          }}
        />
      </div>
    )
  }

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Company',
      field: 'name',
      cellRenderer: CompanyNameCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200,
      maxWidth: 300,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Contact Info',
      field: 'phoneNumber',
      cellRenderer: ContactInfoCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150,
      maxWidth: 250,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Location',
      field: 'address',
      cellRenderer: LocationCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200,
      maxWidth: 350,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Appointments',
      field: 'totalAppointments',
      cellRenderer: AppointmentsCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      width: 180,
      minWidth: 150,
      maxWidth: 220,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      maxWidth: 140,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    }
  ], [])

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => [
    {
      id: 'view',
      label: 'View Company',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (rowData) => onViewCompany(rowData.id),
      color: 'primary'
    },
    {
      id: 'appointments',
      label: 'View Appointments',
      icon: <CalendarIcon fontSize="small" />,
      onClick: (rowData) => onViewAppointments(rowData.id),
      color: 'info'
    },
    {
      id: 'book',
      label: 'Book Appointment',
      icon: <CalendarIcon fontSize="small" />,
      onClick: (rowData) => onBookAppointment(rowData.id),
      color: 'success'
    }
  ], [onViewCompany, onViewAppointments, onBookAppointment])

  return (
    <CustomGrid
      title="My Companies"
      data={filteredUserCompanies || []}
      columnDefs={columnDefs}
      loading={loading}
      error={error}
      theme={uiTheme}
      height="auto"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
      onGridReady={(_params) => {
        // Grid is ready for use
      }}
    />
  )
}

export default UserCompaniesGridview
