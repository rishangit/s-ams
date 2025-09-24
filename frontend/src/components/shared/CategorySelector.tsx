import React, { useState, useEffect, useCallback } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip
} from '@mui/material'
import { useCategories } from '../../hooks/useCategories'

interface CategorySelectorProps {
  selectedCategoryId?: number
  selectedSubcategoryId?: number
  onCategoryChange: (categoryId: number | null) => void
  onSubcategoryChange: (subcategoryId: number | null) => void
  required?: boolean
  disabled?: boolean
  label?: string
  subcategoryLabel?: string
  theme?: any
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
  required = false,
  disabled = false,
  label = 'Category',
  subcategoryLabel = 'Subcategory',
  theme
}) => {
  const {
    categoriesWithSubcategories,
    loading,
    getSubcategoriesByCategory,
    getSubcategoriesForCategory
  } = useCategories()

  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  // Load subcategories when category changes - simplified to avoid infinite loops
  useEffect(() => {
    if (selectedCategoryId) {
      // Find the category in the loaded categories
      const category = categoriesWithSubcategories.find(cat => cat.id === selectedCategoryId)
      if (category && category.subcategories) {
        setAvailableSubcategories(category.subcategories)
      } else {
        // If subcategories not loaded, try to load them
        setAvailableSubcategories([])
        getSubcategoriesByCategory(selectedCategoryId)
      }
    } else {
      setAvailableSubcategories([])
      onSubcategoryChange(null)
    }
  }, [selectedCategoryId, categoriesWithSubcategories])

  // Update available subcategories when categories are loaded
  useEffect(() => {
    if (selectedCategoryId && categoriesWithSubcategories.length > 0) {
      const category = categoriesWithSubcategories.find(cat => cat.id === selectedCategoryId)
      if (category && category.subcategories) {
        setAvailableSubcategories(category.subcategories)
      }
    }
  }, [selectedCategoryId, categoriesWithSubcategories])

  const handleCategoryChange = (event: any) => {
    const categoryId = event.target.value
    onCategoryChange(categoryId || null)
  }

  const handleSubcategoryChange = (event: any) => {
    const subcategoryId = event.target.value
    onSubcategoryChange(subcategoryId || null)
  }

  const getCategoryIcon = (icon?: string) => {
    // You can implement icon mapping here
    return icon || 'business'
  }

  const getCategoryColor = (color?: string) => {
    return color || '#6366f1'
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="body2" color="textSecondary">
          Loading categories...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Category Selection */}
      <FormControl fullWidth required={required} disabled={disabled}>
        <InputLabel 
          style={{ color: theme?.textSecondary }}
        >
          {label}
        </InputLabel>
        <Select
          value={selectedCategoryId || ''}
          onChange={handleCategoryChange}
          label={label}
          style={{ color: theme?.text }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme?.border
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme?.primary
            }
          }}
        >
          <MenuItem value="">
            <em>Select a category</em>
          </MenuItem>
          {categoriesWithSubcategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={category.name}
                  size="small"
                  style={{
                    backgroundColor: getCategoryColor(category.color),
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  ({category.subcategories?.length || 0} subcategories)
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subcategory Selection */}
      {selectedCategoryId && availableSubcategories.length > 0 && (
        <FormControl fullWidth disabled={disabled}>
          <InputLabel 
            style={{ color: theme?.textSecondary }}
          >
            {subcategoryLabel}
          </InputLabel>
          <Select
            value={selectedSubcategoryId || ''}
            onChange={handleSubcategoryChange}
            label={subcategoryLabel}
            style={{ color: theme?.text }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme?.border
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme?.primary
              }
            }}
          >
            <MenuItem value="">
              <em>Select a subcategory</em>
            </MenuItem>
            {availableSubcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {subcategory.name}
                  </Typography>
                  {subcategory.description && (
                    <Typography variant="caption" color="textSecondary">
                      - {subcategory.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  )
}

export default CategorySelector
