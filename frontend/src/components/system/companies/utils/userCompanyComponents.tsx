import {
  Box,
  Typography
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { formatUserCompanyPhone, formatUserCompanyAddress, formatUserCompanyGeoLocation, formatTotalAppointments } from './userCompanyUtils'

// User Company Info Component (for cards)
export const UserCompanyInfo = ({ 
  company 
}: { 
  company: any
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6366f120'
      }}
    >
      <BusinessIcon sx={{ color: '#6366f1', fontSize: 24 }} />
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {company.name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#666' }}>
        ID: {company.id}
      </Typography>
    </Box>
  </Box>
)

// User Company Name Component
export const UserCompanyName = ({ 
  name, 
  id, 
  variant = 'h6' 
}: { 
  name: string
  id: number
  variant?: 'h6' | 'body2'
}) => (
  <Box>
    <Typography variant={variant} sx={{ fontWeight: 'bold' }}>
      {name}
    </Typography>
    <Typography variant="caption" sx={{ color: '#666' }}>
      ID: {id}
    </Typography>
  </Box>
)

// User Company Contact Info Component
export const UserCompanyContactInfo = ({ 
  phoneNumber, 
  landPhone 
}: { 
  phoneNumber?: string
  landPhone?: string
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: landPhone ? 1 : 0 }}>
      <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
      <Typography variant="body2" sx={{ color: '#666' }}>
        {formatUserCompanyPhone(phoneNumber)}
      </Typography>
    </Box>
    {landPhone && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
        <Typography variant="body2" sx={{ color: '#666' }}>
          {formatUserCompanyPhone(landPhone)}
        </Typography>
      </Box>
    )}
  </Box>
)

// User Company Location Component
export const UserCompanyLocation = ({ 
  address, 
  geoLocation 
}: { 
  address?: string
  geoLocation?: string
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: geoLocation ? 1 : 0 }}>
      <LocationIcon sx={{ color: '#666', fontSize: 16 }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#666',
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {formatUserCompanyAddress(address)}
      </Typography>
    </Box>
    {geoLocation && (
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#999',
          ml: 3,
          display: 'block'
        }}
      >
        {formatUserCompanyGeoLocation(geoLocation)}
      </Typography>
    )}
  </Box>
)

// User Company Total Appointments Component
export const UserCompanyTotalAppointments = ({ 
  totalAppointments 
}: { 
  totalAppointments?: number
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CalendarIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold' }}>
      {formatTotalAppointments(totalAppointments)}
    </Typography>
  </Box>
)
