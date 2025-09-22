import { initializeDatabase, executeQuery } from '../src/database/mysql/database.js'

const addCompaniesViewMigration = async () => {
  try {
    console.log('Starting companies_view migration...')
    
    // Check if companies_view column already exists
    const checkColumnQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'user_settings' 
      AND COLUMN_NAME = 'companies_view'
    `
    
    const existingColumns = await executeQuery(checkColumnQuery)
    
    if (existingColumns.length > 0) {
      console.log('companies_view column already exists, skipping migration')
      return
    }
    
    // Add companies_view column
    console.log('Adding companies_view column to user_settings table...')
    await executeQuery(`
      ALTER TABLE user_settings 
      ADD COLUMN companies_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card' 
      AFTER users_view
    `)
    
    console.log('companies_view column added successfully')
    
    // Update existing records to have default value
    console.log('Updating existing records with default companies_view value...')
    await executeQuery(`
      UPDATE user_settings 
      SET companies_view = 0 
      WHERE companies_view IS NULL
    `)
    
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Error during companies_view migration:', error)
    throw error
  }
}

const runMigration = async () => {
  try {
    await initializeDatabase()
    await addCompaniesViewMigration()
    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
