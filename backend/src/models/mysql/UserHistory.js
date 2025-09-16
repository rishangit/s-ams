import { executeQuery } from '../../database/mysql/database.js'

export class UserHistory {
  static tableName = 'user_history'

  // Create a new user history record
  static async create(data) {
    const {
      appointmentId,
      userId,
      companyId,
      staffId,
      serviceId,
      productsUsed = [],
      totalCost = 0.00,
      notes = ''
    } = data

    const query = `
      INSERT INTO ${this.tableName} 
      (appointment_id, user_id, company_id, staff_id, service_id, products_used, total_cost, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    try {
      const result = await executeQuery(query, [
        appointmentId,
        userId,
        companyId,
        staffId,
        serviceId,
        JSON.stringify(productsUsed),
        totalCost,
        notes
      ])

      const historyId = result.insertId
      return await this.findById(historyId)
    } catch (error) {
      console.error('Error creating user history:', error)
      throw new Error('Failed to create user history')
    }
  }


  // Find user history by ID
  static async findById(id) {
    const query = `
      SELECT 
        uh.id, uh.appointment_id as appointmentId, uh.user_id as userId,
        uh.company_id as companyId, uh.staff_id as staffId, uh.service_id as serviceId,
        uh.products_used as productsUsed, uh.total_cost as totalCost, uh.notes,
        uh.completion_date as completionDate, uh.created_at as createdAt, uh.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail,
        c.name as companyName,
        CONCAT(st.first_name, ' ', st.last_name) as staffName, st.email as staffEmail,
        sv.name as serviceName, sv.price as servicePrice
      FROM ${this.tableName} uh
      LEFT JOIN users u ON uh.user_id = u.id
      LEFT JOIN companies c ON uh.company_id = c.id
      LEFT JOIN staff s ON uh.staff_id = s.id
      LEFT JOIN users st ON s.user_id = st.id
      LEFT JOIN services sv ON uh.service_id = sv.id
      WHERE uh.id = ?
    `

    try {
      const rows = await executeQuery(query, [id])
      if (rows.length === 0) return null

      const history = rows[0]
      
      // Parse products_used JSON
      if (history.productsUsed) {
        try {
          // Handle both string and already parsed JSON
          if (typeof history.productsUsed === 'string') {
            // Clean up the string if it has escaped quotes
            let cleanJson = history.productsUsed
            if (cleanJson.includes('\\"')) {
              cleanJson = cleanJson.replace(/\\"/g, '"')
            }
            history.productsUsed = JSON.parse(cleanJson)
          } else if (Array.isArray(history.productsUsed)) {
            // Already an array, use as is
            history.productsUsed = history.productsUsed
          } else {
            history.productsUsed = []
          }
        } catch (parseError) {
          console.warn('Failed to parse productsUsed JSON:', history.productsUsed)
          console.warn('Parse error:', parseError.message)
          history.productsUsed = []
        }
      } else {
        history.productsUsed = []
      }

      // Convert numeric fields
      history.totalCost = parseFloat(history.totalCost)
      history.servicePrice = parseFloat(history.servicePrice)

      return history
    } catch (error) {
      console.error('Error finding user history by ID:', error)
      throw new Error('Failed to find user history')
    }
  }

  // Find user history by appointment ID
  static async findByAppointmentId(appointmentId) {
    const query = `
      SELECT 
        uh.id, uh.appointment_id as appointmentId, uh.user_id as userId,
        uh.company_id as companyId, uh.staff_id as staffId, uh.service_id as serviceId,
        uh.products_used as productsUsed, uh.total_cost as totalCost, uh.notes,
        uh.completion_date as completionDate, uh.created_at as createdAt, uh.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail,
        c.name as companyName,
        CONCAT(st.first_name, ' ', st.last_name) as staffName, st.email as staffEmail,
        sv.name as serviceName, sv.price as servicePrice
      FROM ${this.tableName} uh
      LEFT JOIN users u ON uh.user_id = u.id
      LEFT JOIN companies c ON uh.company_id = c.id
      LEFT JOIN staff s ON uh.staff_id = s.id
      LEFT JOIN users st ON s.user_id = st.id
      LEFT JOIN services sv ON uh.service_id = sv.id
      WHERE uh.appointment_id = ?
    `

    try {
      const rows = await executeQuery(query, [appointmentId])
      if (rows.length === 0) return null

      const history = rows[0]
      
      // Parse products_used JSON
      if (history.productsUsed) {
        try {
          // Handle both string and already parsed JSON
          if (typeof history.productsUsed === 'string') {
            // Clean up the string if it has escaped quotes
            let cleanJson = history.productsUsed
            if (cleanJson.includes('\\"')) {
              cleanJson = cleanJson.replace(/\\"/g, '"')
            }
            history.productsUsed = JSON.parse(cleanJson)
          } else if (Array.isArray(history.productsUsed)) {
            // Already an array, use as is
            history.productsUsed = history.productsUsed
          } else {
            history.productsUsed = []
          }
        } catch (parseError) {
          console.warn('Failed to parse productsUsed JSON:', history.productsUsed)
          console.warn('Parse error:', parseError.message)
          history.productsUsed = []
        }
      } else {
        history.productsUsed = []
      }

      // Convert numeric fields
      history.totalCost = parseFloat(history.totalCost)
      history.servicePrice = parseFloat(history.servicePrice)

      return history
    } catch (error) {
      console.error('Error finding user history by appointment ID:', error)
      throw new Error('Failed to find user history')
    }
  }

  // Find user history by company ID
  static async findByCompanyId(companyId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        uh.id, uh.appointment_id as appointmentId, uh.user_id as userId,
        uh.company_id as companyId, uh.staff_id as staffId, uh.service_id as serviceId,
        uh.products_used as productsUsed, uh.total_cost as totalCost, uh.notes,
        uh.completion_date as completionDate, uh.created_at as createdAt, uh.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail,
        c.name as companyName,
        CONCAT(st.first_name, ' ', st.last_name) as staffName, st.email as staffEmail,
        sv.name as serviceName, sv.price as servicePrice
      FROM ${this.tableName} uh
      LEFT JOIN users u ON uh.user_id = u.id
      LEFT JOIN companies c ON uh.company_id = c.id
      LEFT JOIN staff s ON uh.staff_id = s.id
      LEFT JOIN users st ON s.user_id = st.id
      LEFT JOIN services sv ON uh.service_id = sv.id
      WHERE uh.company_id = ?
      ORDER BY uh.completion_date DESC
      LIMIT ? OFFSET ?
    `

    try {
      const rows = await executeQuery(query, [companyId, limit, offset])
      
      return rows.map(history => {
        // Parse products_used JSON
        if (history.productsUsed) {
          try {
            history.productsUsed = JSON.parse(history.productsUsed)
          } catch (parseError) {
            console.warn('Failed to parse productsUsed JSON:', history.productsUsed)
            history.productsUsed = []
          }
        } else {
          history.productsUsed = []
        }

        // Convert numeric fields
        history.totalCost = parseFloat(history.totalCost)
        history.servicePrice = parseFloat(history.servicePrice)

        return history
      })
    } catch (error) {
      console.error('Error finding user history by company ID:', error)
      throw new Error('Failed to find user history')
    }
  }

  // Find user history by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        uh.id, uh.appointment_id as appointmentId, uh.user_id as userId,
        uh.company_id as companyId, uh.staff_id as staffId, uh.service_id as serviceId,
        uh.products_used as productsUsed, uh.total_cost as totalCost, uh.notes,
        uh.completion_date as completionDate, uh.created_at as createdAt, uh.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail,
        c.name as companyName,
        CONCAT(st.first_name, ' ', st.last_name) as staffName, st.email as staffEmail,
        sv.name as serviceName, sv.price as servicePrice
      FROM ${this.tableName} uh
      LEFT JOIN users u ON uh.user_id = u.id
      LEFT JOIN companies c ON uh.company_id = c.id
      LEFT JOIN staff s ON uh.staff_id = s.id
      LEFT JOIN users st ON s.user_id = st.id
      LEFT JOIN services sv ON uh.service_id = sv.id
      WHERE uh.user_id = ?
      ORDER BY uh.completion_date DESC
      LIMIT ? OFFSET ?
    `

    try {
      const rows = await executeQuery(query, [userId, limit, offset])
      
      return rows.map(history => {
        // Parse products_used JSON
        if (history.productsUsed) {
          try {
            history.productsUsed = JSON.parse(history.productsUsed)
          } catch (parseError) {
            console.warn('Failed to parse productsUsed JSON:', history.productsUsed)
            history.productsUsed = []
          }
        } else {
          history.productsUsed = []
        }

        // Convert numeric fields
        history.totalCost = parseFloat(history.totalCost)
        history.servicePrice = parseFloat(history.servicePrice)

        return history
      })
    } catch (error) {
      console.error('Error finding user history by user ID:', error)
      throw new Error('Failed to find user history')
    }
  }

  // Get all user history records
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT 
        uh.id, uh.appointment_id as appointmentId, uh.user_id as userId,
        uh.company_id as companyId, uh.staff_id as staffId, uh.service_id as serviceId,
        uh.products_used as productsUsed, uh.total_cost as totalCost, uh.notes,
        uh.completion_date as completionDate, uh.created_at as createdAt, uh.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail,
        c.name as companyName,
        CONCAT(st.first_name, ' ', st.last_name) as staffName, st.email as staffEmail,
        sv.name as serviceName, sv.price as servicePrice
      FROM ${this.tableName} uh
      LEFT JOIN users u ON uh.user_id = u.id
      LEFT JOIN companies c ON uh.company_id = c.id
      LEFT JOIN staff s ON uh.staff_id = s.id
      LEFT JOIN users st ON s.user_id = st.id
      LEFT JOIN services sv ON uh.service_id = sv.id
      ORDER BY uh.completion_date DESC
      LIMIT ? OFFSET ?
    `

    try {
      const rows = await executeQuery(query, [limit, offset])
      
      return rows.map(history => {
        // Parse products_used JSON
        if (history.productsUsed) {
          try {
            history.productsUsed = JSON.parse(history.productsUsed)
          } catch (parseError) {
            console.warn('Failed to parse productsUsed JSON:', history.productsUsed)
            history.productsUsed = []
          }
        } else {
          history.productsUsed = []
        }

        // Convert numeric fields
        history.totalCost = parseFloat(history.totalCost)
        history.servicePrice = parseFloat(history.servicePrice)

        return history
      })
    } catch (error) {
      console.error('Error finding all user history:', error)
      throw new Error('Failed to find user history')
    }
  }

  // Update user history
  static async update(id, data) {
    const {
      productsUsed,
      totalCost,
      notes
    } = data

    const query = `
      UPDATE ${this.tableName}
      SET products_used = ?, total_cost = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    try {
      const result = await executeQuery(query, [
        JSON.stringify(productsUsed || []),
        totalCost,
        notes,
        id
      ])

      if (result.affectedRows === 0) {
        throw new Error('User history not found')
      }

      return await this.findById(id)
    } catch (error) {
      console.error('Error updating user history:', error)
      throw new Error('Failed to update user history')
    }
  }

  // Delete user history
  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`

    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('User history not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting user history:', error)
      throw new Error('Failed to delete user history')
    }
  }

  // Get user history statistics for a company
  static async getCompanyStats(companyId) {
    const query = `
      SELECT 
        COUNT(*) as totalAppointments,
        SUM(total_cost) as totalRevenue,
        AVG(total_cost) as averageCost,
        COUNT(DISTINCT user_id) as uniqueCustomers
      FROM ${this.tableName}
      WHERE company_id = ?
    `

    try {
      const rows = await executeQuery(query, [companyId])
      const stats = rows[0]
      
      return {
        totalAppointments: parseInt(stats.totalAppointments),
        totalRevenue: parseFloat(stats.totalRevenue || 0),
        averageCost: parseFloat(stats.averageCost || 0),
        uniqueCustomers: parseInt(stats.uniqueCustomers)
      }
    } catch (error) {
      console.error('Error getting company stats:', error)
      throw new Error('Failed to get company statistics')
    }
  }

  // Check if appointment already has history
  static async existsByAppointmentId(appointmentId) {
    const query = `SELECT id FROM ${this.tableName} WHERE appointment_id = ?`
    
    try {
      const rows = await executeQuery(query, [appointmentId])
      return rows.length > 0
    } catch (error) {
      console.error('Error checking user history existence:', error)
      throw new Error('Failed to check user history existence')
    }
  }
}

