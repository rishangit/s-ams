import { executeQuery, initializeDatabase } from '../src/database/mysql/database.js'

const createUserHistoryTable = async () => {
  try {
    console.log('Initializing database connection...')
    await initializeDatabase()

    console.log('Creating user_history table...')
    
    // Create user_history table
    const createUserHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS user_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        user_id INT NOT NULL,
        company_id INT NOT NULL,
        staff_id INT,
        service_id INT NOT NULL,
        products_used JSON,
        total_cost DECIMAL(10, 2) DEFAULT 0.00,
        notes TEXT,
        completion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        
        INDEX idx_appointment_id (appointment_id),
        INDEX idx_user_id (user_id),
        INDEX idx_company_id (company_id),
        INDEX idx_staff_id (staff_id),
        INDEX idx_completion_date (completion_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `

    await executeQuery(createUserHistoryTableQuery)
    console.log('✅ user_history table created successfully')

    // Note: Using JSON field for products_used instead of separate junction table
    // This simplifies the design and provides better performance for our use case

    console.log('🎉 All user history tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating user history tables:', error)
    throw error
  }
}

// Run the script
createUserHistoryTable()
  .then(() => {
    console.log('✅ User history table creation completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ User history table creation failed:', error)
    process.exit(1)
  })

