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
  Category as CategoryIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateCategoryRowActions
} from './utils/categoryUtils'

interface CategoriesCardviewProps {
  categories: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onViewSubcategories: (categoryId: number) => void
  onEditCategory: (categoryId: number) => void
  onDeleteCategory: (categoryId: number) => void
}

const CategoriesCardview: React.FC<CategoriesCardviewProps> = ({
  categories,
  loading,
  error,
  success,
  theme,
  onViewSubcategories,
  onEditCategory,
  onDeleteCategory
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCategoryRowActions(onViewSubcategories, onEditCategory, onDeleteCategory)
  }, [onViewSubcategories, onEditCategory, onDeleteCategory])

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
        {categories?.map((category) => (
          <div key={category.id} className="col-span-1 overflow-visible">
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
                  rowData={category}
                  actions={rowActions}
                  theme={theme}
                />
              </div>

              {/* Full-width Image Section with Category Theme */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background with category theme */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br scale-110 blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${category.color || theme.primary}20, ${category.color || theme.primary}40)`
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${category.color || theme.primary}30, ${category.color || theme.primary}50)`
                  }}
                />
                {/* Category Icon centered over blurred background */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Avatar
                    className="w-30 h-30 border-4 border-white shadow-lg"
                    style={{ 
                      backgroundColor: category.color || theme.primary,
                      width: 120,
                      height: 120
                    }}
                  >
                    <CategoryIcon className="text-white text-5xl" />
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
                {/* Title and Category Info */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: theme.text }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    ID: {category.id} • {category.subcategories?.length || 0} subcategories
                  </Typography>
                </div>

                {/* Status Category Tag */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: category.isActive ? '#10b981' : '#ef4444'
                    }}
                  />
                </div>

                {/* Additional Info - Simplified */}
                <div className="flex flex-col gap-2">
                  {category.description && (
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                        {category.description.length > 50 
                          ? `${category.description.substring(0, 50)}...` 
                          : category.description}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                      Sort Order: {category.sortOrder || 0}
                    </Typography>
                  </div>
                  {category.icon && (
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" className="text-xs" style={{ color: theme.textSecondary }}>
                        Icon: {category.icon}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${theme.primary}10` }}
          >
            <CategoryIcon className="text-4xl" style={{ color: theme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: theme.text }}>
            No categories found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Categories will appear here once they are created in the system
          </Typography>
        </div>
      )}
    </div>
  )
}

export default CategoriesCardview
