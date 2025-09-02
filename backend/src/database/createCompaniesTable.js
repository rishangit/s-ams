import { db } from './database.js'

const createCompaniesTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        land_phone VARCHAR(15) NOT NULL,
        geo_location VARCHAR(100) NOT NULL,
        status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_company (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `

    await db.execute(query)
    console.log('✅ Companies table created successfully')
  } catch (error) {
    console.error('❌ Error creating companies table:', error)
    throw error
  }
}

export default createCompaniesTable
