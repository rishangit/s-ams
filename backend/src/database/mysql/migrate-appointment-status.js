import { executeQuery } from './database.js'
import { APPOINTMENT_STATUS, getStatusId } from '../../constants/appointmentStatus.js'

// Migration script to convert appointment status from string to integer (MySQL)
export const migrateAppointmentStatus = async () => {
  try {
    console.log('🔄 Starting appointment status migration (MySQL)...')
    
    // Check if status column is already integer type
    const columnInfo = await executeQuery(`
      SELECT DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'appointments' 
      AND COLUMN_NAME = 'status'
    `)
    
    if (columnInfo.length > 0 && columnInfo[0].DATA_TYPE === 'int') {
      console.log('✅ Status column is already INTEGER type')
      return
    }
    
    // Create backup table
    console.log('📋 Creating backup table...')
    await executeQuery(`
      CREATE TABLE appointments_backup AS 
      SELECT * FROM appointments
    `)
    
    // Add temporary integer status column
    console.log('🔨 Adding temporary integer status column...')
    await executeQuery(`
      ALTER TABLE appointments 
      ADD COLUMN status_int INT DEFAULT 0
    `)
    
    // Update status_int with converted values
    console.log('📦 Converting status values...')
    const appointments = await executeQuery('SELECT id, status FROM appointments')
    
    for (const appointment of appointments) {
      const statusId = getStatusId(appointment.status) || APPOINTMENT_STATUS.PENDING
      await executeQuery(
        'UPDATE appointments SET status_int = ? WHERE id = ?',
        [statusId, appointment.id]
      )
    }
    
    // Drop original status column
    console.log('🗑️ Dropping original status column...')
    await executeQuery('ALTER TABLE appointments DROP COLUMN status')
    
    // Rename status_int to status
    console.log('🔄 Renaming status_int to status...')
    await executeQuery('ALTER TABLE appointments CHANGE COLUMN status_int status INT NOT NULL DEFAULT 0')
    
    // Drop backup table
    console.log('🧹 Cleaning up backup table...')
    await executeQuery('DROP TABLE appointments_backup')
    
    console.log('✅ Appointment status migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    
    // Try to restore from backup if it exists
    try {
      const backupExists = await executeQuery(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'appointments_backup'
      `)
      
      if (backupExists.length > 0) {
        console.log('🔄 Restoring from backup...')
        await executeQuery('DROP TABLE IF EXISTS appointments')
        await executeQuery('RENAME TABLE appointments_backup TO appointments')
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
