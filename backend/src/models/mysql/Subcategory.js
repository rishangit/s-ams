import { executeQuery } from '../../database/mysql/database.js'

export class Subcategory {
  static tableName = 'subcategories'

  static async create(subcategoryData) {
    const { categoryId, name, description, icon, color, sortOrder } = subcategoryData
    
    const query = `
      INSERT INTO ${this.tableName} (category_id, name, description, icon, color, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    
    try {
      const result = await executeQuery(query, [categoryId, name, description, icon, color, sortOrder])
      return await this.findById(result.insertId)
    } catch (error) {
      console.error('Error creating subcategory:', error)
      throw new Error('Failed to create subcategory')
    }
  }

  static async findById(id) {
    const query = `
      SELECT s.*, c.name as category_name
      FROM ${this.tableName} s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ? AND s.is_active = TRUE AND c.is_active = TRUE
    `
    
    try {
      const results = await executeQuery(query, [id])
      return results.length > 0 ? results[0] : null
    } catch (error) {
      console.error('Error finding subcategory by ID:', error)
      throw new Error('Failed to find subcategory')
    }
  }

  static async findByCategoryId(categoryId) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE category_id = ? AND is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `
    
    try {
      const results = await executeQuery(query, [categoryId])
      return results
    } catch (error) {
      console.error('Error finding subcategories by category ID:', error)
      throw new Error('Failed to find subcategories')
    }
  }

  static async findAll(options = {}) {
    let query = `
      SELECT s.*, c.name as category_name
      FROM ${this.tableName} s
      JOIN categories c ON s.category_id = c.id
      WHERE s.is_active = TRUE AND c.is_active = TRUE
    `
    
    const params = []
    
    if (options.categoryId) {
      query += ` AND s.category_id = ?`
      params.push(options.categoryId)
    }
    
    if (options.search) {
      query += ` AND (s.name LIKE ? OR s.description LIKE ?)`
      params.push(`%${options.search}%`, `%${options.search}%`)
    }
    
    query += ` ORDER BY c.sort_order ASC, c.name ASC, s.sort_order ASC, s.name ASC`
    
    if (options.limit) {
      query += ` LIMIT ?`
      params.push(options.limit)
      
      if (options.offset) {
        query += ` OFFSET ?`
        params.push(options.offset)
      }
    }
    
    try {
      const results = await executeQuery(query, params)
      return results
    } catch (error) {
      console.error('Error finding subcategories:', error)
      throw new Error('Failed to find subcategories')
    }
  }

  static async update(id, subcategoryData) {
    const { categoryId, name, description, icon, color, sortOrder, isActive } = subcategoryData
    
    const query = `
      UPDATE ${this.tableName} 
      SET category_id = ?, name = ?, description = ?, icon = ?, color = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [categoryId, name, description, icon, color, sortOrder, isActive, id])
      if (result.affectedRows === 0) {
        throw new Error('Subcategory not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating subcategory:', error)
      throw new Error('Failed to update subcategory')
    }
  }

  static async delete(id) {
    const query = `
      UPDATE ${this.tableName} 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('Subcategory not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      throw new Error('Failed to delete subcategory')
    }
  }

  static async existsByCategoryAndName(categoryId, name, excludeId = null) {
    let query = `
      SELECT COUNT(*) as count FROM ${this.tableName} 
      WHERE category_id = ? AND name = ? AND is_active = TRUE
    `
    const params = [categoryId, name]
    
    if (excludeId) {
      query += ` AND id != ?`
      params.push(excludeId)
    }
    
    try {
      const results = await executeQuery(query, params)
      return results[0].count > 0
    } catch (error) {
      console.error('Error checking subcategory existence:', error)
      throw new Error('Failed to check subcategory existence')
    }
  }
}
