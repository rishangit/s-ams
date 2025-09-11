import { executeQuery } from '../../database/mysql/database.js'
import { STAFF_STATUS, getStatusName, getStatusDisplayName } from '../../constants/staffStatus.js'

export class Staff {
  static tableName = 'staff'

  static async create(staffData) {
    const { userId, companyId, workingHoursStart, workingHoursEnd, skills, professionalQualifications, status } = staffData

    try {
      const result = await executeQuery(`
        INSERT INTO ${this.tableName} (user_id, company_id, working_hours_start, working_hours_end, skills, professional_qualifications, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [userId, companyId, workingHoursStart, workingHoursEnd, skills, professionalQualifications, status || STAFF_STATUS.ACTIVE])

      return {
        id: result.insertId,
        userId,
        companyId,
        workingHoursStart,
        workingHoursEnd,
        skills,
        professionalQualifications,
        status: status || STAFF_STATUS.ACTIVE
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User is already a staff member for this company')
      }
      throw error
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        s.id, s.user_id as userId, s.company_id as companyId, 
        s.working_hours_start as workingHoursStart, s.working_hours_end as workingHoursEnd,
        s.skills, s.professional_qualifications as professionalQualifications,
        s.status, s.created_at as createdAt, s.updated_at as updatedAt,
        u.first_name as firstName, u.last_name as lastName, u.email, 
        u.phone_number as phoneNumber, u.profile_image as profileImage,
        c.name as companyName
      FROM ${this.tableName} s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.id = ?
    `
    
    try {
      const rows = await executeQuery(query, [id])
      return rows[0] || null
    } catch (error) {
      console.error('Error finding staff by ID:', error)
      throw new Error('Failed to find staff member')
    }
  }

  static async findByCompanyId(companyId) {
    const query = `
      SELECT 
        s.id, s.user_id as userId, s.company_id as companyId, 
        s.working_hours_start as workingHoursStart, s.working_hours_end as workingHoursEnd,
        s.skills, s.professional_qualifications as professionalQualifications,
        s.status, s.created_at as createdAt, s.updated_at as updatedAt,
        u.first_name as firstName, u.last_name as lastName, u.email, 
        u.phone_number as phoneNumber, u.profile_image as profileImage,
        c.name as companyName
      FROM ${this.tableName} s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.company_id = ? AND s.status = ?
      ORDER BY s.created_at DESC
    `
    
    try {
      const rows = await executeQuery(query, [companyId, STAFF_STATUS.ACTIVE])
      return rows
    } catch (error) {
      console.error('Error finding staff by company ID:', error)
      throw new Error('Failed to find staff members')
    }
  }

  static async findAllByCompanyId(companyId) {
    const query = `
      SELECT 
        s.id, s.user_id as userId, s.company_id as companyId, 
        s.working_hours_start as workingHoursStart, s.working_hours_end as workingHoursEnd,
        s.skills, s.professional_qualifications as professionalQualifications,
        s.status, s.created_at as createdAt, s.updated_at as updatedAt,
        u.first_name as firstName, u.last_name as lastName, u.email, 
        u.phone_number as phoneNumber, u.profile_image as profileImage,
        c.name as companyName
      FROM ${this.tableName} s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.company_id = ?
      ORDER BY s.created_at DESC
    `
    
    try {
      const rows = await executeQuery(query, [companyId])
      return rows
    } catch (error) {
      console.error('Error finding all staff by company ID:', error)
      throw new Error('Failed to find staff members')
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT 
        s.id, s.user_id as userId, s.company_id as companyId, 
        s.working_hours_start as workingHoursStart, s.working_hours_end as workingHoursEnd,
        s.skills, s.professional_qualifications as professionalQualifications,
        s.status, s.created_at as createdAt, s.updated_at as updatedAt,
        u.first_name as firstName, u.last_name as lastName, u.email, 
        u.phone_number as phoneNumber, u.profile_image as profileImage,
        c.name as companyName
      FROM ${this.tableName} s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `
    
    try {
      const rows = await executeQuery(query, [userId])
      return rows
    } catch (error) {
      console.error('Error finding staff by user ID:', error)
      throw new Error('Failed to find staff members')
    }
  }

  static async update(id, updateData) {
    const { workingHoursStart, workingHoursEnd, skills, professionalQualifications, status } = updateData

    const updateFields = []
    const updateValues = []

    if (workingHoursStart !== undefined) {
      updateFields.push('working_hours_start = ?')
      updateValues.push(workingHoursStart)
    }
    if (workingHoursEnd !== undefined) {
      updateFields.push('working_hours_end = ?')
      updateValues.push(workingHoursEnd)
    }
    if (skills !== undefined) {
      updateFields.push('skills = ?')
      updateValues.push(skills)
    }
    if (professionalQualifications !== undefined) {
      updateFields.push('professional_qualifications = ?')
      updateValues.push(professionalQualifications)
    }
    if (status !== undefined) {
      updateFields.push('status = ?')
      updateValues.push(status)
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(id)

    const query = `
      UPDATE ${this.tableName} 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `

    try {
      const result = await executeQuery(query, updateValues)

      if (result.affectedRows === 0) {
        throw new Error('Staff member not found')
      }

      return await this.findById(id)
    } catch (error) {
      console.error('Error updating staff:', error)
      throw new Error('Failed to update staff member')
    }
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    
    try {
      const result = await executeQuery(query, [id])

      if (result.affectedRows === 0) {
        throw new Error('Staff member not found')
      }

      return true
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw new Error('Failed to delete staff member')
    }
  }

  static async findAll() {
    const query = `
      SELECT 
        s.id, s.user_id as userId, s.company_id as companyId, 
        s.working_hours_start as workingHoursStart, s.working_hours_end as workingHoursEnd,
        s.skills, s.professional_qualifications as professionalQualifications,
        s.status, s.created_at as createdAt, s.updated_at as updatedAt,
        u.first_name as firstName, u.last_name as lastName, u.email, 
        u.phone_number as phoneNumber, u.profile_image as profileImage,
        c.name as companyName
      FROM ${this.tableName} s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      ORDER BY s.created_at DESC
    `
    
    try {
      const rows = await executeQuery(query)
      return rows
    } catch (error) {
      console.error('Error finding all staff:', error)
      throw new Error('Failed to find staff members')
    }
  }

  static async findAvailableUsersForCompany(companyId) {
    const query = `
      SELECT 
        u.id, u.first_name as firstName, u.last_name as lastName, 
        u.email, u.phone_number as phoneNumber, u.profile_image as profileImage, u.role
      FROM users u
      WHERE u.id NOT IN (
        SELECT s.user_id 
        FROM ${this.tableName} s 
        WHERE s.company_id = ? AND s.status = ?
      )
      AND u.role IN (2, 3)
      ORDER BY u.first_name, u.last_name
    `
    
    try {
      const rows = await executeQuery(query, [companyId, STAFF_STATUS.ACTIVE])
      return rows
    } catch (error) {
      console.error('Error finding available users:', error)
      throw new Error('Failed to find available users')
    }
  }

  static async isUserStaffForCompany(userId, companyId) {
    const query = `
      SELECT id FROM ${this.tableName} 
      WHERE user_id = ? AND company_id = ? AND status = ?
    `
    
    try {
      const rows = await executeQuery(query, [userId, companyId, STAFF_STATUS.ACTIVE])
      return rows.length > 0
    } catch (error) {
      console.error('Error checking if user is staff:', error)
      throw new Error('Failed to check staff status')
    }
  }
}
