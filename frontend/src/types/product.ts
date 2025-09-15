export interface Product {
  id: number
  name: string
  description?: string
  category?: string
  unit?: string
  unitPrice: number
  quantity: number
  minQuantity: number
  maxQuantity?: number
  status: 'active' | 'inactive' | 'discontinued'
  supplier?: string
  sku?: string
  barcode?: string
  companyId: number
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  description?: string
  category?: string
  unit?: string
  unitPrice: number
  quantity: number
  minQuantity: number
  maxQuantity?: number
  status: 'active' | 'inactive' | 'discontinued'
  supplier?: string
  sku?: string
  barcode?: string
}

export interface ProductFilters {
  status?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  discontinued: number
  lowStock: number
  outOfStock: number
}

export interface ServiceProduct {
  id: number
  serviceId: number
  productId: number
  quantityRequired: number
  product?: Product
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  name: string
  count: number
}

// Common product categories for different business types
export const PRODUCT_CATEGORIES = {
  SALON: [
    'Shampoo & Conditioner',
    'Hair Styling Products',
    'Hair Color',
    'Hair Treatments',
    'Tools & Equipment',
    'Sanitizers & Disinfectants',
    'Towels & Linens',
    'Accessories'
  ],
  CLINIC: [
    'Medications',
    'Medical Supplies',
    'Diagnostic Equipment',
    'Surgical Instruments',
    'Disinfectants',
    'Bandages & Dressings',
    'Personal Protective Equipment',
    'Office Supplies'
  ],
  CAR_SERVICE: [
    'Engine Oil',
    'Brake Fluid',
    'Coolant',
    'Transmission Fluid',
    'Air Filters',
    'Oil Filters',
    'Spark Plugs',
    'Belts & Hoses',
    'Cleaning Products',
    'Tools & Equipment'
  ],
  GENERAL: [
    'Office Supplies',
    'Cleaning Products',
    'Maintenance Items',
    'Safety Equipment',
    'Tools',
    'Consumables',
    'Electronics',
    'Furniture'
  ]
}

// Common units for products
export const PRODUCT_UNITS = [
  'piece',
  'kg',
  'g',
  'lb',
  'oz',
  'liter',
  'ml',
  'gallon',
  'box',
  'pack',
  'roll',
  'sheet',
  'bottle',
  'tube',
  'jar',
  'can',
  'bag',
  'set',
  'pair',
  'dozen'
]

// Product status options
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued'
} as const

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS]
