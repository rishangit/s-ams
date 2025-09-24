import { executeQuery } from '../../database/mysql/database.js'

export class Category {
  static tableName = 'categories'

  static async create(categoryData) {
    const { name, description, icon, color, sortOrder } = categoryData
    
    const query = `
      INSERT INTO ${this.tableName} (name, description, icon, color, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `
    
    try {
      const result = await executeQuery(query, [name, description, icon, color, sortOrder])
      return await this.findById(result.insertId)
    } catch (error) {
      console.error('Error creating category:', error)
      throw new Error('Failed to create category')
    }
  }

  static async findById(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE id = ? AND is_active = TRUE
    `
    
    try {
      const results = await executeQuery(query, [id])
      return results.length > 0 ? results[0] : null
    } catch (error) {
      console.error('Error finding category by ID:', error)
      throw new Error('Failed to find category')
    }
  }

  static async findAll(options = {}) {
    let query = `
      SELECT c.*, 
             COUNT(s.id) as subcategory_count
      FROM ${this.tableName} c
      LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = TRUE
      WHERE c.is_active = TRUE
    `
    
    const params = []
    
    if (options.search) {
      query += ` AND (c.name LIKE ? OR c.description LIKE ?)`
      params.push(`%${options.search}%`, `%${options.search}%`)
    }
    
    query += ` GROUP BY c.id ORDER BY c.sort_order ASC, c.name ASC`
    
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
      console.error('Error finding categories:', error)
      throw new Error('Failed to find categories')
    }
  }

  static async update(id, categoryData) {
    const { name, description, icon, color, sortOrder, isActive } = categoryData
    
    const query = `
      UPDATE ${this.tableName} 
      SET name = ?, description = ?, icon = ?, color = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [name, description, icon, color, sortOrder, isActive, id])
      if (result.affectedRows === 0) {
        throw new Error('Category not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating category:', error)
      throw new Error('Failed to update category')
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
        throw new Error('Category not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw new Error('Failed to delete category')
    }
  }

  static async getWithSubcategories(id) {
    const query = `
      SELECT c.*, 
             s.id as subcategory_id,
             s.name as subcategory_name,
             s.description as subcategory_description,
             s.icon as subcategory_icon,
             s.color as subcategory_color,
             s.sort_order as subcategory_sort_order
      FROM ${this.tableName} c
      LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = TRUE
      WHERE c.id = ? AND c.is_active = TRUE
      ORDER BY s.sort_order ASC, s.name ASC
    `
    
    try {
      const results = await executeQuery(query, [id])
      if (results.length === 0) {
        return null
      }
      
      const category = {
        id: results[0].id,
        name: results[0].name,
        description: results[0].description,
        icon: results[0].icon,
        color: results[0].color,
        sortOrder: results[0].sort_order,
        createdAt: results[0].created_at,
        updatedAt: results[0].updated_at,
        subcategories: []
      }
      
      results.forEach(row => {
        if (row.subcategory_id) {
          category.subcategories.push({
            id: row.subcategory_id,
            name: row.subcategory_name,
            description: row.subcategory_description,
            icon: row.subcategory_icon,
            color: row.subcategory_color,
            sortOrder: row.subcategory_sort_order
          })
        }
      })
      
      return category
    } catch (error) {
      console.error('Error getting category with subcategories:', error)
      throw new Error('Failed to get category with subcategories')
    }
  }

  static async getAllWithSubcategories() {
    const query = `
      SELECT c.id as category_id,
             c.name as category_name,
             c.description as category_description,
             c.icon as category_icon,
             c.color as category_color,
             c.sort_order as category_sort_order,
             s.id as subcategory_id,
             s.name as subcategory_name,
             s.description as subcategory_description,
             s.icon as subcategory_icon,
             s.color as subcategory_color,
             s.sort_order as subcategory_sort_order
      FROM ${this.tableName} c
      LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = TRUE
      WHERE c.is_active = TRUE
      ORDER BY c.sort_order ASC, c.name ASC, s.sort_order ASC, s.name ASC
    `
    
    try {
      const results = await executeQuery(query)
      const categoriesMap = new Map()
      
      results.forEach(row => {
        if (!categoriesMap.has(row.category_id)) {
          categoriesMap.set(row.category_id, {
            id: row.category_id,
            name: row.category_name,
            description: row.category_description,
            icon: row.category_icon,
            color: row.category_color,
            sortOrder: row.category_sort_order,
            subcategories: []
          })
        }
        
        if (row.subcategory_id) {
          categoriesMap.get(row.category_id).subcategories.push({
            id: row.subcategory_id,
            name: row.subcategory_name,
            description: row.subcategory_description,
            icon: row.subcategory_icon,
            color: row.subcategory_color,
            sortOrder: row.subcategory_sort_order
          })
        }
      })
      
      return Array.from(categoriesMap.values())
    } catch (error) {
      console.error('Error getting all categories with subcategories:', error)
      throw new Error('Failed to get all categories with subcategories')
    }
  }
}
