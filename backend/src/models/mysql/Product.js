import { executeQuery } from '../../database/mysql/database.js'

export class Product {
  static tableName = 'products'

  static async create(productData) {
    const { 
      name, 
      description, 
      category, 
      unit, 
      unitPrice, 
      quantity, 
      minQuantity, 
      maxQuantity, 
      status, 
      companyId,
      supplier,
      sku,
      barcode
    } = productData
    
    const query = `
      INSERT INTO ${this.tableName} 
      (name, description, category, unit, unit_price, quantity, min_quantity, max_quantity, 
       status, company_id, supplier, sku, barcode, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    
    const values = [
      name, 
      description || null, 
      category || null, 
      unit || null, 
      unitPrice, 
      quantity || 0, 
      minQuantity || 0, 
      maxQuantity || null, 
      status || 'active', 
      companyId,
      supplier || null,
      sku || null,
      barcode || null
    ]
    
    try {
      const result = await executeQuery(query, values)
      return { id: result.insertId, ...productData, status: status || 'active' }
    } catch (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        id, name, description, category, unit, unit_price as unitPrice, 
        quantity, min_quantity as minQuantity, max_quantity as maxQuantity,
        status, company_id as companyId, supplier, sku, barcode,
        created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE id = ?
    `
    
    try {
      const rows = await executeQuery(query, [id])
      if (!rows[0]) return null
      
      const row = rows[0]
      // Convert numeric fields from strings to numbers
      return {
        ...row,
        unitPrice: parseFloat(row.unitPrice),
        quantity: parseInt(row.quantity),
        minQuantity: parseInt(row.minQuantity),
        maxQuantity: row.maxQuantity ? parseInt(row.maxQuantity) : null
      }
    } catch (error) {
      console.error('Error finding product by ID:', error)
      throw new Error('Failed to find product')
    }
  }

  static async findByCompanyId(companyId) {
    const query = `
      SELECT 
        id, name, description, category, unit, unit_price as unitPrice, 
        quantity, min_quantity as minQuantity, max_quantity as maxQuantity,
        status, company_id as companyId, supplier, sku, barcode,
        created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE company_id = ?
      ORDER BY created_at DESC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      // Convert numeric fields from strings to numbers
      return rows.map(row => ({
        ...row,
        unitPrice: parseFloat(row.unitPrice),
        quantity: parseInt(row.quantity),
        minQuantity: parseInt(row.minQuantity),
        maxQuantity: row.maxQuantity ? parseInt(row.maxQuantity) : null
      }))
    } catch (error) {
      console.error('Error finding products by company ID:', error)
      throw new Error('Failed to find products')
    }
  }

  static async findByCategory(companyId, category) {
    const query = `
      SELECT 
        id, name, description, category, unit, unit_price as unitPrice, 
        quantity, min_quantity as minQuantity, max_quantity as maxQuantity,
        status, company_id as companyId, supplier, sku, barcode,
        created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE company_id = ? AND category = ?
      ORDER BY name ASC
    `
    
    try {
      const rows = await executeQuery(query, [companyId, category])
      return rows
    } catch (error) {
      console.error('Error finding products by category:', error)
      throw new Error('Failed to find products by category')
    }
  }

  static async update(id, productData) {
    const { 
      name, 
      description, 
      category, 
      unit, 
      unitPrice, 
      quantity, 
      minQuantity, 
      maxQuantity, 
      status,
      supplier,
      sku,
      barcode
    } = productData
    
    const query = `
      UPDATE ${this.tableName} 
      SET name = ?, description = ?, category = ?, unit = ?, 
          unit_price = ?, quantity = ?, min_quantity = ?, max_quantity = ?, 
          status = ?, supplier = ?, sku = ?, barcode = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const values = [
      name, 
      description || null, 
      category || null, 
      unit || null, 
      unitPrice, 
      quantity, 
      minQuantity || 0, 
      maxQuantity || null, 
      status, 
      supplier || null,
      sku || null,
      barcode || null,
      id
    ]
    
    try {
      const result = await executeQuery(query, values)
      if (result.affectedRows === 0) {
        throw new Error('Product not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }
  }

  static async updateQuantity(id, quantity) {
    const query = `
      UPDATE ${this.tableName} 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [quantity, id])
      if (result.affectedRows === 0) {
        throw new Error('Product not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating product quantity:', error)
      throw new Error('Failed to update product quantity')
    }
  }

  static async updateStatus(id, status) {
    const validStatuses = ['active', 'inactive', 'discontinued']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }
    
    const query = `
      UPDATE ${this.tableName} 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [status, id])
      if (result.affectedRows === 0) {
        throw new Error('Product not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating product status:', error)
      throw new Error('Failed to update product status')
    }
  }

  static async findAll(options = {}) {
    let query = `
      SELECT 
        p.id, p.name, p.description, p.category, p.unit, p.unit_price as unitPrice, 
        p.quantity, p.min_quantity as minQuantity, p.max_quantity as maxQuantity,
        p.status, p.company_id as companyId, p.supplier, p.sku, p.barcode,
        p.created_at as createdAt, p.updated_at as updatedAt,
        c.name as companyName
      FROM ${this.tableName} p
      LEFT JOIN companies c ON p.company_id = c.id
    `
    
    const values = []
    
    // Add company filter
    if (options.companyId) {
      query += ' WHERE p.company_id = ?'
      values.push(options.companyId)
    }
    
    // Add status filter
    if (options.status) {
      query += options.companyId ? ' AND p.status = ?' : ' WHERE p.status = ?'
      values.push(options.status)
    }
    
    // Add category filter
    if (options.category) {
      query += (options.companyId || options.status) ? ' AND p.category = ?' : ' WHERE p.category = ?'
      values.push(options.category)
    }
    
    // Add search filter
    if (options.search) {
      const searchCondition = ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      query += (options.companyId || options.status || options.category) ? searchCondition : ' WHERE (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      const searchTerm = `%${options.search}%`
      values.push(searchTerm, searchTerm, searchTerm)
    }
    
    // Add ordering
    query += ' ORDER BY p.created_at DESC'
    
    // Add pagination
    if (options.limit) {
      query += ' LIMIT ?'
      values.push(String(options.limit))
      
      if (options.offset) {
        query += ' OFFSET ?'
        values.push(String(options.offset))
      }
    }
    
    try {
      const rows = await executeQuery(query, values)
      // Convert numeric fields from strings to numbers
      return rows.map(row => ({
        ...row,
        unitPrice: parseFloat(row.unitPrice),
        quantity: parseInt(row.quantity),
        minQuantity: parseInt(row.minQuantity),
        maxQuantity: row.maxQuantity ? parseInt(row.maxQuantity) : null
      }))
    } catch (error) {
      console.error('Error finding all products:', error)
      throw new Error('Failed to find products')
    }
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('Product not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }

  static async getLowStockProducts(companyId) {
    const query = `
      SELECT 
        id, name, description, category, unit, unit_price as unitPrice, 
        quantity, min_quantity as minQuantity, max_quantity as maxQuantity,
        status, company_id as companyId, supplier, sku, barcode,
        created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE company_id = ? AND quantity <= min_quantity AND status = 'active'
      ORDER BY quantity ASC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      // Convert numeric fields from strings to numbers
      return rows.map(row => ({
        ...row,
        unitPrice: parseFloat(row.unitPrice),
        quantity: parseInt(row.quantity),
        minQuantity: parseInt(row.minQuantity),
        maxQuantity: row.maxQuantity ? parseInt(row.maxQuantity) : null
      }))
    } catch (error) {
      console.error('Error finding low stock products:', error)
      throw new Error('Failed to find low stock products')
    }
  }

  static async getCategories(companyId) {
    const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE company_id = ? AND category IS NOT NULL AND category != ''
      ORDER BY category ASC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows.map(row => row.category)
    } catch (error) {
      console.error('Error finding product categories:', error)
      throw new Error('Failed to find product categories')
    }
  }

  static async existsByCompanyId(companyId) {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE company_id = ?`
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows[0].count > 0
    } catch (error) {
      console.error('Error checking product existence:', error)
      throw new Error('Failed to check product existence')
    }
  }

  static async findByCompanyIds(options = {}) {
    let query = `
      SELECT 
        p.id, p.name, p.description, p.category, p.unit, p.unit_price as unitPrice, 
        p.quantity, p.min_quantity as minQuantity, p.max_quantity as maxQuantity,
        p.status, p.company_id as companyId, p.supplier, p.sku, p.barcode,
        p.created_at as createdAt, p.updated_at as updatedAt,
        c.name as companyName
      FROM ${this.tableName} p
      LEFT JOIN companies c ON p.company_id = c.id
    `
    
    const values = []
    
    // Add company filter for multiple company IDs
    if (options.companyIds && options.companyIds.length > 0) {
      const placeholders = options.companyIds.map(() => '?').join(',')
      query += ` WHERE p.company_id IN (${placeholders})`
      values.push(...options.companyIds)
    }
    
    // Add status filter
    if (options.status) {
      query += options.companyIds && options.companyIds.length > 0 ? ' AND p.status = ?' : ' WHERE p.status = ?'
      values.push(options.status)
    }
    
    // Add category filter
    if (options.category) {
      query += (options.companyIds && options.companyIds.length > 0 || options.status) ? ' AND p.category = ?' : ' WHERE p.category = ?'
      values.push(options.category)
    }
    
    // Add search filter
    if (options.search) {
      const searchCondition = ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      query += (options.companyIds && options.companyIds.length > 0 || options.status || options.category) ? searchCondition : ' WHERE (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      const searchTerm = `%${options.search}%`
      values.push(searchTerm, searchTerm, searchTerm)
    }
    
    // Add ordering
    query += ' ORDER BY p.created_at DESC'
    
    // Add pagination
    if (options.limit) {
      query += ' LIMIT ?'
      values.push(String(options.limit))
      
      if (options.offset) {
        query += ' OFFSET ?'
        values.push(String(options.offset))
      }
    }
    
    try {
      const rows = await executeQuery(query, values)
      // Convert numeric fields from strings to numbers
      return rows.map(row => ({
        ...row,
        unitPrice: parseFloat(row.unitPrice),
        quantity: parseInt(row.quantity),
        minQuantity: parseInt(row.minQuantity),
        maxQuantity: row.maxQuantity ? parseInt(row.maxQuantity) : null
      }))
    } catch (error) {
      console.error('Error finding products by company IDs:', error)
      throw new Error('Failed to find products')
    }
  }
}
