import { initializeDatabase, executeQuery } from './mysql/database.js'
import bcrypt from 'bcryptjs'
import { ROLES } from '../constants/roles.js'

const seedAdminUser = async () => {
  try {
    // Hash the password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash('Admin123!', saltRounds)

    // Create admin user
    const [result] = await executeQuery(`
      INSERT INTO users (first_name, last_name, email, phone_number, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['Admin', 'User', 'admin@s-ams.com', '+1234567890', passwordHash, ROLES.ADMIN])

    console.log('Admin user created successfully with ID:', result.insertId)
    console.log('Email: admin@s-ams.com')
    console.log('Password: Admin123!')
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('Admin user already exists')
      return
    }
    console.error('Error creating admin user:', error)
    throw error
  }
}

const runSeed = async () => {
  try {
    await initializeDatabase()
    await seedAdminUser()
    console.log('Database seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

runSeed()
