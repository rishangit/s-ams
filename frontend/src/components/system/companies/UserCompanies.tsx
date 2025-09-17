import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { CustomGrid, RowAction } from '../../../components/shared'
import { getCompaniesByUserAppointmentsRequest } from '../../../store/actions/companyActions'
import { 
  Box, 
  Typography, 
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon
} from '@mui/icons-material'
import UserCompaniesListview from './UserCompaniesListview'
import UserCompaniesCardview from './UserCompaniesCardview'

const UserCompanies: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { userCompanies, loading, error } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)

  // Debug state
  useEffect(() => {
    if (userCompanies || loading || error) {
      console.log('UserCompanies state update:', {
        userCompaniesLength: userCompanies?.length,
        loading,
        error,
        userCompaniesData: userCompanies
      })
    }
  }, [userCompanies, loading, error])

  // Debug grid data
  useEffect(() => {
    if (userCompanies && userCompanies.length > 0) {
      console.log('About to render CustomGrid with data:', userCompanies)
      console.log('First company fields:', Object.keys(userCompanies[0]))
    }
  }, [userCompanies])

  // Load companies when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 3) {
      console.log('UserCompanies: Dispatching getCompaniesByUserAppointmentsRequest for role 3 user')
      dispatch(getCompaniesByUserAppointmentsRequest())
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
        {data.landPhone && data.landPhone !== data.phoneNumber && (
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

  // Appointments Cell Renderer Component
  const AppointmentsCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2">
        <CalendarIcon style={{ color: uiTheme.primary }} />
        <Box>
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.totalAppointments} Total
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
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
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        size="small"
        style={{
          backgroundColor: statusColors.bg,
          color: statusColors.color,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}
      />
    )
  }

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

  const handleBookAppointment = (companyId: number) => {
    console.log('Book appointment for company:', companyId)
    // TODO: Implement book appointment functionality
  }

  // Row Actions Configuration
  const rowActions: RowAction[] = [
    {
      id: 'view',
      label: 'View Company',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (rowData) => handleViewCompany(rowData.id),
      color: 'primary'
    },
    {
      id: 'book',
      label: 'Book Appointment',
      icon: <CalendarIcon fontSize="small" />,
      onClick: (rowData) => handleBookAppointment(rowData.id),
      color: 'success'
    }
  ]

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
      headerName: 'Appointments',
      field: 'totalAppointments',
      cellRenderer: AppointmentsCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      width: 180,
      minWidth: 150
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
    }
  ], [uiTheme])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography variant="h6" sx={{ color: uiTheme.text }}>
          Loading companies...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography variant="h6" sx={{ color: 'error.main' }}>
          Error: {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full p-6">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <h1 className="text-2xl font-bold" style={{ color: uiTheme.text }}>
            My Companies
          </h1>
          <p className="text-sm" style={{ color: uiTheme.textSecondary }}>
            Companies where you have booked appointments
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

      {/* Debug Info */}
      {userCompanies && userCompanies.length > 0 && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: uiTheme.mode === 'dark' ? '#1e293b' : '#f8fafc', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: uiTheme.textSecondary, mb: 1 }}>
            Debug: Data received ({userCompanies.length} companies)
          </Typography>
          <Typography variant="caption" sx={{ color: uiTheme.textSecondary }}>
            First company: {userCompanies[0]?.name} - {userCompanies[0]?.totalAppointments} appointments
          </Typography>
        </Box>
      )}

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CustomGrid
          title="My Companies"
          data={userCompanies || []}
          columnDefs={columnDefs}
          loading={loading}
          error={error}
          theme={uiTheme}
          height="calc(100vh - 200px)"
          showTitle={false}
          showAlerts={true}
          rowActions={rowActions}
          onGridReady={(params) => {
            console.log('UserCompanies Grid Ready:', {
              rowCount: params.api.getDisplayedRowCount(),
              dataLength: userCompanies?.length,
              firstRowData: userCompanies?.[0],
              allRowData: userCompanies
            })
          }}
        />
      ) : viewMode === 'list' ? (
        <UserCompaniesListview
          filteredUserCompanies={userCompanies || []}
          loading={loading}
          error={error}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onBookAppointment={handleBookAppointment}
        />
      ) : (
        <UserCompaniesCardview
          filteredUserCompanies={userCompanies || []}
          loading={loading}
          error={error}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onBookAppointment={handleBookAppointment}
        />
      )}
    </Box>
  )
}

export default UserCompanies
