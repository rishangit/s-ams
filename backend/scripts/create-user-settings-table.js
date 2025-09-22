import { initializeDatabase, executeQuery } from '../src/database/mysql/database.js'

const createUserSettingsTable = async () => {
  try {
    // Create user_settings table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        calendar_view ENUM('month', 'week', 'day') DEFAULT 'month',
        appointments_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        services_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        staff_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        products_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        users_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        companies_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
        theme_mode ENUM('light', 'dark') DEFAULT 'light',
        theme_primary_color VARCHAR(7) DEFAULT '#1976d2',
        compact_mode BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_settings (user_id),
        INDEX idx_user_settings_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('User settings table created successfully')
  } catch (error) {
    console.error('Error creating user settings table:', error)
    throw error
  }
}

const runMigration = async () => {
  try {
    await initializeDatabase()
    await createUserSettingsTable()
    console.log('User settings migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('User settings migration failed:', error)
    process.exit(1)
  }
}

runMigration()

