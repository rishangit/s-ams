import mysql from 'mysql2/promise'
import { config } from '../../../config.js'

let pool = null

export const initializeDatabase = async () => {
  try {
    // Create connection pool
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000
    })

    // Test the connection
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()

    console.log('MySQL Database connected successfully')
    return pool
  } catch (error) {
    console.error('MySQL Database initialization error:', error)
    throw error
  }
}

export const getDatabase = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return pool
}

export const closeDatabase = async () => {
  if (pool) {
    await pool.end()
    pool = null
    console.log('MySQL Database connection closed')
  }
}

// Helper function to execute queries with proper error handling
export const executeQuery = async (query, params = []) => {
  const db = getDatabase()
  try {
    const [rows] = await db.execute(query, params)
    return rows
  } catch (error) {
    console.error('Query execution error:', error)
    throw error
  }
}

// Helper function to execute transactions
export const executeTransaction = async (queries) => {
  const db = getDatabase()
  const connection = await db.getConnection()
  
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, params = [] } of queries) {
      const [rows] = await connection.execute(query, params)
      results.push(rows)
    }
    
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
