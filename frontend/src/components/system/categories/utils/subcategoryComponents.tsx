import { Box, Typography, Chip } from '@mui/material'
import { Category as SubcategoryIcon } from '@mui/icons-material'
import React from 'react'

export const SubcategoryInfo = ({ subcategory }: { subcategory: any }) => (
  <Box className="flex items-center gap-2">
    <Box
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: subcategory.color || '#6366f120' }}
    >
      <SubcategoryIcon style={{ color: 'white', fontSize: '1.25rem' }} />
    </Box>
    <Box>
      <Typography variant="body1" className="font-semibold" style={{ color: 'inherit' }}>
        {subcategory.name}
      </Typography>
      <Typography variant="caption" style={{ color: 'inherit' }}>
        ID: {subcategory.id}
      </Typography>
    </Box>
  </Box>
)

export const SubcategoryDescription = ({ description }: { description?: string }) => (
  <Typography
    variant="body2"
    style={{ color: 'inherit' }}
    className="max-w-xs truncate"
  >
    {description || 'No description'}
  </Typography>
)

export const SubcategoryColor = ({ color, themePrimary }: { color?: string, themePrimary: string }) => (
  <Box className="flex items-center gap-2">
    <Box
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color || themePrimary }}
    >
      <SubcategoryIcon style={{ color: 'white', fontSize: '1rem' }} />
    </Box>
    <Typography
      variant="body2"
      style={{ color: 'inherit' }}
    >
      {color || themePrimary}
    </Typography>
  </Box>
)

export const SubcategoryIconDisplay = ({ icon }: { icon?: string }) => (
  <Typography
    variant="body2"
    style={{ color: 'inherit', fontFamily: 'monospace' }}
  >
    {icon || 'N/A'}
  </Typography>
)

export const SubcategorySortOrder = ({ sortOrder }: { sortOrder?: number }) => (
  <Chip
    label={sortOrder !== undefined ? String(sortOrder) : '0'}
    size="small"
    variant="outlined"
    style={{
      borderColor: 'inherit',
      color: 'inherit',
      fontWeight: 'bold'
    }}
  />
)

export const SubcategoryCategoryId = ({ categoryId }: { categoryId?: number }) => (
  <Chip
    label={categoryId || 'N/A'}
    size="small"
    style={{
      backgroundColor: '#6366f1', // Example primary color
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    }}
  />
)

export const SubcategoryStatusChip = ({ isActive }: { isActive: boolean }) => {
  const statusColor = isActive ? '#10b981' : '#ef4444'
  const statusDisplayName = isActive ? 'Active' : 'Inactive'

  return (
    <Chip
      label={statusDisplayName}
      size="small"
      style={{
        backgroundColor: statusColor,
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  )
}
