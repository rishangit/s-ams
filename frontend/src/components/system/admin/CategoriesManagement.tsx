import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useCategories } from '../../../hooks/useCategories'
import { useTheme } from '../../../hooks/useTheme'

const CategoriesManagement: React.FC = () => {
  const { theme: uiTheme } = useTheme()
  const { user } = useSelector((state: RootState) => state.auth)
  const {
    categoriesWithSubcategories,
    loading,
    error,
    success,
    creating,
    updating,
    deleting,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    clearError,
    clearSuccess
  } = useCategories()

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#6366f1',
    sortOrder: 0
  })

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#6366f1',
    sortOrder: 0
  })

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, clearSuccess])

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      description: '',
      icon: '',
      color: '#6366f1',
      sortOrder: 0
    })
    setCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color,
      sortOrder: category.sortOrder
    })
    setCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      deleteCategory(categoryId)
    }
  }

  const handleCreateSubcategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setEditingSubcategory(null)
    setSubcategoryForm({
      name: '',
      description: '',
      icon: '',
      color: '#6366f1',
      sortOrder: 0
    })
    setSubcategoryDialogOpen(true)
  }

  const handleEditSubcategory = (subcategory: any) => {
    setEditingSubcategory(subcategory)
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || '',
      icon: subcategory.icon || '',
      color: subcategory.color,
      sortOrder: subcategory.sortOrder
    })
    setSubcategoryDialogOpen(true)
  }

  const handleDeleteSubcategory = (subcategoryId: number) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      deleteSubcategory(subcategoryId)
    }
  }

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        ...categoryForm
      })
    } else {
      createCategory(categoryForm)
    }
    setCategoryDialogOpen(false)
  }

  const handleSaveSubcategory = () => {
    if (editingSubcategory) {
      updateSubcategory({
        id: editingSubcategory.id,
        categoryId: editingSubcategory.categoryId,
        ...subcategoryForm
      })
    } else {
      createSubcategory({
        categoryId: selectedCategoryId!,
        ...subcategoryForm
      })
    }
    setSubcategoryDialogOpen(false)
  }

  if (!user || user.role !== 0) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography variant="h6" color="error">
          Access Denied. Admin privileges required.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full p-6">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2" style={{ color: uiTheme.text }}>
            Categories Management
          </Typography>
          <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
            Manage business categories and subcategories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCategory}
          style={{ backgroundColor: uiTheme.primary }}
        >
          Add Category
        </Button>
      </Box>

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box className="flex justify-center items-center py-8">
          <CircularProgress style={{ color: uiTheme.primary }} />
          <Typography variant="body2" className="ml-2" style={{ color: uiTheme.textSecondary }}>
            Loading categories...
          </Typography>
        </Box>
      )}

      {/* Categories List */}
      {!loading && (
        <Grid container spacing={3}>
          {categoriesWithSubcategories.map((category) => (
            <Grid item xs={12} md={6} lg={4} key={category.id}>
              <Card 
                elevation={2}
                style={{ 
                  backgroundColor: uiTheme.surface,
                  border: `1px solid ${uiTheme.border}`
                }}
              >
                <CardContent>
                  {/* Category Header */}
                  <Box className="flex items-center justify-between mb-3">
                    <Box className="flex items-center gap-2">
                      <Chip
                        label={category.name}
                        style={{
                          backgroundColor: category.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Box className="flex items-center gap-1">
                      <IconButton
                        size="small"
                        onClick={() => handleCreateSubcategory(category.id)}
                        style={{ color: uiTheme.primary }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        style={{ color: uiTheme.primary }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{ color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toggleCategoryExpansion(category.id)}
                        style={{ color: uiTheme.textSecondary }}
                      >
                        {expandedCategories.has(category.id) ? 
                          <ExpandLessIcon fontSize="small" /> : 
                          <ExpandMoreIcon fontSize="small" />
                        }
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Category Description */}
                  {category.description && (
                    <Typography variant="body2" className="mb-3" style={{ color: uiTheme.textSecondary }}>
                      {category.description}
                    </Typography>
                  )}

                  {/* Subcategories */}
                  {expandedCategories.has(category.id) && (
                    <Box className="mt-3">
                      <Typography variant="subtitle2" className="mb-2" style={{ color: uiTheme.text }}>
                        Subcategories ({category.subcategories?.length || 0})
                      </Typography>
                      {category.subcategories?.map((subcategory) => (
                        <Box key={subcategory.id} className="flex items-center justify-between mb-2 p-2 rounded" style={{ backgroundColor: uiTheme.background }}>
                          <Typography variant="body2" style={{ color: uiTheme.text }}>
                            {subcategory.name}
                          </Typography>
                          <Box className="flex items-center gap-1">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSubcategory(subcategory)}
                              style={{ color: uiTheme.primary }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSubcategory(subcategory.id)}
                              style={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: uiTheme.text }}>
          {editingCategory ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Icon"
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
              placeholder="e.g., spa, business, home"
            />
            <TextField
              fullWidth
              label="Color"
              type="color"
              value={categoryForm.color}
              onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
            />
            <TextField
              fullWidth
              label="Sort Order"
              type="number"
              value={categoryForm.sortOrder}
              onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveCategory} 
            variant="contained"
            disabled={!categoryForm.name || creating}
          >
            {creating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onClose={() => setSubcategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: uiTheme.text }}>
          {editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Subcategory Name"
              value={subcategoryForm.name}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={subcategoryForm.description}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Icon"
              value={subcategoryForm.icon}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, icon: e.target.value })}
              placeholder="e.g., spa, business, home"
            />
            <TextField
              fullWidth
              label="Color"
              type="color"
              value={subcategoryForm.color}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, color: e.target.value })}
            />
            <TextField
              fullWidth
              label="Sort Order"
              type="number"
              value={subcategoryForm.sortOrder}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubcategoryDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveSubcategory} 
            variant="contained"
            disabled={!subcategoryForm.name || creating}
          >
            {creating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CategoriesManagement
