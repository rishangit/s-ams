import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import {
  Inventory as ProductIcon,
  Inventory2 as QuantityIcon,
  Warning as WarningIcon,
  PhotoLibrary as ImageIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateProductRowActions,
  isLowStock
} from './utils/productUtils'

interface ProductsCardviewProps {
  filteredProducts: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditProduct: (productId: number) => void
  onDeleteProduct: (productId: number) => void
}

const ProductsCardview: React.FC<ProductsCardviewProps> = ({
  filteredProducts,
  loading,
  error,
  success,
  uiTheme,
  onEditProduct,
  onDeleteProduct
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateProductRowActions(onEditProduct, onDeleteProduct)
  }, [onEditProduct, onDeleteProduct])

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
        {filteredProducts?.map((product) => {
          const lowStock = isLowStock(product.quantity, product.minQuantity)
          const imageCount = product.images?.length || 0 // Future: will show actual image count
          
          return (
            <div key={product.id} className="col-span-1 overflow-visible">
              <Card 
                elevation={0}
                className="h-full flex flex-col relative overflow-visible rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1 group"
                style={{ 
                  backgroundColor: uiTheme.background,
                  border: `1px solid ${uiTheme.border}`,
                  '--hover-border-color': uiTheme.primary,
                  transformOrigin: 'center center',
                  willChange: 'transform, box-shadow'
                } as React.CSSProperties}
              >
                {/* 3-Dot Menu in Top Right Corner */}
                <div 
                  className="absolute top-2 right-2 z-20 rounded-full shadow-md"
                  style={{ 
                    backgroundColor: uiTheme.background,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <RowActionsMenu
                    rowData={product}
                    actions={rowActions}
                    theme={uiTheme}
                  />
                </div>

                {/* Product Image Section */}
                <div
                  className="h-48 relative overflow-hidden rounded-t-xl"
                  style={{
                    backgroundColor: '#f5f5f5',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {/* Show actual product image if available */}
                  {product.images && product.images.length > 0 ? (
                    <>
                      {/* Product image background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                        style={{
                          backgroundImage: `url(${product.images[0]})`
                        }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30" />
                      
                      {/* Image count badge - top left */}
                      <div 
                        className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white shadow-md"
                        style={{ backgroundColor: uiTheme.primary }}
                      >
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                        {imageCount}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Default background when no image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                      
                      {/* Default product icon centered */}
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <ProductIcon 
                          className="text-gray-400" 
                          style={{ fontSize: 64 }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Content Section */}
                <CardContent 
                  className="flex-grow p-5 rounded-t-xl"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {/* Title and Category */}
                  <div className="mb-4">
                    <Typography 
                      variant="h6" 
                      className="font-bold mb-1 leading-tight"
                      style={{ color: uiTheme.text }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="text-sm"
                      style={{ color: uiTheme.textSecondary }}
                    >
                      {product.category || 'No category'} • ${typeof product.unitPrice === 'number' 
                        ? product.unitPrice.toFixed(2) 
                        : parseFloat(product.unitPrice || '0').toFixed(2)
                      }{product.unit && ` / ${product.unit}`}
                    </Typography>
                  </div>

                  {/* Status Chip */}
                  <div className="flex justify-start mb-4">
                    <Chip
                      label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      size="small"
                      className="text-white font-bold text-xs h-6 px-3"
                      style={{
                        backgroundColor: product.status === 'active' ? '#10b981' : 
                                        product.status === 'inactive' ? '#6b7280' : '#ef4444'
                      }}
                    />
                  </div>

                  {/* Additional Info - Simplified */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <QuantityIcon className="w-4 h-4" style={{ color: lowStock ? '#ef4444' : uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: lowStock ? '#ef4444' : uiTheme.textSecondary }}>
                        Qty: {product.quantity}
                        {lowStock && (
                          <>
                            <WarningIcon className="w-3 h-3 inline ml-1" />
                            <span className="ml-1">(Low Stock!)</span>
                          </>
                        )}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProductIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                        Min: {product.minQuantity}
                      </Typography>
                    </div>
                    {product.sku && (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 text-xs font-mono flex items-center justify-center" style={{ color: uiTheme.textSecondary }}>
                          #
                        </span>
                        <Typography variant="body2" className="text-xs font-mono" style={{ color: uiTheme.textSecondary }}>
                          {product.sku}
                        </Typography>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <ProductIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No products found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Try adjusting your filters or add a new product
          </Typography>
        </div>
      )}
    </div>
  )
}

export default ProductsCardview
