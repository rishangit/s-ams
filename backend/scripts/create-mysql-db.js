#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import { config } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

const createDatabase = async () => {
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password
    })

    console.log('Connected to MySQL server')

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database.name}`)
    console.log(`Database '${config.database.name}' created or already exists`)

    // Close connection
    await connection.end()
    console.log('Database creation completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Database creation failed:', error)
    process.exit(1)
  }
}

createDatabase()
