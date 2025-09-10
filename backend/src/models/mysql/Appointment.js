import { executeQuery } from '../../database/mysql/database.js'
import { APPOINTMENT_STATUS, getStatusName, getStatusId } from '../../constants/appointmentStatus.js'

export class Appointment {
  static tableName = 'appointments'

  static async create(appointmentData) {
    const {
      userId,
      companyId,
      serviceId,
      appointmentDate,
      appointmentTime,
      status = APPOINTMENT_STATUS.PENDING,
      notes = null
    } = appointmentData

    const query = `
      INSERT INTO ${this.tableName} 
      (user_id, company_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    
    const values = [userId, companyId, serviceId, appointmentDate, appointmentTime, status, notes]
    
    try {
      const result = await executeQuery(query, values)
      return { id: result.insertId, ...appointmentData, status }
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw new Error('Failed to create appointment')
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        a.id, a.user_id as userId, a.company_id as companyId, a.service_id as serviceId,
        a.appointment_date as appointmentDate, a.appointment_time as appointmentTime,
        a.status, a.notes, a.created_at as createdAt, a.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail, u.profile_image as userProfileImage,
        c.name as companyName, s.name as serviceName, s.price as servicePrice
      FROM ${this.tableName} a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `
    
    try {
      const rows = await executeQuery(query, [id])
      if (rows.length === 0) {
        return null
      }
      
      const appointment = rows[0]
      if (!appointment) return null
      const convertedStatus = getStatusName(appointment.status)
      return {
        ...appointment,
        status: convertedStatus
      }
    } catch (error) {
      console.error('Error finding appointment by ID:', error)
      throw new Error('Failed to find appointment')
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT 
        a.id, a.user_id as userId, a.company_id as companyId, a.service_id as serviceId,
        a.appointment_date as appointmentDate, a.appointment_time as appointmentTime,
        a.status, a.notes, a.created_at as createdAt, a.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail, u.profile_image as userProfileImage,
        c.name as companyName, s.name as serviceName, s.price as servicePrice
      FROM ${this.tableName} a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `
    
    try {
      const rows = await executeQuery(query, [userId])
      return rows.map(appointment => {
        const convertedStatus = getStatusName(appointment.status)
        return {
          ...appointment,
          status: convertedStatus
        }
      })
    } catch (error) {
      console.error('Error finding appointments by user ID:', error)
      throw new Error('Failed to find appointments by user')
    }
  }

  static async findByCompanyId(companyId) {
    const query = `
      SELECT 
        a.id, a.user_id as userId, a.company_id as companyId, a.service_id as serviceId,
        a.appointment_date as appointmentDate, a.appointment_time as appointmentTime,
        a.status, a.notes, a.created_at as createdAt, a.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail, u.profile_image as userProfileImage,
        c.name as companyName, s.name as serviceName, s.price as servicePrice
      FROM ${this.tableName} a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.company_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows.map(appointment => {
        const convertedStatus = getStatusName(appointment.status)
        return {
          ...appointment,
          status: convertedStatus
        }
      })
    } catch (error) {
      console.error('Error finding appointments by company ID:', error)
      throw new Error('Failed to find appointments by company')
    }
  }

  static async findAll(options = {}) {
    let query = `
      SELECT 
        a.id, a.user_id as userId, a.company_id as companyId, a.service_id as serviceId,
        a.appointment_date as appointmentDate, a.appointment_time as appointmentTime,
        a.status, a.notes, a.created_at as createdAt, a.updated_at as updatedAt,
        CONCAT(u.first_name, ' ', u.last_name) as userName, u.email as userEmail, u.profile_image as userProfileImage,
        c.name as companyName, s.name as serviceName, s.price as servicePrice
      FROM ${this.tableName} a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
    `
    
    const values = []
    
    // Add status filter
    if (options.status) {
      query += ' WHERE a.status = ?'
      values.push(options.status)
    }
    
    // Add company filter
    if (options.companyId) {
      query += options.status ? ' AND a.company_id = ?' : ' WHERE a.company_id = ?'
      values.push(options.companyId)
    }
    
    // Add ordering
    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC'
    
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
      return rows.map(appointment => {
        const convertedStatus = getStatusName(appointment.status)
        return {
          ...appointment,
          status: convertedStatus
        }
      })
    } catch (error) {
      console.error('Error finding all appointments:', error)
      throw new Error('Failed to find appointments')
    }
  }

  static async update(id, appointmentData) {
    const { appointmentDate, appointmentTime, status, notes } = appointmentData
    
    // Convert status string to integer if provided
    const statusValue = status ? getStatusId(status) : null
    
    const query = `
      UPDATE ${this.tableName} 
      SET appointment_date = COALESCE(?, appointment_date),
          appointment_time = COALESCE(?, appointment_time),
          status = COALESCE(?, status),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const values = [appointmentDate, appointmentTime, statusValue, notes, id]
    
    try {
      const result = await executeQuery(query, values)
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw new Error('Failed to update appointment')
    }
  }

  static async updateStatus(id, status) {
    const statusId = getStatusId(status)
    if (statusId === null) {
      throw new Error('Invalid status')
    }
    
    const query = `
      UPDATE ${this.tableName} 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    try {
      const result = await executeQuery(query, [statusId, id])
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found')
      }
      return await this.findById(id)
    } catch (error) {
      console.error('Error updating appointment status:', error)
      throw new Error('Failed to update appointment status')
    }
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await executeQuery(query, [id])
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found')
      }
      return true
    } catch (error) {
      console.error('Error deleting appointment:', error)
      throw new Error('Failed to delete appointment')
    }
  }

  static async isTimeSlotAvailable(companyId, serviceId, appointmentDate, appointmentTime, excludeId = null) {
    let query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      WHERE company_id = ? AND service_id = ? 
        AND appointment_date = ? AND appointment_time = ?
        AND status IN ('pending', 'confirmed')
    `
    
    const values = [companyId, serviceId, appointmentDate, appointmentTime]
    
    if (excludeId) {
      query += ' AND id != ?'
      values.push(excludeId)
    }
    
    try {
      const rows = await executeQuery(query, values)
      return rows.map(appointment => {
        const convertedStatus = getStatusName(appointment.status)
        return {
          ...appointment,
          status: convertedStatus
        }
      })[0].count === 0
    } catch (error) {
      console.error('Error checking time slot availability:', error)
      throw new Error('Failed to check time slot availability')
    }
  }

  static async getStats(companyId = null) {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM ${this.tableName}
    `
    
    const values = []
    if (companyId) {
      query += ' WHERE company_id = ?'
      values.push(companyId)
    }

    try {
      const rows = await executeQuery(query, values)
      return rows.map(appointment => {
        const convertedStatus = getStatusName(appointment.status)
        return {
          ...appointment,
          status: convertedStatus
        }
      })[0]
    } catch (error) {
      console.error('Error getting appointment stats:', error)
      throw new Error('Failed to get appointment stats')
    }
  }
}