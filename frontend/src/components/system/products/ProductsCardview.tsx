import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Stack
} from '@mui/material'
import {
  Inventory as ProductIcon,
  AttachMoney as PriceIcon,
  Inventory2 as QuantityIcon,
  Warning as WarningIcon,
  Business as SupplierIcon,
  QrCode as SKUIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  ProductInfo, 
  ProductStatusChip
} from './utils/productComponents'
import { 
  generateProductRowActions,
  isLowStock
} from './utils/productUtils'

interface ProductsCardviewProps {
  filteredProducts: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditProduct: (productId: number) => void
  onDeleteProduct: (productId: number) => void
}

const ProductsCardview: React.FC<ProductsCardviewProps> = ({
  filteredProducts,
  loading,
  error,
  success,
  theme,
  onEditProduct,
  onDeleteProduct
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateProductRowActions(onEditProduct, onDeleteProduct)
  }, [onEditProduct, onDeleteProduct])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        {success}
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {filteredProducts?.map((product) => {
          const lowStock = isLowStock(product.quantity, product.minQuantity)
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={product.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                    borderColor: theme.primary
                  }
                }}
              >
                {/* 3-Dot Menu in Top Right Corner */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    zIndex: 1,
                    backgroundColor: theme.background,
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <RowActionsMenu
                    rowData={product}
                    actions={rowActions}
                    theme={theme}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3, pt: 4 }}>
                  {/* Header with Product Info and Status */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1, pr: 1 }}>
                      <ProductInfo product={product} />
                    </Box>
                    <ProductStatusChip status={product.status} />
                  </Box>

                  {/* Price Section */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #dcfce7',
                      borderRadius: 2,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PriceIcon sx={{ color: '#10b981', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                        ${typeof product.unitPrice === 'number' 
                          ? product.unitPrice.toFixed(2) 
                          : parseFloat(product.unitPrice || '0').toFixed(2)
                        }
                        {product.unit && (
                          <Typography component="span" variant="body2" sx={{ ml: 1, color: '#10b981' }}>
                            / {product.unit}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Quantity Section */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: lowStock ? '#fef2f2' : '#f0f9ff',
                      border: lowStock ? '1px solid #fecaca' : '1px solid #e0f2fe',
                      borderRadius: 2,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <QuantityIcon sx={{ color: lowStock ? '#ef4444' : '#0ea5e9', fontSize: 20 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: '600', 
                          color: lowStock ? '#ef4444' : '#0ea5e9'
                        }}
                      >
                        Quantity: {product.quantity}
                        {lowStock && (
                          <>
                            <WarningIcon sx={{ color: '#ef4444', fontSize: 16, ml: 1 }} />
                            <Typography component="span" variant="body2" sx={{ ml: 1, color: '#ef4444' }}>
                              (Low Stock!)
                            </Typography>
                          </>
                        )}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                      Min: {product.minQuantity}
                    </Typography>
                  </Paper>

                  {/* Supplier and SKU Section */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: `${theme.primary}08`,
                      border: `1px solid ${theme.primary}20`,
                      borderRadius: 2,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <Stack spacing={1.5}>
                      {product.supplier && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <SupplierIcon sx={{ color: theme.primary, fontSize: 20 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: '600', 
                              color: theme.text,
                              wordBreak: 'break-word'
                            }}
                          >
                            {product.supplier}
                          </Typography>
                        </Box>
                      )}
                      {product.sku && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <SKUIcon sx={{ color: theme.primary, fontSize: 20 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: '600', 
                              color: theme.text,
                              fontFamily: 'monospace',
                              fontSize: '0.75rem'
                            }}
                          >
                            {product.sku}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {filteredProducts?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            backgroundColor: `${theme.primary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <ProductIcon sx={{ fontSize: 40, color: theme.primary }} />
          </Box>
          <Typography variant="h6" sx={{ color: theme.text, mb: 1, fontWeight: '600' }}>
            No products found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Try adjusting your filters or add a new product
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ProductsCardview
