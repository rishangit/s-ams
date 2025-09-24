import { executeQuery } from '../src/database/mysql/database.js'
import { initializeDatabase } from '../src/database/index.js'

const addCategoriesViewMigration = async () => {
  try {
    // Initialize database connection
    await initializeDatabase()
    console.log('Database initialized successfully')

    console.log('Adding categories_view column to user_settings table...')

    // Check if categories_view column already exists
    const columns = await executeQuery(`
      SHOW COLUMNS FROM user_settings LIKE 'categories_view';
    `)

    if (columns.length === 0) {
      // Add categories_view column
      await executeQuery(`
        ALTER TABLE user_settings
        ADD COLUMN categories_view TINYINT DEFAULT 0 COMMENT '0=grid, 1=list, 2=card' AFTER companies_view;
      `)
      console.log('categories_view column added successfully')

      // Update existing records where categories_view IS NULL to 0 (grid view)
      await executeQuery(`
        UPDATE user_settings 
        SET categories_view = 0 
        WHERE categories_view IS NULL;
      `)
      console.log('Updated existing records with default categories_view value')

      console.log('Categories view migration completed successfully')
    } else {
      console.log('categories_view column already exists, skipping migration')
    }
  } catch (error) {
    console.error('Error adding categories_view column:', error)
    process.exit(1)
  } finally {
    console.log('Migration completed')
  }
}

addCategoriesViewMigration()
