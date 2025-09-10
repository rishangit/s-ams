import { config } from '../../config.js'

// Import model implementations
import { User as SQLiteUser } from './sqlite/User.js'
import { User as MySQLUser } from './mysql/User.js'
import {Company as SQLiteCompany} from './sqlite/Company.js'
import {Company as MySQLCompany}   from './mysql/Company.js'
import { Service as SQLiteService } from './sqlite/Service.js'
import { Service as MySQLService } from './mysql/Service.js'
import { Appointment as SQLiteAppointment } from './sqlite/Appointment.js'
import { Appointment as MySQLAppointment } from './mysql/Appointment.js'

// Get database type from config
const getDatabaseType = () => {
  return config.database.type || 'sqlite'
}

// Export models based on database type
export const User = getDatabaseType() === 'mysql' ? MySQLUser : SQLiteUser
export const Company = getDatabaseType() === 'mysql' ? MySQLCompany : SQLiteCompany
export const Service = getDatabaseType() === 'mysql' ? MySQLService : SQLiteService
export const Appointment = getDatabaseType() === 'mysql' ? MySQLAppointment : SQLiteAppointment

// Export database type for other modules
export const getCurrentDatabaseType = getDatabaseType

// Check if using MySQL
export const isMySQL = () => {
  return getDatabaseType() === 'mysql'
}

// Check if using SQLite
export const isSQLite = () => {
  return getDatabaseType() === 'sqlite'
}
