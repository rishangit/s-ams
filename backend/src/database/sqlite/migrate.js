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

    // Create companies table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        land_phone TEXT NOT NULL,
        geo_location TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'active', 'inactive')) DEFAULT 'pending',
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (user_id)
      )
    `)

    // Create indexes for companies table
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies (user_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_companies_status ON companies (status)
    `)

    // Create services table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        duration TEXT,
        price DECIMAL(10,2),
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        company_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
      )
    `)

    // Create indexes for services table
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_services_company_id ON services (company_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_services_status ON services (status)
    `)

    // Create appointments table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        company_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      )
    `)

    // Create indexes for appointments table
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments (user_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_company_id ON appointments (company_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments (service_id)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments (appointment_date, appointment_time)
    `)

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status)
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
