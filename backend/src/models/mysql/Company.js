import { executeQuery } from '../../database/mysql/database.js'

export class Company {
  static tableName = 'companies'

  static async create(companyData) {
    const { name, address, phoneNumber, landPhone, geoLocation, userId } = companyData
    
    const query = `
      INSERT INTO ${this.tableName} 
      (name, address, phone_number, land_phone, geo_location, status, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    
    const values = [name, address, phoneNumber, landPhone, geoLocation, 'pending', userId]
    
    try {
      const result = await executeQuery(query, values)
      return { id: result.insertId, ...companyData, status: 'pending' }
    } catch (error) {
      console.error('Error creating company:', error)
      throw new Error('Failed to create company')
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        id, name, address, phone_number as phoneNumber, 
        land_phone as landPhone, geo_location as geoLocation,
        status, user_id as userId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE id = ?
    `
    
    try {
      const rows = await executeQuery(query, [id])
      return rows[0] || null
    } catch (error) {
      console.error('Error finding company by ID:', error)
      throw new Error('Failed to find company')
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT 
        id, name, address, phone_number as phoneNumber, 
        land_phone as landPhone, geo_location as geoLocation,
        status, user_id as userId, created_at as createdAt, updated_at as updatedAt
      FROM ${this.tableName} 
      WHERE user_id = ?
    `
    
    try {
      const rows = await executeQuery(query, [userId])
      return rows[0] || null
    } catch (error) {
      console.error('Error finding company by user ID:', error)
      throw new Error('Failed to find company')
    }
  }

  static async update(id, companyData) {
    const { name, address, phoneNumber, landPhone, geoLocation } = companyData
    
    const query = `
      UPDATE ${this.tableName} 
      SET name = ?, address = ?, phone_number = ?, land_phone = ?, 
          geo_location = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const values = [name, address, phoneNumber, landPhone, geoLocation, id]
    
    try {
      const result = await executeQuery(query, values)
      if (result.affectedRows === 0) {
        throw new Error('Company not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating company:', error)
      throw new Error('Failed to update company')
    }
  }

  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'active', 'inactive']
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
        throw new Error('Company not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating company status:', error)
      throw new Error('Failed to update company status')
    }
  }

  static async findAll(options = {}) {
    let query = `
      SELECT 
        c.id, c.name, c.address, c.phone_number as phoneNumber, 
        c.land_phone as landPhone, c.geo_location as geoLocation,
        c.status, c.user_id as userId, c.created_at as createdAt, c.updated_at as updatedAt,
        u.first_name as userFirstName, u.last_name as userLastName, u.email as userEmail
      FROM ${this.tableName} c
      LEFT JOIN users u ON c.user_id = u.id
    `
    
    const values = []
    
    // Add status filter
    if (options.status) {
      query += ' WHERE c.status = ?'
      values.push(options.status)
    }
    
    // Add ordering
    query += ' ORDER BY c.created_at DESC'
    
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
      console.error('Error finding all companies:', error)
      throw new Error('Failed to find companies')
    }
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('Company not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting company:', error)
      throw new Error('Failed to delete company')
    }
  }

  static async existsByUserId(userId) {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ?`
    
    try {
      const rows = await executeQuery(query, [userId])
      return rows[0].count > 0
    } catch (error) {
      console.error('Error checking company existence:', error)
      throw new Error('Failed to check company existence')
    }
  }
}


