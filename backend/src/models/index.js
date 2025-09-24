import { config } from '../../config.js'

// Import MySQL model implementations
import { User as MySQLUser } from './mysql/User.js'
import { Company as MySQLCompany } from './mysql/Company.js'
import { Service as MySQLService } from './mysql/Service.js'
import { Appointment as MySQLAppointment } from './mysql/Appointment.js'
import { Staff as MySQLStaff } from './mysql/staff.js'
import { Product as MySQLProduct } from './mysql/Product.js'
import { UserHistory as MySQLUserHistory } from './mysql/UserHistory.js'
import { Category as MySQLCategory } from './mysql/Category.js'
import { Subcategory as MySQLSubcategory } from './mysql/Subcategory.js'

// Get database type from config
const getDatabaseType = () => {
  return config.database.type || 'mysql'
}

// Export MySQL models (SQLite support removed)
export const User = MySQLUser
export const Company = MySQLCompany
export const Service = MySQLService
export const Appointment = MySQLAppointment
export const Staff = MySQLStaff
export const Product = MySQLProduct
export const UserHistory = MySQLUserHistory
export const Category = MySQLCategory
export const Subcategory = MySQLSubcategory

// Export database type for other modules
export const getCurrentDatabaseType = getDatabaseType

// Check if using MySQL
export const isMySQL = () => {
  return getDatabaseType() === 'mysql'
}
