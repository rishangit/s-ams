import {
  Box,
  Typography,
  Chip
} from '@mui/material'
import {
  Inventory as ProductIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Inventory2 as QuantityIcon,
  Warning as WarningIcon,
  Business as SupplierIcon,
  QrCode as SKUIcon
} from '@mui/icons-material'
import { 
  getProductStatusColor, 
  getProductStatusDisplayName, 
  formatProductPrice, 
  isLowStock,
  formatCategory,
  formatSupplier,
  formatSKU
} from './productUtils'

// Product Info Component (for cards)
export const ProductInfo = ({ 
  product 
}: { 
  product: any
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
      <ProductIcon sx={{ color: '#6366f1', fontSize: 24 }} />
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {product.name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#666' }}>
        {formatCategory(product.category)}
      </Typography>
    </Box>
  </Box>
)

// Product Name Component
export const ProductName = ({ 
  name, 
  category, 
  variant = 'h6' 
}: { 
  name: string
  category?: string
  variant?: 'h6' | 'body2'
}) => (
  <Box>
    <Typography variant={variant} sx={{ fontWeight: 'bold' }}>
      {name}
    </Typography>
    <Typography variant="caption" sx={{ color: '#666' }}>
      {formatCategory(category)}
    </Typography>
  </Box>
)

// Product Category Component
export const ProductCategory = ({ category }: { category?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CategoryIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {formatCategory(category)}
    </Typography>
  </Box>
)

// Product Price Component
export const ProductPrice = ({ 
  price, 
  unit, 
  variant = 'body2' 
}: { 
  price: string | number
  unit?: string
  variant?: 'h6' | 'body2'
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PriceIcon sx={{ color: '#10b981', fontSize: 16 }} />
    <Typography 
      variant={variant} 
      sx={{ 
        fontWeight: 'bold', 
        color: '#10b981' 
      }}
    >
      {formatProductPrice(price, unit)}
    </Typography>
  </Box>
)

// Product Quantity Component
export const ProductQuantity = ({ 
  quantity, 
  minQuantity 
}: { 
  quantity: number
  minQuantity: number
}) => {
  const lowStock = isLowStock(quantity, minQuantity)
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <QuantityIcon sx={{ color: lowStock ? '#ef4444' : '#666', fontSize: 16 }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: lowStock ? '#ef4444' : '#666',
          fontWeight: lowStock ? 'bold' : 'normal'
        }}
      >
        {quantity}
      </Typography>
      {lowStock && (
        <WarningIcon sx={{ color: '#ef4444', fontSize: 16 }} />
      )}
    </Box>
  )
}

// Product Supplier Component
export const ProductSupplier = ({ supplier }: { supplier?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <SupplierIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#666',
        maxWidth: 150,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {formatSupplier(supplier)}
    </Typography>
  </Box>
)

// Product SKU Component
export const ProductSKU = ({ sku }: { sku?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <SKUIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#666',
        fontFamily: 'monospace',
        fontSize: '0.75rem'
      }}
    >
      {formatSKU(sku)}
    </Typography>
  </Box>
)

// Product Status Chip Component
export const ProductStatusChip = ({ status }: { status: string }) => {
  const statusColor = getProductStatusColor(status)
  const statusDisplayName = getProductStatusDisplayName(status)

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
