import {
  Box,
  Typography,
  Chip
} from '@mui/material'
import {
  Category as CategoryIcon
} from '@mui/icons-material'

// Category Info Component
export const CategoryInfo = ({ 
  category 
}: { 
  category: any
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
        backgroundColor: category.color ? `${category.color}20` : '#6366f120'
      }}
    >
      <CategoryIcon 
        sx={{ 
          color: category.color || '#6366f1', 
          fontSize: 24 
        }} 
      />
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {category.name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#666' }}>
        ID: {category.id}
      </Typography>
    </Box>
  </Box>
)

// Category Description Component
export const CategoryDescription = ({ 
  description 
}: { 
  description?: string
}) => (
  <Box>
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
      {description || 'No description available'}
    </Typography>
  </Box>
)

// Category Color Component
export const CategoryColor = ({ 
  color 
}: { 
  color?: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: 1,
        border: '1px solid #ddd',
        backgroundColor: color || '#6366f1'
      }}
    />
    <Typography 
      variant="caption" 
      sx={{ 
        color: '#666',
        fontFamily: 'monospace'
      }}
    >
      {color || '#6366f1'}
    </Typography>
  </Box>
)

// Category Icon Component
export const CategoryIconDisplay = ({ 
  icon 
}: { 
  icon?: string
}) => (
  <Box>
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#666',
        fontFamily: 'monospace'
      }}
    >
      {icon || 'N/A'}
    </Typography>
  </Box>
)

// Category Sort Order Component
export const CategorySortOrder = ({ 
  sortOrder 
}: { 
  sortOrder?: number
}) => (
  <Box>
    <Chip
      label={sortOrder || 0}
      size="small"
      variant="outlined"
      sx={{
        borderColor: '#6366f1',
        color: '#6366f1',
        fontSize: '0.75rem'
      }}
    />
  </Box>
)

// Category Subcategories Count Component
export const CategorySubcategoriesCount = ({ 
  count 
}: { 
  count?: number
}) => (
  <Box>
    <Chip
      label={count || 0}
      size="small"
      sx={{
        backgroundColor: '#6366f1',
        color: 'white',
        fontSize: '0.75rem'
      }}
    />
  </Box>
)

// Category Status Chip Component
export const CategoryStatusChip = ({ isActive }: { isActive?: boolean }) => {
  const statusColor = isActive ? '#10b981' : '#ef4444'
  const statusText = isActive ? 'Active' : 'Inactive'

  return (
    <Chip
      label={statusText}
      size="small"
      sx={{
        backgroundColor: statusColor,
        color: '#ffffff',
        fontWeight: 'bold'
      }}
    />
  )
}
