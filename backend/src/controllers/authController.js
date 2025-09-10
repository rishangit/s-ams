import { User } from '../models/index.js'
import { generateToken } from '../middleware/auth.js'
import { isValidRoleName } from '../constants/roles.js'

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    })

    // Generate JWT token
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profileImage: user.profileImage
        },
        token
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = generateToken(user.id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          role: user.role,
          profileImage: user.profile_image
        },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          role: user.role,
          profileImage: user.profile_image,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, profileImage } = req.body

    const updatedUser = await User.update(req.user.id, {
      firstName,
      lastName,
      phoneNumber,
      profileImage
    })

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phone_number,
          role: updatedUser.role,
          profileImage: updatedUser.profile_image,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at
        }
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }
}

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    
    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          role: user.role !== null ? user.role : 3,
          profileImage: user.profile_image,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }))
      }
    })
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    })
  }
}

// Get users by role (admin only)
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params
    
    const users = await User.findByRole(role)
    
    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          role: user.role !== null ? user.role : 3,
          profileImage: user.profile_image,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }))
      }
    })
  } catch (error) {
    console.error('Get users by role error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get users by role',
      error: error.message
    })
  }
}

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Validate role
    if (!isValidRoleName(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: admin, owner, staff, user'
      })
    }

    const updatedUser = await User.updateRole(id, role)
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phone_number,
          role: updatedUser.role,
          profileImage: updatedUser.profile_image,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at
        }
      }
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    })
  }
}
