import React, { useMemo } from 'react'
import {
  Box,
  Chip,
  Avatar
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface CompaniesGridviewProps {
  filteredCompanies: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onEditCompany: (companyId: number) => void
  onDeleteCompany: (companyId: number) => void
}

const CompaniesGridview: React.FC<CompaniesGridviewProps> = ({
  filteredCompanies,
  loading,
  error,
  success,
  uiTheme,
  onViewCompany,
  onEditCompany,
  onDeleteCompany
}) => {
  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const statusColor = getCompanyStatusColor(value)
    const statusText = getCompanyStatusDisplayName(value)
    
    return (
      <Chip
        label={statusText}
        size="small"
        className="text-white font-bold"
        style={{
          backgroundColor: statusColor
        }}
      />
    )
  }

  // Company Name Cell Renderer Component
  const CompanyNameCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2">
        <BusinessIcon className="text-blue-600" />
        <Box>
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {data.name}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
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
      <Box>
        <Box className="flex items-center gap-1 mb-1">
          <PhoneIcon fontSize="small" className="text-blue-600" />
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {data.phoneNumber}
          </div>
        </Box>
        {data.landPhone && (
          <Box className="flex items-center gap-1">
            <PhoneIcon fontSize="small" className="text-blue-600" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
      <Box>
        <Box className="flex items-center gap-1 mb-1">
          <LocationIcon fontSize="small" className="text-blue-600" />
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {data.address}
          </div>
        </Box>
        {data.geoLocation && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {data.geoLocation}
          </div>
        )}
      </Box>
    )
  }

  // Owner Cell Renderer Component
  const OwnerCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-3">
        <Avatar
          className="w-8 h-8 border-2 border-white shadow-sm bg-blue-600"
          src={getProfileImageUrl(data.userProfileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('Owner Avatar image failed to load:', target.src)
            console.error('Owner profile image path:', data.userProfileImage)
          }}
        >
          <span className="text-white font-semibold text-xs">
            {data.userFirstName?.charAt(0)}{data.userLastName?.charAt(0)}
          </span>
        </Avatar>
        <Box>
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {data.userFirstName} {data.userLastName}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {data.userEmail}
          </div>
        </Box>
      </Box>
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
      minWidth: 200
    },
    {
      headerName: 'Contact Info',
      field: 'phoneNumber',
      cellRenderer: ContactInfoCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Location',
      field: 'address',
      cellRenderer: LocationCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100
    },
    {
      headerName: 'Owner',
      field: 'userFirstName',
      cellRenderer: OwnerCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    }
  ], [uiTheme])

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => {
    const actions: RowAction[] = [
      {
        id: 'view',
        label: 'View Company',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: (rowData) => onViewCompany(rowData.id),
        color: 'primary'
      },
      {
        id: 'edit',
        label: 'Edit Company',
        icon: <EditIcon fontSize="small" />,
        onClick: (rowData) => onEditCompany(rowData.id),
        color: 'info'
      },
      {
        id: 'delete',
        label: 'Delete Company',
        icon: <DeleteIcon fontSize="small" />,
        onClick: (rowData) => onDeleteCompany(rowData.id),
        color: 'error'
      }
    ]

    return actions
  }, [onViewCompany, onEditCompany, onDeleteCompany])

  return (
    <CustomGrid
      title="Companies Management"
      data={filteredCompanies || []}
      columnDefs={columnDefs}
      loading={loading}
      error={error}
      success={success}
      theme={uiTheme}
      height="calc(100vh - 200px)"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
    />
  )
}

export default CompaniesGridview
