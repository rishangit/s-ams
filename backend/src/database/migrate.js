import { initializeDatabase, getDatabase } from './database.js'

const createTables = async () => {
  const db = getDatabase()

  try {
    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT,
        password_hash TEXT NOT NULL,
        role INTEGER CHECK(role IN (0, 1, 2, 3)) DEFAULT 3,
        profile_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create user_sessions table for JWT token management
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `)

    // Create indexes for better performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions (user_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions (expires_at)
    `)

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}

const addProfileImageColumn = async () => {
  const db = getDatabase()

  try {
    // Check if profile_image column exists
    const tableInfo = await db.all("PRAGMA table_info(users)")
    const hasProfileImage = tableInfo.some(column => column.name === 'profile_image')

    if (!hasProfileImage) {
      await db.exec(`
        ALTER TABLE users ADD COLUMN profile_image TEXT
      `)
      console.log('Profile image column added successfully')
    } else {
      console.log('Profile image column already exists')
    }
  } catch (error) {
    console.error('Error adding profile image column:', error)
    throw error
  }
}

const runMigrations = async () => {
  try {
    await initializeDatabase()
    await createTables()
    await addProfileImageColumn()
    console.log('Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
