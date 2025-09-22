import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ViewMode } from '../../shared'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../shared/ViewModeSelector'
import ProductForm from './ProductForm'
import ProductsGridview from './ProductsGridview'
import ProductsListview from './ProductsListview'
import ProductsCardview from './ProductsCardview'
import {
  getProductsRequest,
  deleteProductRequest,
  clearProductsMessages
} from '../../../store/actions/productsActions'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'
import { useTheme } from '../../../hooks/useTheme'
import { Add, Inventory as ProductIcon } from '@mui/icons-material'
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, useMediaQuery } from '@mui/material'

const Products: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { products, loading, error, success } = useSelector((state: RootState) => state.products)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const { theme: uiTheme } = useTheme()
  const { productsView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)

  // Load products when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 1) {
      dispatch(getProductsRequest())
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user?.role, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    // Only update if settings are loaded and user hasn't manually selected a view
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('Products: Setting view mode from settings:', productsView)
      setViewMode(productsView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, productsView, userSelectedView, settingsLoaded])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view and no saved settings)
  useEffect(() => {
    if (!userSelectedView && !settings) {
      if (isMobile && viewMode !== 'card') {
        console.log('Products: Auto-switching to card view for mobile')
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        console.log('Products: Auto-switching to grid view for desktop')
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView, settings])

  // Reset user selection when screen size changes significantly (only if no saved settings)
  useEffect(() => {
    if (!settings) {
      setUserSelectedView(false)
    }
  }, [isMobile, settings])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearProductsMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductRequest(productId))
    }
  }

  const handleEditProduct = (productId: number) => {
    setEditingProductId(productId)
    setIsEditModalOpen(true)
  }

  const handleAddProduct = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModals = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setEditingProductId(null)
  }



  // Get all products
  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products
  }, [products])


  // Show loading while user is being loaded
  if (!user) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: uiTheme.text }}
        >
          Loading user data...
        </Typography>
      </Box>
    )
  }

  // Show access denied if user is not a company owner
  if (parseInt(String(user.role)) !== 1) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: uiTheme.text }}
        >
          Access denied. This page is only available for company owners.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="flex flex-col h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
        <ProductIcon style={{ color: uiTheme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: uiTheme.text }}
        >
          Products Management
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6 flex-shrink-0">
        <Box className="flex flex-row items-center gap-4">
          {/* View Mode Selector */}
          <ViewModeSelector
            section="products"
            currentView={viewMode}
            onViewChange={(newView) => {
              setViewMode(newView as ViewMode)
              setUserSelectedView(true)
            }}
          />

          {/* Add Button */}
          <Button
            variant="contained"
            onClick={handleAddProduct}
            style={{ backgroundColor: uiTheme.primary, color: '#ffffff' }}
            startIcon={<Add />}
            className="w-auto"
          >
            <span>Add Product</span>
          </Button>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      <Box className="flex-1 min-h-0">
        {viewMode === 'grid' ? (
        <ProductsGridview
          filteredProducts={filteredProducts || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : viewMode === 'list' ? (
        <ProductsListview
          filteredProducts={filteredProducts || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : (
        <ProductsCardview
          filteredProducts={filteredProducts || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
        )}
      </Box>

      {/* Add Product Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: uiTheme.surface,
            color: uiTheme.text
          }
        }}
      >
        <DialogTitle style={{ color: uiTheme.text }}>
          Add New Product
        </DialogTitle>
        <DialogContent>
          <ProductForm
            isOpen={isAddModalOpen}
            onClose={handleCloseModals}
            productId={null}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getProductsRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: uiTheme.surface,
            color: uiTheme.text
          }
        }}
      >
        <DialogTitle style={{ color: uiTheme.text }}>
          Edit Product
        </DialogTitle>
        <DialogContent>
          <ProductForm
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            productId={editingProductId}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getProductsRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Products
