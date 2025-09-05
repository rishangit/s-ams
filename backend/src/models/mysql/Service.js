import { executeQuery } from '../../database/mysql/database.js'

export class Service {
  static tableName = 'services'

  static async create(serviceData) {
    const { name, description, duration, price, status, companyId } = serviceData
    
    const query = `
      INSERT INTO ${this.tableName} 
      (name, description, duration, price, status, company_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    
    const values = [
      name, 
      description || null, 
      duration || null, 
      price, 
      status, 
      companyId
    ]
    
    try {
      const result = await executeQuery(query, values)
      return { id: result.insertId, ...serviceData, status: status || 'active' }
    } catch (error) {
      console.error('Error creating service:', error)
      throw new Error('Failed to create service')
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        id, name, description, duration, price, status, 
        company_id as companyId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE id = ?
    `
    
    try {
      const rows = await executeQuery(query, [id])
      return rows[0] || null
    } catch (error) {
      console.error('Error finding service by ID:', error)
      throw new Error('Failed to find service')
    }
  }

  static async findByCompanyId(companyId) {
    const query = `
      SELECT 
        id, name, description, duration, price, status, 
        company_id as companyId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE company_id = ?
      ORDER BY created_at DESC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows
    } catch (error) {
      console.error('Error finding services by company ID:', error)
      throw new Error('Failed to find services')
    }
  }

  static async update(id, serviceData) {
    const { name, description, duration, price, status } = serviceData
    
    const query = `
      UPDATE ${this.tableName} 
      SET name = ?, description = ?, duration = ?, 
          price = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const values = [
      name, 
      description || null, 
      duration || null, 
      price, 
      status, 
      id
    ]
    
    try {
      const result = await executeQuery(query, values)
      if (result.affectedRows === 0) {
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
    
    const query = `
      UPDATE ${this.tableName} 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [status, id])
      if (result.affectedRows === 0) {
        throw new Error('Service not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating service status:', error)
      throw new Error('Failed to update service status')
    }
  }

  static async findAll(options = {}) {
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
    
    // Add pagination - ensure values are strings for MySQL2
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
      return rows
    } catch (error) {
      console.error('Error finding all services:', error)
      throw new Error('Failed to find services')
    }
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('Service not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting service:', error)
      throw new Error('Failed to delete service')
    }
  }

  static async existsByCompanyId(companyId) {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE company_id = ?`
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows[0].count > 0
    } catch (error) {
      console.error('Error checking service existence:', error)
      throw new Error('Failed to check service existence')
    }
  }
}
