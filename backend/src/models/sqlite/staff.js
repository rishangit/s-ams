import { getDatabase } from '../../database/sqlite/database.js'
import { STAFF_STATUS, getStatusName, getStatusDisplayName } from '../../constants/staffStatus.js'

export class Staff {
  static async create(staffData) {
    const db = getDatabase()
    const { userId, companyId, workingHoursStart, workingHoursEnd, skills, professionalQualifications, status } = staffData

    try {
      const result = await db.run(`
        INSERT INTO staff (user_id, company_id, working_hours_start, working_hours_end, skills, professional_qualifications, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [userId, companyId, workingHoursStart, workingHoursEnd, skills, professionalQualifications, status || STAFF_STATUS.ACTIVE])

      return {
        id: result.lastID,
        userId,
        companyId,
        workingHoursStart,
        workingHoursEnd,
        skills,
        professionalQualifications,
        status: status || STAFF_STATUS.ACTIVE
      }
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('User is already a staff member for this company')
      }
      throw error
    }
  }

  static async findById(id) {
    const db = getDatabase()
    
    const staff = await db.get(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, c.name as company_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.id = ?
    `, [id])

    return staff
  }

  static async findByCompanyId(companyId) {
    const db = getDatabase()
    
    const staff = await db.all(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, c.name as company_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.company_id = ? AND s.status = ?
      ORDER BY s.created_at DESC
    `, [companyId, STAFF_STATUS.ACTIVE])

    return staff
  }

  static async findAllByCompanyId(companyId) {
    const db = getDatabase()
    
    const staff = await db.all(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, c.name as company_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.company_id = ?
      ORDER BY s.created_at DESC
    `, [companyId])

    return staff
  }

  static async findByUserId(userId) {
    const db = getDatabase()
    
    const staff = await db.all(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, c.name as company_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `, [userId])

    return staff
  }

  static async update(id, updateData) {
    const db = getDatabase()
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

    const result = await db.run(`
      UPDATE staff 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues)

    if (result.changes === 0) {
      throw new Error('Staff member not found')
    }

    return await this.findById(id)
  }

  static async delete(id) {
    const db = getDatabase()
    
    const result = await db.run(`
      DELETE FROM staff WHERE id = ?
    `, [id])

    if (result.changes === 0) {
      throw new Error('Staff member not found')
    }

    return true
  }

  static async findAll() {
    const db = getDatabase()
    
    const staff = await db.all(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, c.name as company_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      ORDER BY s.created_at DESC
    `)

    return staff
  }

  static async findAvailableUsersForCompany(companyId) {
    const db = getDatabase()
    
    // Get users who are not already staff for this company
    const users = await db.all(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone_number, u.profile_image, u.role
      FROM users u
      WHERE u.id NOT IN (
        SELECT s.user_id 
        FROM staff s 
        WHERE s.company_id = ? AND s.status = ?
      )
      AND u.role IN (2, 3)
      ORDER BY u.first_name, u.last_name
    `, [companyId, STAFF_STATUS.ACTIVE])

    // Transform field names to match frontend expectations
    return users.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      profileImage: user.profile_image,
      role: user.role
    }))
  }

  static async isUserStaffForCompany(userId, companyId) {
    const db = getDatabase()
    
    const staff = await db.get(`
      SELECT id FROM staff 
      WHERE user_id = ? AND company_id = ? AND status = ?
    `, [userId, companyId, STAFF_STATUS.ACTIVE])

    return !!staff
  }
}

