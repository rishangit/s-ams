import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { config } from '../../../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

export const initializeDatabase = async () => {
  try {
    // Ensure database directory exists
    const dbDir = path.dirname(config.database.path)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    
    // Open database connection
    db = await open({
      filename: config.database.path,
      driver: sqlite3.Database
    })

    console.log('Database connected successfully')
    return db
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export const closeDatabase = async () => {
  if (db) {
    await db.close()
    db = null
    console.log('Database connection closed')
  }
}
