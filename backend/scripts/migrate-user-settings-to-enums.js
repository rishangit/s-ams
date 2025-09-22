import { initializeDatabase, executeQuery } from '../src/database/index.js'

const migrateUserSettingsToEnums = async () => {
  try {
    console.log('Starting user settings migration to enums...')
    
    // First, create a backup of existing data
    console.log('Creating backup of existing user settings...')
    const existingSettings = await executeQuery('SELECT * FROM user_settings')
    console.log(`Found ${existingSettings.length} existing user settings records`)
    
    // Drop the existing table
    console.log('Dropping existing user_settings table...')
    await executeQuery('DROP TABLE IF EXISTS user_settings')
    
    // Create the new table with TINYINT columns
    console.log('Creating new user_settings table with enum values...')
    await executeQuery(`
      CREATE TABLE user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        calendar_view TINYINT DEFAULT 0 COMMENT '0=month, 1=week, 2=day',
        appointments_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        services_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        staff_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        products_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        users_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        companies_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card',
        theme_mode TINYINT DEFAULT 0 COMMENT '0=light, 1=dark',
        theme_primary_color VARCHAR(7) DEFAULT '#1976d2',
        compact_mode BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // Migrate existing data if any
    if (existingSettings.length > 0) {
      console.log('Migrating existing data to new format...')
      
      for (const setting of existingSettings) {
        // Convert string values to enum numbers
        const calendarView = convertCalendarViewToEnum(setting.calendar_view)
        const appointmentsView = convertDataViewToEnum(setting.appointments_view)
        const servicesView = convertDataViewToEnum(setting.services_view)
        const staffView = convertDataViewToEnum(setting.staff_view)
        const productsView = convertDataViewToEnum(setting.products_view)
        const usersView = convertDataViewToEnum(setting.users_view)
        const themeMode = convertThemeModeToEnum(setting.theme_mode)
        
        await executeQuery(`
          INSERT INTO user_settings (
            user_id, calendar_view, appointments_view, services_view, 
            staff_view, products_view, users_view, theme_mode, 
            theme_primary_color, compact_mode, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          setting.user_id,
          calendarView,
          appointmentsView,
          servicesView,
          staffView,
          productsView,
          usersView,
          themeMode,
          setting.theme_primary_color || '#1976d2',
          setting.compact_mode || false,
          setting.created_at,
          setting.updated_at
        ])
      }
      
      console.log(`Successfully migrated ${existingSettings.length} user settings records`)
    }
    
    console.log('User settings migration completed successfully!')
    
  } catch (error) {
    console.error('Error during user settings migration:', error)
    throw error
  }
}

// Helper functions to convert string values to enum numbers
const convertCalendarViewToEnum = (view) => {
  switch (view) {
    case 'month': return 0
    case 'week': return 1
    case 'day': return 2
    default: return 0
  }
}

const convertDataViewToEnum = (view) => {
  switch (view) {
    case 'grid': return 0
    case 'list': return 1
    case 'card': return 2
    default: return 0
  }
}

const convertThemeModeToEnum = (mode) => {
  switch (mode) {
    case 'light': return 0
    case 'dark': return 1
    default: return 0
  }
}

const runMigration = async () => {
  try {
    await initializeDatabase()
    await migrateUserSettingsToEnums()
    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
