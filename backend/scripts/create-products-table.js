import { executeQuery, initializeDatabase } from '../src/database/mysql/database.js'

const createProductsTable = async () => {
  try {
    console.log('Initializing database connection...')
    await initializeDatabase()
    
    console.log('Creating products table...')
    
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        unit VARCHAR(50),
        unit_price DECIMAL(10, 2) NOT NULL,
        quantity INT DEFAULT 0,
        min_quantity INT DEFAULT 0,
        max_quantity INT,
        status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
        company_id INT NOT NULL,
        supplier VARCHAR(255),
        sku VARCHAR(100),
        barcode VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        INDEX idx_company_id (company_id),
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_sku (sku),
        INDEX idx_barcode (barcode),
        UNIQUE KEY unique_company_sku (company_id, sku),
        UNIQUE KEY unique_company_barcode (company_id, barcode)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
    
    await executeQuery(query)
    console.log('✅ Products table created successfully!')
    
    // Create service_products junction table for many-to-many relationship
    console.log('Creating service_products junction table...')
    
    const serviceProductsQuery = `
      CREATE TABLE IF NOT EXISTS service_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity_required DECIMAL(10, 2) DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_service_product (service_id, product_id),
        INDEX idx_service_id (service_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
    
    await executeQuery(serviceProductsQuery)
    console.log('✅ Service_products junction table created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating products table:', error)
    throw error
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createProductsTable()
    .then(() => {
      console.log('🎉 Products table migration completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { createProductsTable }
