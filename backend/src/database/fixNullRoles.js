import { initializeDatabase, getDatabase } from './database.js'

const fixNullRoles = async () => {
  const db = getDatabase()

  try {
    // Update any users with null roles to have the default user role (3)
    const result = await db.run(`
      UPDATE users 
      SET role = 3, updated_at = CURRENT_TIMESTAMP
      WHERE role IS NULL
    `)

    console.log(`Fixed ${result.changes} users with null roles`)
    
    // Verify the fix
    const nullRoleUsers = await db.all(`
      SELECT id, email, role 
      FROM users 
      WHERE role IS NULL
    `)
    
    if (nullRoleUsers.length === 0) {
      console.log('✅ All users now have valid roles')
    } else {
      console.log(`⚠️  ${nullRoleUsers.length} users still have null roles`)
    }

  } catch (error) {
    console.error('Error fixing null roles:', error)
    throw error
  }
}

const runFix = async () => {
  try {
    await initializeDatabase()
    await fixNullRoles()
    console.log('Null roles fix completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Null roles fix failed:', error)
    process.exit(1)
  }
}

runFix()
