import React, { useState, useEffect, memo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory as ProductIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import FormInput from '../../shared/FormInput'
import FormSelect from '../../shared/FormSelect'
import FormButton from '../../shared/FormButton'
import {
  createProductRequest,
  updateProductRequest,
  getProductByIdRequest,
  clearProductsMessages,
  setFormProduct,
  clearFormProduct
} from '../../../store/actions/productsActions'
import { ProductFormData, PRODUCT_CATEGORIES, PRODUCT_UNITS, PRODUCT_STATUS } from '../../../types/product'

// Validation schema
const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(255, 'Product name must be less than 255 characters'),
  description: yup
    .string()
    .optional()
    .max(1000, 'Description must be less than 1000 characters'),
  category: yup
    .string()
    .optional(),
  unit: yup
    .string()
    .optional(),
  unitPrice: yup
    .number()
    .required('Unit price is required')
    .min(0, 'Unit price must be positive')
    .max(999999.99, 'Unit price must be less than 1,000,000'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(0, 'Quantity must be non-negative')
    .integer('Quantity must be a whole number'),
  minQuantity: yup
    .number()
    .required('Minimum quantity is required')
    .min(0, 'Minimum quantity must be non-negative')
    .integer('Minimum quantity must be a whole number'),
  maxQuantity: yup
    .number()
    .optional()
    .min(0, 'Maximum quantity must be non-negative')
    .integer('Maximum quantity must be a whole number')
    .test('max-greater-than-min', 'Maximum quantity must be greater than minimum quantity', function(value) {
      const { minQuantity } = this.parent
      if (value && minQuantity && value <= minQuantity) {
        return false
      }
      return true
    }),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'discontinued'], 'Invalid status'),
  supplier: yup
    .string()
    .optional()
    .max(255, 'Supplier name must be less than 255 characters'),
  sku: yup
    .string()
    .optional()
    .max(100, 'SKU must be less than 100 characters'),
  barcode: yup
    .string()
    .optional()
    .max(100, 'Barcode must be less than 100 characters')
})

interface ProductFormProps {
  isOpen?: boolean
  onClose?: () => void
  productId?: number | null
  onSuccess?: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  isOpen = false, 
  onClose, 
  productId = null,
  onSuccess
}) => {
  const dispatch = useDispatch()
  
  // Determine if this is a modal or standalone form
  const isModal = isOpen !== false
  const isEditProduct = productId && productId !== 0
  
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    currentProduct,
    formProduct,
    error, 
    success, 
    createLoading, 
    updateLoading,
    formLoading
  } = useSelector((state: RootState) => state.products)

  const [isEditMode, setIsEditMode] = useState(false)
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      category: '',
      unit: '',
      unitPrice: 0,
      quantity: 0,
      minQuantity: 0,
      maxQuantity: undefined,
      status: 'active',
      supplier: '',
      sku: '',
      barcode: ''
    }
  })

  // Determine if this is edit mode
  useEffect(() => {
    if (isEditProduct) {
      setIsEditMode(true)
      dispatch(getProductByIdRequest(productId))
    } else {
      setIsEditMode(false)
      dispatch(clearFormProduct())
      reset({
        name: '',
        description: '',
        category: '',
        unit: '',
        unitPrice: 0,
        quantity: 0,
        minQuantity: 0,
        maxQuantity: undefined,
        status: 'active',
        supplier: '',
        sku: '',
        barcode: ''
      })
    }
  }, [isEditProduct, productId, dispatch, reset])

  // Load product data for editing
  useEffect(() => {
    if (isEditMode && formProduct) {
      reset({
        name: formProduct.name,
        description: formProduct.description || '',
        category: formProduct.category || '',
        unit: formProduct.unit || '',
        unitPrice: formProduct.unitPrice,
        quantity: formProduct.quantity,
        minQuantity: formProduct.minQuantity,
        maxQuantity: formProduct.maxQuantity || undefined,
        status: formProduct.status,
        supplier: formProduct.supplier || '',
        sku: formProduct.sku || '',
        barcode: formProduct.barcode || ''
      })
    }
  }, [isEditMode, formProduct, reset])

  // Handle success
  useEffect(() => {
    if (success && !hasHandledSuccess) {
      setHasHandledSuccess(true)
      setTimeout(() => {
        dispatch(clearProductsMessages())
        if (onSuccess) {
          onSuccess()
        }
        if (isModal && onClose) {
          onClose()
        }
        setHasHandledSuccess(false)
      }, 1500)
    }
  }, [success, hasHandledSuccess, dispatch, onSuccess, isModal, onClose])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearProductsMessages())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const onSubmit = (data: ProductFormData) => {
    if (isEditMode && productId) {
      dispatch(updateProductRequest(productId, data))
    } else {
      dispatch(createProductRequest(data))
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    dispatch(clearProductsMessages())
    dispatch(clearFormProduct())
  }

  // Get all categories from different business types
  const getAllCategories = () => {
    const allCategories = new Set<string>()
    Object.values(PRODUCT_CATEGORIES).forEach(categories => {
      categories.forEach(category => allCategories.add(category))
    })
    return Array.from(allCategories).sort()
  }

  const categoryOptions = getAllCategories().map(category => ({
    value: category,
    label: category
  }))

  const unitOptions = PRODUCT_UNITS.map(unit => ({
    value: unit,
    label: unit.charAt(0).toUpperCase() + unit.slice(1)
  }))

  const statusOptions = Object.entries(PRODUCT_STATUS).map(([key, value]) => ({
    value: value,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
  }))

  const formContent = (
    <Box className="p-6">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="name"
              control={control}
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name?.message}
              required
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <FormSelect
              name="category"
              control={control}
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              error={errors.category?.message}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <FormInput
              name="description"
              control={control}
              label="Description"
              placeholder="Enter product description"
              multiline
              rows={3}
              error={errors.description?.message}
            />
          </Grid>

          {/* Unit */}
          <Grid item xs={12} md={4}>
            <FormSelect
              name="unit"
              control={control}
              label="Unit"
              placeholder="Select unit"
              options={unitOptions}
              error={errors.unit?.message}
            />
          </Grid>

          {/* Unit Price */}
          <Grid item xs={12} md={4}>
            <FormInput
              name="unitPrice"
              control={control}
              label="Unit Price"
              placeholder="0.00"
              type="number"
              step="0.01"
              error={errors.unitPrice?.message}
              required
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={4}>
            <FormSelect
              name="status"
              control={control}
              label="Status"
              placeholder="Select status"
              options={statusOptions}
              error={errors.status?.message}
              required
            />
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} md={4}>
            <FormInput
              name="quantity"
              control={control}
              label="Current Quantity"
              placeholder="0"
              type="number"
              error={errors.quantity?.message}
              required
            />
          </Grid>

          {/* Min Quantity */}
          <Grid item xs={12} md={4}>
            <FormInput
              name="minQuantity"
              control={control}
              label="Minimum Quantity"
              placeholder="0"
              type="number"
              error={errors.minQuantity?.message}
              required
            />
          </Grid>

          {/* Max Quantity */}
          <Grid item xs={12} md={4}>
            <FormInput
              name="maxQuantity"
              control={control}
              label="Maximum Quantity"
              placeholder="Optional"
              type="number"
              error={errors.maxQuantity?.message}
            />
          </Grid>

          {/* Supplier */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="supplier"
              control={control}
              label="Supplier"
              placeholder="Enter supplier name"
              error={errors.supplier?.message}
            />
          </Grid>

          {/* SKU */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="sku"
              control={control}
              label="SKU"
              placeholder="Enter SKU"
              error={errors.sku?.message}
            />
          </Grid>

          {/* Barcode */}
          <Grid item xs={12}>
            <FormInput
              name="barcode"
              control={control}
              label="Barcode"
              placeholder="Enter barcode"
              error={errors.barcode?.message}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box className="flex gap-3 justify-end">
              <FormButton
                type="button"
                variant="outlined"
                onClick={handleClose}
                startIcon={<CancelIcon />}
                disabled={createLoading || updateLoading}
              >
                Cancel
              </FormButton>
              <FormButton
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                loading={createLoading || updateLoading}
                disabled={!isDirty && isEditMode}
              >
                {isEditMode ? 'Update Product' : 'Create Product'}
              </FormButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )

  if (isModal) {
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
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
          <Box className="flex items-center gap-2">
            <ProductIcon />
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {formLoading ? (
            <Box className="flex justify-center items-center py-8">
              <CircularProgress style={{ color: uiTheme.primary }} />
            </Box>
          ) : (
            formContent
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Box className="h-full flex flex-col">
      <Box className="mb-6">
        <Typography 
          variant="h4" 
          className="font-bold mb-2"
          style={{ color: uiTheme.text }}
        >
          <Box className="flex items-center gap-2">
            <ProductIcon />
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Box>
        </Typography>
        <Typography 
          variant="body1"
          style={{ color: uiTheme.textSecondary }}
        >
          {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
        </Typography>
      </Box>

      {formLoading ? (
        <Box className="flex justify-center items-center py-8">
          <CircularProgress style={{ color: uiTheme.primary }} />
        </Box>
      ) : (
        formContent
      )}
    </Box>
  )
}

export default memo(ProductForm)
