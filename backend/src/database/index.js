import { config } from '../../config.js'

// Import database implementations
import * as sqliteDb from './sqlite/database.js'
import * as mysqlDb from './mysql/database.js'

let currentDb = null

export const initializeDatabase = async () => {
  try {
    const dbType = config.database.type || 'sqlite'
    
    if (dbType === 'mysql') {
      console.log('Initializing MySQL database...')
      currentDb = mysqlDb
      await mysqlDb.initializeDatabase()
    } else {
      console.log('Initializing SQLite database...')
      currentDb = sqliteDb
      await sqliteDb.initializeDatabase()
    }
    
    return currentDb
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

export const getDatabase = () => {
  if (!currentDb) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return currentDb.getDatabase()
}

export const closeDatabase = async () => {
  if (currentDb) {
    await currentDb.closeDatabase()
    currentDb = null
  }
}

// Helper function to execute queries (MySQL specific)
export const executeQuery = async (query, params = []) => {
  if (currentDb && currentDb.executeQuery) {
    return await currentDb.executeQuery(query, params)
  }
  throw new Error('executeQuery is only available for MySQL database')
}

// Helper function to execute transactions (MySQL specific)
export const executeTransaction = async (queries) => {
  if (currentDb && currentDb.executeTransaction) {
    return await currentDb.executeTransaction(queries)
  }
  throw new Error('executeTransaction is only available for MySQL database')
}

// Get current database type
export const getDatabaseType = () => {
  return config.database.type || 'sqlite'
}

// Check if using MySQL
export const isMySQL = () => {
  return getDatabaseType() === 'mysql'
}

// Check if using SQLite
export const isSQLite = () => {
  return getDatabaseType() === 'sqlite'
}
