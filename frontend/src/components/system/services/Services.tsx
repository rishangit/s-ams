import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Build as ServicesIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ViewSwitcher, ViewMode } from '../../../components/shared'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import ServiceForm from './ServiceForm'
import ServicesGridview from './ServicesGridview'
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
  const { servicesView } = useViewMode()
  const { 
    services, 
    loading, 
    error, 
    success
  } = useSelector((state: RootState) => state.services)

  // Memoize services to prevent unnecessary re-renders

  const [viewMode, setViewMode] = useState<ViewMode>(servicesView as ViewMode)
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

  // Sync view mode with user settings
  useEffect(() => {
    if (servicesView && !userSelectedView) {
      setViewMode(servicesView as ViewMode)
    }
  }, [servicesView, userSelectedView])

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


  // Get all services
  const filteredServices = useMemo(() => {
    if (!services) return []
    return services
  }, [services])


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
    <Box className="flex flex-col h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
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
      <Box className="flex justify-end mb-6 flex-shrink-0">
        <Box className="flex flex-row items-center gap-4">
          {/* View Mode Selector */}
          <ViewModeSelector
            section="services"
            currentView={viewMode}
            onViewChange={(newView) => {
              setViewMode(newView as ViewMode)
              setUserSelectedView(true)
            }}
          />


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
      <Box className="flex-1 min-h-0">
        {viewMode === 'grid' ? (
        <ServicesGridview
          filteredServices={filteredServices || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditService={(serviceId) => handleEditService({ id: serviceId } as Service)}
          onDeleteService={handleDeleteService}
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
      </Box>

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
