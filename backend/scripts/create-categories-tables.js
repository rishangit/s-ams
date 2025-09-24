import { initializeDatabase, executeQuery } from '../src/database/mysql/database.js'

const createCategoriesTables = async () => {
  try {
    console.log('Creating categories and subcategories tables...')
    
    // Create categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        color VARCHAR(7) DEFAULT '#6366f1',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
    
    await executeQuery(createCategoriesTable)
    console.log('Categories table created successfully')
    
    // Create subcategories table
    const createSubcategoriesTable = `
      CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        color VARCHAR(7) DEFAULT '#6366f1',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_category_subcategory (category_id, name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
    
    await executeQuery(createSubcategoriesTable)
    console.log('Subcategories table created successfully')
    
    // Add category_id and subcategory_id to companies table
    const addCategoryColumns = `
      ALTER TABLE companies 
      ADD COLUMN category_id INT NULL AFTER status,
      ADD COLUMN subcategory_id INT NULL AFTER category_id,
      ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      ADD FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
    `
    
    try {
      await executeQuery(addCategoryColumns)
      console.log('Category columns added to companies table successfully')
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('Category columns already exist in companies table')
      } else {
        throw error
      }
    }
    
    console.log('Categories and subcategories tables setup completed successfully')
  } catch (error) {
    console.error('Error creating categories tables:', error)
    throw error
  }
}

const runMigration = async () => {
  try {
    await initializeDatabase()
    await createCategoriesTables()
    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
