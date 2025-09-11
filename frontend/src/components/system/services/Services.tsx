import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography
} from '@mui/material'
import {
  Build as ServicesIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { CustomGrid } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import ServiceForm from './ServiceForm'
import { 
  getServicesRequest, 
  deleteServiceRequest,
  clearServicesMessages,
  Service 
} from '../../../store/actions/servicesActions'

const Services: React.FC = () => {
  const dispatch = useDispatch()
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const hasLoadedServices = useRef(false)

  // Load services when component mounts
  useEffect(() => {
    if (user && parseInt(user.role) === 1 && !hasLoadedServices.current) {
      hasLoadedServices.current = true
      dispatch(getServicesRequest())
    }
  }, [user]) // Run when user is available

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

  const ActionsCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <Box className="flex items-center space-x-1">
        <Tooltip title="Edit Service">
          <IconButton
            size="small"
            onClick={() => handleEditService(data)}
            style={{ color: uiTheme.primary }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Service">
          <IconButton
            size="small"
            onClick={() => handleDeleteService(data.id)}
            style={{ color: '#ef4444' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

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
    },
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      resizable: false,
      width: 100,
      minWidth: 100,
      cellRenderer: ActionsCellRenderer
    }
  ], [uiTheme])

  // Access control check
  if (!user || parseInt(user.role) !== 1) {
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

      <CustomGrid
        title="Services"
        data={memoizedServices || []}
        columnDefs={columnDefs}
        loading={loading}
        error={error}
        success={success}
        theme={uiTheme}
        height="calc(100vh - 280px)"
        showTitle={false}
        showAlerts={true}
      />

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
