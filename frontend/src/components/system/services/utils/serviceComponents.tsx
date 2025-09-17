import {
  Box,
  Typography,
  Chip
} from '@mui/material'
import {
  AccessTime as TimeIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material'
import { formatPrice, getServiceStatusColor, getServiceStatusDisplayName } from './serviceUtils'

// Service Name Component
export const ServiceName = ({ 
  name, 
  variant = 'h6' 
}: { 
  name: string
  variant?: 'h6' | 'body2'
}) => (
  <Typography variant={variant} sx={{ fontWeight: 'bold' }}>
    {name || 'Unknown Service'}
  </Typography>
)

// Service Description Component
export const ServiceDescription = ({ 
  description, 
  maxWidth = 200 
}: { 
  description?: string
  maxWidth?: number
}) => (
  <Typography 
    variant="body2" 
    sx={{ 
      maxWidth,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#666'
    }}
  >
    {description || 'No description'}
  </Typography>
)

// Service Duration Component
export const ServiceDuration = ({ duration }: { duration?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <TimeIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {duration || 'Not specified'}
    </Typography>
  </Box>
)

// Service Price Component
export const ServicePrice = ({ 
  price, 
  variant = 'body2' 
}: { 
  price: string | number
  variant?: 'h6' | 'body2'
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PriceIcon sx={{ color: '#10b981', fontSize: 16 }} />
    <Typography 
      variant={variant} 
      sx={{ 
        fontWeight: 'bold', 
        color: '#10b981' 
      }}
    >
      {formatPrice(price)}
    </Typography>
  </Box>
)

// Service Status Chip Component
export const ServiceStatusChip = ({ status }: { status: string }) => {
  const statusColor = getServiceStatusColor(status)
  const statusDisplayName = getServiceStatusDisplayName(status)

  return (
    <Chip
      label={statusDisplayName}
      size="small"
      style={{
        backgroundColor: statusColor,
        color: '#ffffff',
        fontWeight: 'bold'
      }}
    />
  )
}

// Service Info Component (for cards)
export const ServiceInfo = ({ 
  name, 
  description, 
  price 
}: { 
  name: string
  description?: string
  price: string | number
}) => (
  <Box>
    <ServiceName name={name} variant="h6" />
    <ServiceDescription description={description} maxWidth={300} />
    <ServicePrice price={price} variant="h6" />
  </Box>
)
