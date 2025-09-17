import {
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import { getProfileImageUrl } from '../../../../utils/fileUtils'
import { getCompanyStatusColor, getCompanyStatusDisplayName, formatCompanyPhone, formatCompanyAddress, formatCompanyGeoLocation } from './companyUtils'

// Company Info Component (for cards)
export const CompanyInfo = ({ 
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

// Company Name Component
export const CompanyName = ({ 
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

// Company Contact Info Component
export const CompanyContactInfo = ({ 
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
        {formatCompanyPhone(phoneNumber)}
      </Typography>
    </Box>
    {landPhone && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
        <Typography variant="body2" sx={{ color: '#666' }}>
          {formatCompanyPhone(landPhone)}
        </Typography>
      </Box>
    )}
  </Box>
)

// Company Location Component
export const CompanyLocation = ({ 
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
        {formatCompanyAddress(address)}
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
        {formatCompanyGeoLocation(geoLocation)}
      </Typography>
    )}
  </Box>
)

// Company Status Chip Component
export const CompanyStatusChip = ({ status }: { status: number }) => {
  const statusColor = getCompanyStatusColor(status)
  const statusDisplayName = getCompanyStatusDisplayName(status)

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

// Company Owner Component
export const CompanyOwner = ({ 
  owner 
}: { 
  owner: any
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar
      sx={{ 
        width: 32, 
        height: 32,
        backgroundColor: '#6366f1'
      }}
      src={getProfileImageUrl(owner.userProfileImage)}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement
        console.error('Owner Avatar image failed to load:', target.src)
      }}
    >
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
        {owner.userFirstName?.charAt(0)}{owner.userLastName?.charAt(0)}
      </span>
    </Avatar>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {owner.userFirstName} {owner.userLastName}
      </Typography>
      <Typography variant="caption" sx={{ color: '#666' }}>
        {owner.userEmail}
      </Typography>
    </Box>
  </Box>
)
