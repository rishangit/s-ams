import { executeQuery } from '../database/mysql/database.js'
import { 
  calendarViewToString, 
  dataViewToString, 
  themeModeToString,
  stringToCalendarView,
  stringToDataView,
  stringToThemeMode
} from '../constants/viewTypes.js'

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id

    const query = `
      SELECT 
        id,
        user_id,
        calendar_view,
        appointments_view,
        services_view,
        staff_view,
        products_view,
        users_view,
        companies_view,
        categories_view,
        theme_mode,
        theme_primary_color,
        compact_mode,
        created_at,
        updated_at
      FROM user_settings 
      WHERE user_id = ?
    `

    const results = await executeQuery(query, [userId])

    if (results.length === 0) {
      // Create default settings if none exist
      const defaultSettings = {
        user_id: userId,
        calendar_view: 0, // MONTH
        appointments_view: 0, // GRID
        services_view: 0, // GRID
        staff_view: 0, // GRID
        products_view: 0, // GRID
        users_view: 0, // GRID
        companies_view: 0, // GRID
        categories_view: 0, // GRID
        theme_mode: 0, // LIGHT
        theme_primary_color: '#1976d2',
        compact_mode: false
      }

      const insertQuery = `
        INSERT INTO user_settings (
          user_id, calendar_view, appointments_view, services_view, 
          staff_view, products_view, users_view, companies_view, categories_view, theme_mode, 
          theme_primary_color, compact_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const insertValues = [
        defaultSettings.user_id,
        defaultSettings.calendar_view,
        defaultSettings.appointments_view,
        defaultSettings.services_view,
        defaultSettings.staff_view,
        defaultSettings.products_view,
        defaultSettings.users_view,
        defaultSettings.companies_view,
        defaultSettings.categories_view,
        defaultSettings.theme_mode,
        defaultSettings.theme_primary_color,
        defaultSettings.compact_mode
      ]

      await executeQuery(insertQuery, insertValues)

      // Return the created settings with enum values converted to strings
      const newResults = await executeQuery(query, [userId])
      const settings = newResults[0]
      
      const responseData = {
        ...settings,
        calendar_view: calendarViewToString(settings.calendar_view),
        appointments_view: dataViewToString(settings.appointments_view),
        services_view: dataViewToString(settings.services_view),
        staff_view: dataViewToString(settings.staff_view),
        products_view: dataViewToString(settings.products_view),
        users_view: dataViewToString(settings.users_view),
        companies_view: dataViewToString(settings.companies_view),
        theme_mode: themeModeToString(settings.theme_mode)
      }
      
      return res.status(200).json({
        success: true,
        data: responseData
      })
    }

    // Convert enum values to strings for API response
    const settings = results[0]
    const responseData = {
      ...settings,
      calendar_view: calendarViewToString(settings.calendar_view),
      appointments_view: dataViewToString(settings.appointments_view),
      services_view: dataViewToString(settings.services_view),
      staff_view: dataViewToString(settings.staff_view),
      products_view: dataViewToString(settings.products_view),
      users_view: dataViewToString(settings.users_view),
      companies_view: dataViewToString(settings.companies_view),
      categories_view: dataViewToString(settings.categories_view),
      theme_mode: themeModeToString(settings.theme_mode)
    }
    
    res.status(200).json({
      success: true,
      data: responseData
    })
  } catch (error) {
    console.error('Error getting user settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user settings',
      error: error.message
    })
  }
}

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      calendar_view,
      appointments_view,
      services_view,
      staff_view,
      products_view,
      users_view,
      companies_view,
      categories_view,
      theme_mode,
      theme_primary_color,
      compact_mode
    } = req.body

    // Convert string values to enum numbers
    const convertedSettings = {
      calendar_view: calendar_view ? stringToCalendarView(calendar_view) : 0,
      appointments_view: appointments_view ? stringToDataView(appointments_view) : 0,
      services_view: services_view ? stringToDataView(services_view) : 0,
      staff_view: staff_view ? stringToDataView(staff_view) : 0,
      products_view: products_view ? stringToDataView(products_view) : 0,
      users_view: users_view ? stringToDataView(users_view) : 0,
      companies_view: companies_view ? stringToDataView(companies_view) : 0,
      categories_view: categories_view ? stringToDataView(categories_view) : 0,
      theme_mode: theme_mode ? stringToThemeMode(theme_mode) : 0,
      theme_primary_color: theme_primary_color || '#1976d2',
      compact_mode: compact_mode || false
    }

    // Check if settings exist
    const checkQuery = 'SELECT id FROM user_settings WHERE user_id = ?'
    const existingSettings = await executeQuery(checkQuery, [userId])

    let result

    if (existingSettings.length === 0) {
      // Create new settings
      const insertQuery = `
        INSERT INTO user_settings (
          user_id, calendar_view, appointments_view, services_view, 
          staff_view, products_view, users_view, companies_view, categories_view, theme_mode, 
          theme_primary_color, compact_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const insertValues = [
        userId,
        convertedSettings.calendar_view,
        convertedSettings.appointments_view,
        convertedSettings.services_view,
        convertedSettings.staff_view,
        convertedSettings.products_view,
        convertedSettings.users_view,
        convertedSettings.companies_view,
        convertedSettings.categories_view,
        convertedSettings.theme_mode,
        convertedSettings.theme_primary_color,
        convertedSettings.compact_mode
      ]

      result = await executeQuery(insertQuery, insertValues)
    } else {
      // Update existing settings
      const updateFields = []
      const updateValues = []

      if (calendar_view !== undefined) {
        updateFields.push('calendar_view = ?')
        updateValues.push(convertedSettings.calendar_view)
      }
      if (appointments_view !== undefined) {
        updateFields.push('appointments_view = ?')
        updateValues.push(convertedSettings.appointments_view)
      }
      if (services_view !== undefined) {
        updateFields.push('services_view = ?')
        updateValues.push(convertedSettings.services_view)
      }
      if (staff_view !== undefined) {
        updateFields.push('staff_view = ?')
        updateValues.push(convertedSettings.staff_view)
      }
      if (products_view !== undefined) {
        updateFields.push('products_view = ?')
        updateValues.push(convertedSettings.products_view)
      }
      if (users_view !== undefined) {
        updateFields.push('users_view = ?')
        updateValues.push(convertedSettings.users_view)
      }
      if (companies_view !== undefined) {
        updateFields.push('companies_view = ?')
        updateValues.push(convertedSettings.companies_view)
      }
      if (categories_view !== undefined) {
        updateFields.push('categories_view = ?')
        updateValues.push(convertedSettings.categories_view)
      }
      if (theme_mode !== undefined) {
        updateFields.push('theme_mode = ?')
        updateValues.push(convertedSettings.theme_mode)
      }
      if (theme_primary_color !== undefined) {
        updateFields.push('theme_primary_color = ?')
        updateValues.push(convertedSettings.theme_primary_color)
      }
      if (compact_mode !== undefined) {
        updateFields.push('compact_mode = ?')
        updateValues.push(convertedSettings.compact_mode)
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        })
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP')
      updateValues.push(userId)

      const updateQuery = `
        UPDATE user_settings 
        SET ${updateFields.join(', ')} 
        WHERE user_id = ?
      `

      result = await executeQuery(updateQuery, updateValues)
    }

    // Get updated settings
    const getQuery = `
      SELECT 
        id,
        user_id,
        calendar_view,
        appointments_view,
        services_view,
        staff_view,
        products_view,
        users_view,
        companies_view,
        categories_view,
        theme_mode,
        theme_primary_color,
        compact_mode,
        created_at,
        updated_at
      FROM user_settings 
      WHERE user_id = ?
    `

    const updatedSettings = await executeQuery(getQuery, [userId])
    const settings = updatedSettings[0]
    
    // Convert enum values to strings for API response
    const responseData = {
      ...settings,
      calendar_view: calendarViewToString(settings.calendar_view),
      appointments_view: dataViewToString(settings.appointments_view),
      services_view: dataViewToString(settings.services_view),
      staff_view: dataViewToString(settings.staff_view),
      products_view: dataViewToString(settings.products_view),
      users_view: dataViewToString(settings.users_view),
      companies_view: dataViewToString(settings.companies_view),
      categories_view: dataViewToString(settings.categories_view),
      theme_mode: themeModeToString(settings.theme_mode)
    }

    res.status(200).json({
      success: true,
      message: 'User settings updated successfully',
      data: responseData
    })
  } catch (error) {
    console.error('Error updating user settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user settings',
      error: error.message
    })
  }
}

// Reset user settings to defaults
export const resetUserSettings = async (req, res) => {
  try {
    const userId = req.user.id

    const deleteQuery = 'DELETE FROM user_settings WHERE user_id = ?'
    await executeQuery(deleteQuery, [userId])

    // Create default settings
    const insertQuery = `
      INSERT INTO user_settings (
        user_id, calendar_view, appointments_view, services_view, 
        staff_view, products_view, users_view, companies_view, categories_view, theme_mode, 
        theme_primary_color, compact_mode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const insertValues = [
      userId,
      0,          // calendar_view (MONTH)
      0,          // appointments_view (GRID)
      0,          // services_view (GRID)
      0,          // staff_view (GRID)
      0,          // products_view (GRID)
      0,          // users_view (GRID)
      0,          // companies_view (GRID)
      0,          // categories_view (GRID)
      0,          // theme_mode (LIGHT)
      '#1976d2',  // theme_primary_color
      false       // compact_mode
    ]

    await executeQuery(insertQuery, insertValues)

    // Get the reset settings
    const getQuery = `
      SELECT 
        id,
        user_id,
        calendar_view,
        appointments_view,
        services_view,
        staff_view,
        products_view,
        users_view,
        companies_view,
        categories_view,
        theme_mode,
        theme_primary_color,
        compact_mode,
        created_at,
        updated_at
      FROM user_settings 
      WHERE user_id = ?
    `

    const resetSettings = await executeQuery(getQuery, [userId])
    const settings = resetSettings[0]
    
    // Convert enum values to strings for API response
    const responseData = {
      ...settings,
      calendar_view: calendarViewToString(settings.calendar_view),
      appointments_view: dataViewToString(settings.appointments_view),
      services_view: dataViewToString(settings.services_view),
      staff_view: dataViewToString(settings.staff_view),
      products_view: dataViewToString(settings.products_view),
      users_view: dataViewToString(settings.users_view),
      companies_view: dataViewToString(settings.companies_view),
      categories_view: dataViewToString(settings.categories_view),
      theme_mode: themeModeToString(settings.theme_mode)
    }

    res.status(200).json({
      success: true,
      message: 'User settings reset to defaults successfully',
      data: responseData
    })
  } catch (error) {
    console.error('Error resetting user settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reset user settings',
      error: error.message
    })
  }
}

