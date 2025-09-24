import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip
} from '@mui/material'
import {
  Category as SubcategoryIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateSubcategoryRowActions
} from './utils/subcategoryUtils'

interface SubcategoriesCardviewProps {
  subcategories: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditSubcategory: (subcategoryId: number) => void
  onDeleteSubcategory: (subcategoryId: number) => void
}

const SubcategoriesCardview: React.FC<SubcategoriesCardviewProps> = ({
  subcategories,
  loading,
  error,
  success,
  theme,
  onEditSubcategory,
  onDeleteSubcategory
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateSubcategoryRowActions(onEditSubcategory, onDeleteSubcategory)
  }, [onEditSubcategory, onDeleteSubcategory])

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
        {subcategories?.map((subcategory) => (
          <div key={subcategory.id} className="col-span-1 overflow-visible">
            <Card 
              elevation={0}
              className="h-full flex flex-col relative overflow-visible rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1 group"
              style={{ 
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                '--hover-border-color': theme.primary,
                transformOrigin: 'center center',
                willChange: 'transform, box-shadow'
              } as React.CSSProperties}
            >
              {/* 3-Dot Menu in Top Right Corner */}
              <div 
                className="absolute top-2 right-2 z-20 rounded-full shadow-md"
                style={{ 
                  backgroundColor: theme.background,
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <RowActionsMenu
                  rowData={subcategory}
                  actions={rowActions}
                  theme={theme}
                />
              </div>

              {/* Full-width Image Section with Subcategory Theme */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background with subcategory theme */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br scale-110 blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${subcategory.color || theme.primary}20, ${subcategory.color || theme.primary}40)`
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${subcategory.color || theme.primary}30, ${subcategory.color || theme.primary}50)`
                  }}
                />
                {/* Subcategory Icon centered over blurred background */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Avatar
                    className="w-30 h-30 border-4 border-white shadow-lg"
                    style={{ 
                      backgroundColor: subcategory.color || theme.primary,
                      width: 120,
                      height: 120
                    }}
                  >
                    <SubcategoryIcon className="text-white text-5xl" />
                  </Avatar>
                </div>
              </div>

              {/* Content Section */}
              <CardContent 
                className="flex-grow p-5 rounded-t-xl"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Title and Subcategory Info */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: theme.text }}
                  >
                    {subcategory.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    ID: {subcategory.id} • Category: {subcategory.categoryId}
                  </Typography>
                </div>

                {/* Status Category Tag */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={subcategory.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: subcategory.isActive ? '#10b981' : '#ef4444'
                    }}
                  />
                </div>

                {/* Additional Info - Simplified */}
                <div className="flex flex-col gap-2">
                  {subcategory.description && (
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                        {subcategory.description.length > 50 
                          ? `${subcategory.description.substring(0, 50)}...` 
                          : subcategory.description}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                      Sort Order: {subcategory.sortOrder || 0}
                    </Typography>
                  </div>
                  {subcategory.icon && (
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                        Icon: {subcategory.icon}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {subcategories?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${theme.primary}10` }}
          >
            <SubcategoryIcon className="text-4xl" style={{ color: theme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: theme.text }}>
            No subcategories found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Subcategories will appear here once they are created in the system
          </Typography>
        </div>
      )}
    </div>
  )
}

export default SubcategoriesCardview

