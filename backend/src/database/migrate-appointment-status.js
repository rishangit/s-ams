import { getDatabase } from './sqlite/database.js'
import { APPOINTMENT_STATUS, getStatusId } from '../constants/appointmentStatus.js'

// Migration script to convert appointment status from string to integer
export const migrateAppointmentStatus = async () => {
  const db = getDatabase()
  
  try {
    console.log('🔄 Starting appointment status migration...')
    
    // Check if status column is already integer type
    const tableInfo = await db.all("PRAGMA table_info(appointments)")
    const statusColumn = tableInfo.find(col => col.name === 'status')
    
    if (statusColumn && statusColumn.type === 'INTEGER') {
      console.log('✅ Status column is already INTEGER type')
      return
    }
    
    // Create backup table
    console.log('📋 Creating backup table...')
    await db.run(`
      CREATE TABLE appointments_backup AS 
      SELECT * FROM appointments
    `)
    
    // Drop original table
    console.log('🗑️ Dropping original table...')
    await db.run('DROP TABLE appointments')
    
    // Recreate table with integer status
    console.log('🔨 Recreating table with integer status...')
    await db.run(`
      CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        company_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (company_id) REFERENCES companies (id),
        FOREIGN KEY (service_id) REFERENCES services (id)
      )
    `)
    
    // Migrate data with status conversion
    console.log('📦 Migrating data with status conversion...')
    const backupData = await db.all('SELECT * FROM appointments_backup')
    
    for (const appointment of backupData) {
      const statusId = getStatusId(appointment.status) || APPOINTMENT_STATUS.PENDING
      
      await db.run(`
        INSERT INTO appointments (
          id, user_id, company_id, service_id, appointment_date, 
          appointment_time, status, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        appointment.id,
        appointment.user_id,
        appointment.company_id,
        appointment.service_id,
        appointment.appointment_date,
        appointment.appointment_time,
        statusId,
        appointment.notes,
        appointment.created_at,
        appointment.updated_at
      ])
    }
    
    // Drop backup table
    console.log('🧹 Cleaning up backup table...')
    await db.run('DROP TABLE appointments_backup')
    
    console.log('✅ Appointment status migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    
    // Try to restore from backup if it exists
    try {
      const backupExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments_backup'")
      if (backupExists) {
        console.log('🔄 Restoring from backup...')
        await db.run('DROP TABLE IF EXISTS appointments')
        await db.run('ALTER TABLE appointments_backup RENAME TO appointments')
        console.log('✅ Restored from backup')
      }
    } catch (restoreError) {
      console.error('❌ Failed to restore from backup:', restoreError)
    }
    
    throw error
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAppointmentStatus()
    .then(() => {
      console.log('🎉 Migration completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}
