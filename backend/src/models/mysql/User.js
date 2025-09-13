import { executeQuery } from '../../database/mysql/database.js'
import bcrypt from 'bcryptjs'
import { ROLES, getRoleId, isValidRole, isValidRoleName } from '../../constants/roles.js'

export class User {
  static async create(userData) {
    const { firstName, lastName, email, phoneNumber, password, role = 'user' } = userData

    try {
      // Convert role name to role ID
      const roleId = getRoleId(role)
      
      // Hash the password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const result = await executeQuery(`
        INSERT INTO users (first_name, last_name, email, phone_number, password_hash, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [firstName, lastName, email, phoneNumber, passwordHash, roleId])

      return {
        id: result.insertId,
        firstName,
        lastName,
        email,
        phoneNumber,
        role: roleId
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists')
      }
      throw error
    }
  }

  static async findByEmail(email) {
    const users = await executeQuery(`
      SELECT id, first_name, last_name, email, phone_number, password_hash, role, profile_image, created_at, updated_at
      FROM users
      WHERE email = ?
    `, [email])

    const user = users[0]
    if (user) {
      return {
        ...user,
        role: user.role !== null ? user.role : ROLES.USER
      }
    }

    return user
  }

  static async findById(id) {
    const users = await executeQuery(`
      SELECT id, first_name, last_name, email, phone_number, role, profile_image, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [id])

    const user = users[0]
    if (user) {
      return {
        ...user,
        role: user.role !== null ? user.role : ROLES.USER
      }
    }

    return user
  }

  static async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash)
  }

  static async update(id, updateData) {
    const { firstName, lastName, phoneNumber, role, profileImage } = updateData

    // Convert role name to role ID if provided
    const roleId = role ? getRoleId(role) : undefined
    const updateFields = []
    const updateValues = []

    if (firstName !== undefined) {
      updateFields.push('first_name = ?')
      updateValues.push(firstName)
    }
    if (lastName !== undefined) {
      updateFields.push('last_name = ?')
      updateValues.push(lastName)
    }
    if (phoneNumber !== undefined) {
      updateFields.push('phone_number = ?')
      updateValues.push(phoneNumber)
    }
    if (roleId !== undefined) {
      updateFields.push('role = ?')
      updateValues.push(roleId)
    }
    if (profileImage !== undefined) {
      updateFields.push('profile_image = ?')
      updateValues.push(profileImage)
    }

    updateValues.push(id)

    const result = await executeQuery(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues)

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return await this.findById(id)
  }

  static async delete(id) {
    const result = await executeQuery(`
      DELETE FROM users WHERE id = ?
    `, [id])

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return true
  }

  static async findAll() {
    const users = await executeQuery(`
      SELECT id, first_name, last_name, email, phone_number, role, profile_image, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `)

    return users.map(user => ({
      ...user,
      role: user.role !== null ? user.role : ROLES.USER
    }))
  }

  static async findByRole(role) {
    // Convert role name to role ID
    const roleId = getRoleId(role)
    
    const users = await executeQuery(`
      SELECT id, first_name, last_name, email, phone_number, role, profile_image, created_at, updated_at
      FROM users
      WHERE role = ?
      ORDER BY created_at DESC
    `, [roleId])

    return users.map(user => ({
      ...user,
      role: user.role !== null ? user.role : ROLES.USER
    }))
  }

  static async updateRole(id, role) {
    // Convert role name to role ID
    const roleId = getRoleId(role)
    
    const result = await executeQuery(`
      UPDATE users 
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [roleId, id])

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return await this.findById(id)
  }

  // Helper method to check if a user has a specific role
  static hasRole(user, requiredRole) {
    if (!user) return false
    
    // If requiredRole is a string, convert it to number
    const requiredRoleId = typeof requiredRole === 'string' ? getRoleId(requiredRole) : requiredRole
    return user.role === requiredRoleId
  }

  // Helper method to check if a user has any of the specified roles
  static hasAnyRole(user, roles) {
    if (!user) {
      return false
    }

    // Convert string roles to numbers if needed
    const roleIds = roles.map(role => typeof role === 'string' ? getRoleId(role) : role)
    return roleIds.includes(user.role)
  }

  // Helper method to check if a user has admin privileges
  static isAdmin(user) {
    return this.hasAnyRole(user, [ROLES.ADMIN, ROLES.OWNER])
  }

  // Helper method to get role ID from user object
  static getRoleId(user) {
    if (!user) return ROLES.USER
    
    // If role is already a number, return it directly
    if (typeof user.role === 'number') {
      return user.role
    }
    
    // If role is a string, convert it to number
    return getRoleId(user.role)
  }

  // Helper method to validate role
  static validateRole(role) {
    return isValidRole(role) || isValidRoleName(role)
  }
}
