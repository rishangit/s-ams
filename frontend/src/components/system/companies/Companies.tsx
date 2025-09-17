import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAllCompaniesRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import { isAdminOnlyRole } from '../../../constants/roles'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import CompaniesListview from './CompaniesListview'
import CompaniesCardview from './CompaniesCardview'

const Companies: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { companies, loading, error, success } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)

  // Load companies when component mounts
  useEffect(() => {
    if (user && isAdminOnlyRole(parseInt(String(user.role)) as any)) {
      dispatch(getAllCompaniesRequest())
    }
  }, [user?.role, dispatch])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view)
  useEffect(() => {
    if (!userSelectedView) {
      if (isMobile && viewMode !== 'card') {
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView])

  // Reset user selection when screen size changes significantly
  useEffect(() => {
    setUserSelectedView(false)
  }, [isMobile])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCompanyError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCompanySuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const statusColor = getCompanyStatusColor(value)
    const statusText = getCompanyStatusDisplayName(value)
    
    return (
      <Chip
        label={statusText}
        size="small"
        style={{
          backgroundColor: statusColor,
          color: '#fff',
          fontWeight: 'bold'
        }}
      />
    )
  }


  // Company Name Cell Renderer Component
  const CompanyNameCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2">
        <BusinessIcon style={{ color: uiTheme.primary }} />
        <Box>
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.name}
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
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
          <PhoneIcon fontSize="small" style={{ color: uiTheme.primary }} />
          <div className="text-sm" style={{ color: uiTheme.text }}>
            {data.phoneNumber}
          </div>
        </Box>
        {data.landPhone && (
          <Box className="flex items-center gap-1">
            <PhoneIcon fontSize="small" style={{ color: uiTheme.primary }} />
            <div className="text-sm" style={{ color: uiTheme.textSecondary }}>
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
          <LocationIcon fontSize="small" style={{ color: uiTheme.primary }} />
          <div className="text-sm" style={{ color: uiTheme.text }}>
            {data.address}
          </div>
        </Box>
        {data.geoLocation && (
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
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
          className="w-8 h-8 border-2 border-white shadow-sm"
          style={{ backgroundColor: uiTheme.primary }}
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
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.userFirstName} {data.userLastName}
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
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

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

  // Company action handlers
  const handleViewCompany = (companyId: number) => {
    console.log('View company:', companyId)
    // TODO: Implement view company functionality
  }

  const handleEditCompany = (companyId: number) => {
    console.log('Edit company:', companyId)
    // TODO: Implement edit company functionality
  }

  const handleDeleteCompany = (companyId: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      console.log('Delete company:', companyId)
      // TODO: Implement delete company functionality
    }
  }

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => {
    const actions: RowAction[] = [
      {
        id: 'view',
        label: 'View Company',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: (rowData) => handleViewCompany(rowData.id),
        color: 'primary'
      },
      {
        id: 'edit',
        label: 'Edit Company',
        icon: <EditIcon fontSize="small" />,
        onClick: (rowData) => handleEditCompany(rowData.id),
        color: 'info'
      },
      {
        id: 'delete',
        label: 'Delete Company',
        icon: <DeleteIcon fontSize="small" />,
        onClick: (rowData) => handleDeleteCompany(rowData.id),
        color: 'error'
      }
    ]

    return actions
  }, [])

  if (!user || !isAdminOnlyRole(parseInt(String(user.role)) as any)) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold" style={{ color: uiTheme.text }}>
          Access Denied. Admin privileges required.
        </div>
      </Box>
    )
  }

  return (
    <Box className="h-full p-6">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <h1 className="text-2xl font-bold" style={{ color: uiTheme.text }}>
            Companies Management
          </h1>
          <p className="text-sm" style={{ color: uiTheme.textSecondary }}>
            Manage all companies in the system
          </p>
        </Box>
        
        {/* View Switcher */}
        <Box className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: uiTheme.border }}>
          {!isMobile && (
            <Tooltip title="Grid View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('grid')}
                style={{
                  backgroundColor: viewMode === 'grid' ? uiTheme.primary : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : uiTheme.text
                }}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {!isMobile && (
            <Tooltip title="List View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('list')}
                style={{
                  backgroundColor: viewMode === 'list' ? uiTheme.primary : 'transparent',
                  color: viewMode === 'list' ? '#ffffff' : uiTheme.text
                }}
              >
                <ListViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Card View">
            <IconButton
              size="small"
              onClick={() => handleViewModeChange('card')}
              style={{
                backgroundColor: viewMode === 'card' ? uiTheme.primary : 'transparent',
                color: viewMode === 'card' ? '#ffffff' : uiTheme.text
              }}
            >
              <CardViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CustomGrid
          title="Companies Management"
          data={companies || []}
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
      ) : viewMode === 'list' ? (
        <CompaniesListview
          filteredCompanies={companies || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
        />
      ) : (
        <CompaniesCardview
          filteredCompanies={companies || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
        />
      )}
    </Box>
  )
}

export default Companies
