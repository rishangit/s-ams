import { getDatabase } from '../../database/sqlite/database.js'

export class Service {
  static tableName = 'services'

  static async create(serviceData) {
    const { name, description, duration, price, status, companyId } = serviceData
    const db = getDatabase()
    
    const query = `
      INSERT INTO ${this.tableName} 
      (name, description, duration, price, status, company_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `
    
    const values = [name, description, duration, price, status, companyId]
    
    try {
      const result = await db.run(query, values)
      return { id: result.lastID, ...serviceData, status: status || 'active' }
    } catch (error) {
      console.error('Error creating service:', error)
      throw new Error('Failed to create service')
    }
  }

  static async findById(id) {
    const db = getDatabase()
    const query = `
      SELECT 
        id, name, description, duration, price, status, 
        company_id as companyId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE id = ?
    `
    
    try {
      const row = await db.get(query, [id])
      return row || null
    } catch (error) {
      console.error('Error finding service by ID:', error)
      throw new Error('Failed to find service')
    }
  }

  static async findByCompanyId(companyId) {
    const db = getDatabase()
    const query = `
      SELECT 
        id, name, description, duration, price, status, 
        company_id as companyId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE company_id = ?
      ORDER BY created_at DESC
    `
    
    try {
      const rows = await db.all(query, [companyId])
      return rows
    } catch (error) {
      console.error('Error finding services by company ID:', error)
      throw new Error('Failed to find services')
    }
  }

  static async update(id, serviceData) {
    const { name, description, duration, price, status } = serviceData
    const db = getDatabase()
    
    const query = `
      UPDATE ${this.tableName} 
      SET name = ?, description = ?, duration = ?, 
          price = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `
    
    const values = [name, description, duration, price, status, id]
    
    try {
      const result = await db.run(query, values)
      if (result.changes === 0) {
        throw new Error('Service not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating service:', error)
      throw new Error('Failed to update service')
    }
  }

  static async updateStatus(id, status) {
    const validStatuses = ['active', 'inactive']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }
    
    const db = getDatabase()
    const query = `
      UPDATE ${this.tableName} 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `
    
    try {
      const result = await db.run(query, [status, id])
      if (result.changes === 0) {
        throw new Error('Service not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating service status:', error)
      throw new Error('Failed to update service status')
    }
  }

  static async findAll(options = {}) {
    const db = getDatabase()
    let query = `
      SELECT 
        s.id, s.name, s.description, s.duration, s.price, s.status,
        s.company_id as companyId, s.created_at as createdAt, s.updated_at as updatedAt,
        c.name as companyName
      FROM ${this.tableName} s
      LEFT JOIN companies c ON s.company_id = c.id
    `
    
    const values = []
    
    // Add company filter
    if (options.companyId) {
      query += ' WHERE s.company_id = ?'
      values.push(options.companyId)
    }
    
    // Add status filter
    if (options.status) {
      query += options.companyId ? ' AND s.status = ?' : ' WHERE s.status = ?'
      values.push(options.status)
    }
    
    // Add ordering
    query += ' ORDER BY s.created_at DESC'
    
    // Add pagination
    if (options.limit) {
      query += ' LIMIT ?'
      values.push(options.limit)
      
      if (options.offset) {
        query += ' OFFSET ?'
        values.push(options.offset)
      }
    }
    
    try {
      const rows = await db.all(query, values)
      return rows
    } catch (error) {
      console.error('Error finding all services:', error)
      throw new Error('Failed to find services')
    }
  }

  static async delete(id) {
    const db = getDatabase()
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await db.run(query, [id])
      if (result.changes === 0) {
        throw new Error('Service not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting service:', error)
      throw new Error('Failed to delete service')
    }
  }

  static async existsByCompanyId(companyId) {
    const db = getDatabase()
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE company_id = ?`
    
    try {
      const row = await db.get(query, [companyId])
      return row.count > 0
    } catch (error) {
      console.error('Error checking service existence:', error)
      throw new Error('Failed to check service existence')
    }
  }
}
