import { initializeDatabase, executeQuery } from '../src/database/mysql/database.js'

const seedCategoriesData = async () => {
  try {
    console.log('Seeding categories and subcategories data...')
    
    // Clear existing data
    await executeQuery('DELETE FROM subcategories')
    await executeQuery('DELETE FROM categories')
    console.log('Cleared existing categories data')
    
    // Categories and subcategories data
    const categoriesData = [
      {
        name: 'Personal Care & Beauty',
        description: 'Services related to personal grooming, beauty, and wellness',
        icon: 'spa',
        color: '#e91e63',
        subcategories: [
          { name: 'Hair Salon / Barber', description: 'Hair cutting, styling, and grooming services' },
          { name: 'Beauty Salon', description: 'Facial treatments, makeup, and beauty services' },
          { name: 'Nail Salon', description: 'Manicure, pedicure, and nail art services' },
          { name: 'Spa & Wellness Center', description: 'Relaxation, massage, and wellness treatments' },
          { name: 'Massage Therapy', description: 'Therapeutic and relaxation massage services' }
        ]
      },
      {
        name: 'Health & Wellness',
        description: 'Medical, dental, and health-related services',
        icon: 'local_hospital',
        color: '#4caf50',
        subcategories: [
          { name: 'Medical Clinics', description: 'General medical and specialized healthcare services' },
          { name: 'Dental Clinics', description: 'Dental care, orthodontics, and oral health services' },
          { name: 'Physiotherapy Centers', description: 'Physical therapy and rehabilitation services' },
          { name: 'Chiropractic Clinics', description: 'Spinal and musculoskeletal treatment services' },
          { name: 'Counseling / Therapy', description: 'Mental health and psychological counseling services' },
          { name: 'Nutrition & Diet', description: 'Nutritional counseling and diet planning services' },
          { name: 'Fitness Centers / Gyms', description: 'Exercise facilities and fitness training' },
          { name: 'Yoga / Pilates Studios', description: 'Yoga, Pilates, and mind-body fitness classes' }
        ]
      },
      {
        name: 'Automotive & Repair',
        description: 'Vehicle maintenance, repair, and automotive services',
        icon: 'directions_car',
        color: '#ff9800',
        subcategories: [
          { name: 'Car Service & Repair', description: 'Automotive maintenance and repair services' },
          { name: 'Car Wash & Detailing', description: 'Vehicle cleaning and detailing services' },
          { name: 'Motorcycle Service', description: 'Motorcycle maintenance and repair services' },
          { name: 'Tire Shops', description: 'Tire sales, installation, and repair services' }
        ]
      },
      {
        name: 'Home & Lifestyle Services',
        description: 'Home maintenance, cleaning, and lifestyle improvement services',
        icon: 'home',
        color: '#9c27b0',
        subcategories: [
          { name: 'Cleaning Services', description: 'Residential and commercial cleaning services' },
          { name: 'Pest Control', description: 'Pest management and extermination services' },
          { name: 'Home Repair & Maintenance', description: 'Home improvement and maintenance services' },
          { name: 'Appliance Repair', description: 'Home appliance repair and maintenance services' },
          { name: 'Gardening / Landscaping', description: 'Garden design, landscaping, and maintenance services' }
        ]
      },
      {
        name: 'Education & Training',
        description: 'Educational services, tutoring, and skill development',
        icon: 'school',
        color: '#2196f3',
        subcategories: [
          { name: 'Tutoring Centers', description: 'Academic tutoring and educational support services' },
          { name: 'Music / Art / Dance Schools', description: 'Creative arts and performing arts education' },
          { name: 'Coaching & Mentoring', description: 'Personal and professional coaching services' },
          { name: 'Language Classes', description: 'Language learning and communication skills training' }
        ]
      },
      {
        name: 'Professional Services',
        description: 'Business and professional consulting services',
        icon: 'business',
        color: '#607d8b',
        subcategories: [
          { name: 'Financial & Tax Consultants', description: 'Financial planning and tax advisory services' },
          { name: 'Legal Services (Lawyers, Notaries)', description: 'Legal advice and documentation services' },
          { name: 'Business Consultants', description: 'Business strategy and management consulting' },
          { name: 'Real Estate Agents', description: 'Property sales, rental, and real estate services' }
        ]
      },
      {
        name: 'Events & Entertainment',
        description: 'Event planning, entertainment, and creative services',
        icon: 'celebration',
        color: '#f44336',
        subcategories: [
          { name: 'Event Planners', description: 'Wedding, corporate, and special event planning services' },
          { name: 'Photographers / Videographers', description: 'Photography and videography services' },
          { name: 'Party & Catering Services', description: 'Event catering and party planning services' },
          { name: 'Studios (Music, Art, Recording)', description: 'Creative studios and recording facilities' }
        ]
      },
      {
        name: 'Hospitality & Travel',
        description: 'Accommodation, travel, and hospitality services',
        icon: 'hotel',
        color: '#795548',
        subcategories: [
          { name: 'Hotels & Resorts', description: 'Accommodation and hospitality services' },
          { name: 'Travel Agencies', description: 'Travel planning and booking services' },
          { name: 'Tour Guides', description: 'Tourism and sightseeing guide services' },
          { name: 'Transport & Shuttle Services', description: 'Transportation and shuttle services' }
        ]
      }
    ]
    
    // Insert categories and subcategories
    for (let i = 0; i < categoriesData.length; i++) {
      const category = categoriesData[i]
      
      // Insert category
      const categoryQuery = `
        INSERT INTO categories (name, description, icon, color, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `
      const categoryResult = await executeQuery(categoryQuery, [
        category.name,
        category.description,
        category.icon,
        category.color,
        i + 1
      ])
      
      const categoryId = categoryResult.insertId
      console.log(`Inserted category: ${category.name} (ID: ${categoryId})`)
      
      // Insert subcategories for this category
      for (let j = 0; j < category.subcategories.length; j++) {
        const subcategory = category.subcategories[j]
        
        const subcategoryQuery = `
          INSERT INTO subcategories (category_id, name, description, sort_order)
          VALUES (?, ?, ?, ?)
        `
        await executeQuery(subcategoryQuery, [
          categoryId,
          subcategory.name,
          subcategory.description,
          j + 1
        ])
        
        console.log(`  - Inserted subcategory: ${subcategory.name}`)
      }
    }
    
    console.log('Categories and subcategories data seeded successfully')
  } catch (error) {
    console.error('Error seeding categories data:', error)
    throw error
  }
}

const runSeed = async () => {
  try {
    await initializeDatabase()
    await seedCategoriesData()
    console.log('Seed completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

runSeed()
