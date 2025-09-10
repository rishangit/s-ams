#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import mysql from 'mysql2/promise'
import { config } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

// Initialize connections
let sqliteDb = null
let mysqlPool = null

const initializeConnections = async () => {
  try {
    // Initialize SQLite connection
    sqliteDb = await open({
      filename: config.database.path,
      driver: sqlite3.Database
    })
    console.log('✅ SQLite connection established')

    // Initialize MySQL connection pool
    mysqlPool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000
    })

    // Test MySQL connection
    const connection = await mysqlPool.getConnection()
    await connection.ping()
    connection.release()
    console.log('✅ MySQL connection established')

  } catch (error) {
    console.error('❌ Connection initialization failed:', error)
    throw error
  }
}

const migrateUsers = async () => {
  try {
    console.log('\n🔄 Migrating users...')
    
    // Get all users from SQLite
    const users = await sqliteDb.all(`
      SELECT id, first_name, last_name, email, phone_number, password_hash, role, profile_image, created_at, updated_at
      FROM users
      ORDER BY id
    `)

    if (users.length === 0) {
      console.log('ℹ️  No users found in SQLite database')
      return
    }

    console.log(`📊 Found ${users.length} users to migrate`)

    // Insert users into MySQL
    for (const user of users) {
      await mysqlPool.execute(`
        INSERT INTO users (id, first_name, last_name, email, phone_number, password_hash, role, profile_image, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        email = VALUES(email),
        phone_number = VALUES(phone_number),
        password_hash = VALUES(password_hash),
        role = VALUES(role),
        profile_image = VALUES(profile_image),
        updated_at = VALUES(updated_at)
      `, [
        user.id,
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        user.password_hash,
        user.role,
        user.profile_image,
        user.created_at,
        user.updated_at
      ])
    }

    console.log(`✅ Successfully migrated ${users.length} users`)
  } catch (error) {
    console.error('❌ Error migrating users:', error)
    throw error
  }
}

const migrateCompanies = async () => {
  try {
    console.log('\n🔄 Migrating companies...')
    
    // Get all companies from SQLite
    const companies = await sqliteDb.all(`
      SELECT id, name, address, phone_number, land_phone, geo_location, status, user_id, created_at, updated_at
      FROM companies
      ORDER BY id
    `)

    if (companies.length === 0) {
      console.log('ℹ️  No companies found in SQLite database')
      return
    }

    console.log(`📊 Found ${companies.length} companies to migrate`)

    // Insert companies into MySQL
    for (const company of companies) {
      await mysqlPool.execute(`
        INSERT INTO companies (id, name, address, phone_number, land_phone, geo_location, status, user_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        address = VALUES(address),
        phone_number = VALUES(phone_number),
        land_phone = VALUES(land_phone),
        geo_location = VALUES(geo_location),
        status = VALUES(status),
        user_id = VALUES(user_id),
        updated_at = VALUES(updated_at)
      `, [
        company.id,
        company.name,
        company.address,
        company.phone_number,
        company.land_phone,
        company.geo_location,
        company.status,
        company.user_id,
        company.created_at,
        company.updated_at
      ])
    }

    console.log(`✅ Successfully migrated ${companies.length} companies`)
  } catch (error) {
    console.error('❌ Error migrating companies:', error)
    throw error
  }
}

const migrateUserSessions = async () => {
  try {
    console.log('\n🔄 Migrating user sessions...')
    
    // Get all user sessions from SQLite
    const sessions = await sqliteDb.all(`
      SELECT id, user_id, token_hash, expires_at, created_at
      FROM user_sessions
      ORDER BY id
    `)

    if (sessions.length === 0) {
      console.log('ℹ️  No user sessions found in SQLite database')
      return
    }

    console.log(`📊 Found ${sessions.length} user sessions to migrate`)

    // Insert user sessions into MySQL
    for (const session of sessions) {
      await mysqlPool.execute(`
        INSERT INTO user_sessions (id, user_id, token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        token_hash = VALUES(token_hash),
        expires_at = VALUES(expires_at),
        created_at = VALUES(created_at)
      `, [
        session.id,
        session.user_id,
        session.token_hash,
        session.expires_at,
        session.created_at
      ])
    }

    console.log(`✅ Successfully migrated ${sessions.length} user sessions`)
  } catch (error) {
    console.error('❌ Error migrating user sessions:', error)
    throw error
  }
}

const resetMySQLAutoIncrement = async () => {
  try {
    console.log('\n🔄 Resetting MySQL auto-increment counters...')
    
    // Get the maximum ID from each table
    const [usersResult] = await mysqlPool.execute('SELECT MAX(id) as maxId FROM users')
    const [companiesResult] = await mysqlPool.execute('SELECT MAX(id) as maxId FROM companies')
    const [sessionsResult] = await mysqlPool.execute('SELECT MAX(id) as maxId FROM user_sessions')
    
    const maxUserId = usersResult[0]?.maxId || 0
    const maxCompanyId = companiesResult[0]?.maxId || 0
    const maxSessionId = sessionsResult[0]?.maxId || 0
    
    // Reset auto-increment to the next value after the maximum ID
    if (maxUserId > 0) {
      await mysqlPool.execute(`ALTER TABLE users AUTO_INCREMENT = ${maxUserId + 1}`)
      console.log(`✅ Users auto-increment reset to ${maxUserId + 1}`)
    }
    
    if (maxCompanyId > 0) {
      await mysqlPool.execute(`ALTER TABLE companies AUTO_INCREMENT = ${maxCompanyId + 1}`)
      console.log(`✅ Companies auto-increment reset to ${maxCompanyId + 1}`)
    }
    
    if (maxSessionId > 0) {
      await mysqlPool.execute(`ALTER TABLE user_sessions AUTO_INCREMENT = ${maxSessionId + 1}`)
      console.log(`✅ User sessions auto-increment reset to ${maxSessionId + 1}`)
    }
    
  } catch (error) {
    console.error('❌ Error resetting auto-increment counters:', error)
    throw error
  }
}

const verifyMigration = async () => {
  try {
    console.log('\n🔍 Verifying migration...')
    
    // Count records in both databases
    const sqliteUsers = await sqliteDb.get('SELECT COUNT(*) as count FROM users')
    const sqliteCompanies = await sqliteDb.get('SELECT COUNT(*) as count FROM companies')
    const sqliteSessions = await sqliteDb.get('SELECT COUNT(*) as count FROM user_sessions')
    
    const [mysqlUsersResult] = await mysqlPool.execute('SELECT COUNT(*) as count FROM users')
    const [mysqlCompaniesResult] = await mysqlPool.execute('SELECT COUNT(*) as count FROM companies')
    const [mysqlSessionsResult] = await mysqlPool.execute('SELECT COUNT(*) as count FROM user_sessions')
    
    const mysqlUsers = mysqlUsersResult[0]
    const mysqlCompanies = mysqlCompaniesResult[0]
    const mysqlSessions = mysqlSessionsResult[0]
    
    console.log('\n📊 Migration Summary:')
    console.log(`Users: SQLite (${sqliteUsers.count}) → MySQL (${mysqlUsers.count})`)
    console.log(`Companies: SQLite (${sqliteCompanies.count}) → MySQL (${mysqlCompanies.count})`)
    console.log(`User Sessions: SQLite (${sqliteSessions.count}) → MySQL (${mysqlSessions.count})`)
    
    // Verify counts match
    const usersMatch = sqliteUsers.count === mysqlUsers.count
    const companiesMatch = sqliteCompanies.count === mysqlCompanies.count
    const sessionsMatch = sqliteSessions.count === mysqlSessions.count
    
    if (usersMatch && companiesMatch && sessionsMatch) {
      console.log('\n✅ Migration verification successful! All record counts match.')
    } else {
      console.log('\n⚠️  Migration verification failed! Some record counts do not match.')
      if (!usersMatch) console.log(`❌ Users count mismatch: SQLite (${sqliteUsers.count}) vs MySQL (${mysqlUsers.count})`)
      if (!companiesMatch) console.log(`❌ Companies count mismatch: SQLite (${sqliteCompanies.count}) vs MySQL (${mysqlCompanies.count})`)
      if (!sessionsMatch) console.log(`❌ User sessions count mismatch: SQLite (${sqliteSessions.count}) vs MySQL (${mysqlSessions.count})`)
    }
    
  } catch (error) {
    console.error('❌ Error verifying migration:', error)
    throw error
  }
}

const closeConnections = async () => {
  try {
    if (sqliteDb) {
      await sqliteDb.close()
      console.log('✅ SQLite connection closed')
    }
    
    if (mysqlPool) {
      await mysqlPool.end()
      console.log('✅ MySQL connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing connections:', error)
  }
}

const runMigration = async () => {
  try {
    console.log('🚀 Starting SQLite to MySQL data migration...')
    console.log(`📁 SQLite database: ${config.database.path}`)
    console.log(`🗄️  MySQL database: ${config.database.name}`)
    
    await initializeConnections()
    
    // Run migrations
    await migrateUsers()
    await migrateCompanies()
    await migrateUserSessions()
    
    // Reset auto-increment counters
    await resetMySQLAutoIncrement()
    
    // Verify migration
    await verifyMigration()
    
    console.log('\n🎉 Data migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Update your .env file to use MySQL: DB_TYPE=mysql')
    console.log('2. Test your application with the new MySQL database')
    console.log('3. Keep your SQLite database as backup')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await closeConnections()
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Migration interrupted by user')
  await closeConnections()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Migration terminated')
  await closeConnections()
  process.exit(0)
})

// Run the migration
runMigration()
