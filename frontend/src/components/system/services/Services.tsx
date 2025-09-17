import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Build as ServicesIcon,
  Add as AddIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import ServiceForm from './ServiceForm'
import ServicesListview from './ServicesListview'
import ServicesCardview from './ServicesCardview'
import { 
  getServicesRequest, 
  deleteServiceRequest,
  clearServicesMessages,
  Service 
} from '../../../store/actions/servicesActions'

const Services: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { 
    services, 
    loading, 
    error, 
    success
  } = useSelector((state: RootState) => state.services)

  // Memoize services to prevent unnecessary re-renders
  const memoizedServices = useMemo(() => services, [services])

  const [statusFilter, setStatusFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const hasLoadedServices = useRef(false)

  // Load services when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 1 && !hasLoadedServices.current) {
      hasLoadedServices.current = true
      dispatch(getServicesRequest())
    }
  }, [user]) // Run when user is available

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
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearServicesMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])


  const handleDeleteService = (serviceId: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return
    }
    dispatch(deleteServiceRequest(serviceId))
  }

  const handleAddModalClose = () => {
    setIsAddModalOpen(false)
    // No need to refresh - Redux automatically updates the list when service is created
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingService(null)
    // No need to refresh - Redux automatically updates the list when service is updated
  }

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

  // Filter services based on status
  const filteredServices = useMemo(() => {
    if (!services) return []
    if (!statusFilter) return services
    return services.filter(service => service.status === statusFilter)
  }, [services, statusFilter])

  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    return (
      <Chip
        label={value}
        size="small"
        style={{
          backgroundColor: value === 'active' ? '#10b981' : '#ef4444',
          color: '#ffffff',
          fontWeight: 'bold'
        }}
      />
    )
  }

  const PriceCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    const formattedPrice = !isNaN(numericValue) ? numericValue.toFixed(2) : '0.00'
    return (
      <span style={{ fontWeight: 'bold', color: uiTheme.primary }}>
        ${formattedPrice}
      </span>
    )
  }

  const DurationCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <span>
        {data.duration || 'Not specified'}
      </span>
    )
  }


  // Row Actions Configuration
  const rowActions: RowAction[] = [
    {
      id: 'edit',
      label: 'Edit Service',
      icon: <EditIcon fontSize="small" />,
      onClick: (rowData) => handleEditService(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Service',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rowData) => handleDeleteService(rowData.id),
      color: 'error'
    }
  ]

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) => (
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          display: 'block',
          maxWidth: '100%'
        }}>
          {params.value || 'No description'}
        </span>
      )
    },
    {
      headerName: 'Duration',
      field: 'duration',
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      cellRenderer: DurationCellRenderer
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      width: 100,
      minWidth: 80,
      cellRenderer: PriceCellRenderer
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      resizable: true,
      width: 100,
      minWidth: 80,
      cellRenderer: StatusCellRenderer
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
      width: 120,
      minWidth: 100,
      valueGetter: (params) => new Date(params.data.createdAt).toLocaleDateString()
    }
  ], [uiTheme])

  // Access control check
  if (!user || parseInt(String(user.role)) !== 1) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold" style={{ color: uiTheme.text }}>
          Access Denied. Owner privileges required.
        </div>
      </Box>
    )
  }

  return (
    <Box className="h-full md:p-6">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6">
        <ServicesIcon style={{ color: uiTheme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: uiTheme.text }}
        >
          Services
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6">
        <Box className="flex flex-row items-center gap-4">
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

          {/* Status Filter */}
          <FormControl size="small" style={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Add Button */}
          <Button
            variant="contained"
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: uiTheme.primary, color: '#ffffff' }}
            startIcon={<AddIcon />}
            className="w-auto"
          >
            <span>Add Service</span>
          </Button>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CustomGrid
          title="Services"
          data={filteredServices || []}
          columnDefs={columnDefs}
          loading={loading}
          error={error}
          success={success}
          theme={uiTheme}
          height="calc(100vh - 280px)"
          showTitle={false}
          showAlerts={true}
          rowActions={rowActions}
        />
      ) : viewMode === 'list' ? (
        <ServicesListview
          filteredServices={filteredServices || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditService={(serviceId) => handleEditService({ id: serviceId } as Service)}
          onDeleteService={handleDeleteService}
        />
      ) : (
        <ServicesCardview
          filteredServices={filteredServices || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditService={(serviceId) => handleEditService({ id: serviceId } as Service)}
          onDeleteService={handleDeleteService}
        />
      )}

      {/* Add Service Modal */}
      <ServiceForm
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
      />

      {/* Edit Service Modal */}
      <ServiceForm
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        serviceId={editingService?.id || null}
      />
    </Box>
  )
}

export default Services
