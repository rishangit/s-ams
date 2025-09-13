import { config } from '../../config.js'

// Import MySQL database implementation
import * as mysqlDb from './mysql/database.js'

let currentDb = null

export const initializeDatabase = async () => {
  try {
    const dbType = config.database.type || 'mysql'
    
    if (dbType === 'mysql') {
      console.log('Initializing MySQL database...')
      currentDb = mysqlDb
      await mysqlDb.initializeDatabase()
    } else {
      throw new Error('Only MySQL database is supported. Please set DB_TYPE=mysql in your environment variables.')
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
  return config.database.type || 'mysql'
}

// Check if using MySQL
export const isMySQL = () => {
  return getDatabaseType() === 'mysql'
}
