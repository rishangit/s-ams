import React, { useMemo } from 'react'
import {
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  AccessTime as TimeIcon,
  AttachMoney as PriceIcon,
  Build as ServiceIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  ServiceStatusChip
} from './utils/serviceComponents'
import { 
  generateServiceRowActions
} from './utils/serviceUtils'

interface ServicesCardviewProps {
  filteredServices: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditService: (serviceId: number) => void
  onDeleteService: (serviceId: number) => void
}

const ServicesCardview: React.FC<ServicesCardviewProps> = ({
  filteredServices,
  loading,
  error,
  success,
  uiTheme,
  onEditService,
  onDeleteService
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateServiceRowActions(onEditService, onDeleteService)
  }, [onEditService, onDeleteService])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert severity="success" className="mb-4">
        {success}
      </Alert>
    )
  }

  return (
    <div className="p-0 overflow-visible">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
        {filteredServices?.map((service) => (
          <div key={service.id} className="col-span-1 overflow-visible">
            <div 
              className="h-full flex flex-col relative overflow-visible rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1 group"
              style={{ 
                backgroundColor: uiTheme.background,
                border: `1px solid ${uiTheme.border}`,
                '--hover-border-color': uiTheme.primary,
                transformOrigin: 'center center',
                willChange: 'transform, box-shadow'
              } as React.CSSProperties}
            >
              {/* 3-Dot Menu in Top Right Corner */}
              <div 
                className="absolute top-2 right-2 z-20 rounded-full shadow-md"
                style={{ 
                  backgroundColor: uiTheme.background,
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <RowActionsMenu
                  rowData={service}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </div>

              {/* Service Image Section */}
              <div
                className="h-32 relative overflow-hidden rounded-t-xl"
                style={{
                  background: `linear-gradient(135deg, ${uiTheme.primary}15 0%, ${uiTheme.primary}25 100%)`,
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Service Icon centered */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ 
                      backgroundColor: uiTheme.primary,
                    }}
                  >
                    <ServiceIcon className="text-white text-2xl" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div 
                className="flex-grow p-5 rounded-t-xl"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Title and Description */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: uiTheme.text }}
                  >
                    {service.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    {service.description ? 
                      (service.description.length > 50 
                        ? `${service.description.substring(0, 50)}...` 
                        : service.description
                      ) : 'No description'
                    }
                  </Typography>
                </div>

                {/* Status Chip */}
                <div className="flex justify-start mb-4">
                  <ServiceStatusChip status={service.status} />
                </div>

                {/* Price and Duration - Clean Display */}
                <div className="flex flex-col gap-3 mb-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PriceIcon className="w-5 h-5" style={{ color: uiTheme.primary }} />
                      <span className="text-sm font-medium" style={{ color: uiTheme.text }}>Price</span>
                    </div>
                    <Typography 
                      variant="h6" 
                      className="font-bold"
                      style={{ color: uiTheme.primary }}
                    >
                      ${typeof service.price === 'string' ? parseFloat(service.price).toFixed(2) : service.price?.toFixed(2) || '0.00'}
                    </Typography>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TimeIcon className="w-5 h-5" style={{ color: uiTheme.primary }} />
                      <span className="text-sm font-medium" style={{ color: uiTheme.text }}>Duration</span>
                    </div>
                    <Typography 
                      variant="body1" 
                      className="font-semibold"
                      style={{ color: uiTheme.text }}
                    >
                      {service.duration || 'Not specified'}
                    </Typography>
                  </div>
                </div>

                {/* Created Date - Simplified */}
                <div className="pt-2">
                  <Typography 
                    variant="caption" 
                    className="text-xs"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    Created: {new Date(service.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <ServiceIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No services found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Try adjusting your filters or create a new service
          </Typography>
        </div>
      )}
    </div>
  )
}

export default ServicesCardview
