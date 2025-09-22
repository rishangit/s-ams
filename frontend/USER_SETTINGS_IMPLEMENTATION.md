# User Settings System Implementation

## Overview

A comprehensive user settings system has been implemented that allows users to customize their preferred view modes for different sections of the application and manage theme settings. The system supports all user roles (0, 1, 2, 3) and automatically loads settings when users log in.

## Features

### View Preferences
- **Calendar View**: Month, Week, Day
- **Appointments View**: Grid, List, Card
- **Services View**: Grid, List, Card
- **Staff View**: Grid, List, Card
- **Products View**: Grid, List, Card
- **Users View**: Grid, List, Card

### Theme Settings
- **Theme Mode**: Light, Dark
- **Compact Mode**: Enable/Disable
- **Primary Color**: Customizable (future enhancement)

## Database Schema

### user_settings Table
```sql
CREATE TABLE user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  calendar_view ENUM('month', 'week', 'day') DEFAULT 'month',
  appointments_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
  services_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
  staff_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
  products_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
  users_view ENUM('grid', 'list', 'card') DEFAULT 'grid',
  theme_mode ENUM('light', 'dark') DEFAULT 'light',
  theme_primary_color VARCHAR(7) DEFAULT '#1976d2',
  compact_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_settings (user_id)
);
```

## API Endpoints

### GET /api/user-settings
- **Description**: Get user settings
- **Authentication**: Required
- **Response**: User settings object or default settings if none exist

### PUT /api/user-settings
- **Description**: Update user settings
- **Authentication**: Required
- **Body**: Partial settings object
- **Response**: Updated settings object

### POST /api/user-settings/reset
- **Description**: Reset settings to defaults
- **Authentication**: Required
- **Response**: Default settings object

## Redux Integration

### Actions
- `getUserSettingsRequest()` - Load user settings
- `updateUserSettingsRequest(payload)` - Update settings
- `resetUserSettingsRequest()` - Reset to defaults
- `setCalendarView(view)` - Set calendar view (local)
- `setAppointmentsView(view)` - Set appointments view (local)
- `setServicesView(view)` - Set services view (local)
- `setStaffView(view)` - Set staff view (local)
- `setProductsView(view)` - Set products view (local)
- `setUsersView(view)` - Set users view (local)
- `setThemeMode(mode)` - Set theme mode (local)
- `setCompactMode(enabled)` - Set compact mode (local)

### State Structure
```typescript
interface UserSettingsState {
  settings: UserSettings | null
  loading: boolean
  error: string | null
  updating: boolean
  lastUpdated: number | null
}
```

## Usage Examples

### 1. Using the useViewMode Hook

```typescript
import { useViewMode } from '../hooks/useViewMode'

const MyComponent = () => {
  const { 
    appointmentsView, 
    servicesView, 
    getViewMode,
    themeMode,
    compactMode 
  } = useViewMode()

  // Get specific view mode
  const currentView = getViewMode('appointments')
  
  return (
    <div>
      <p>Current appointments view: {appointmentsView}</p>
      <p>Theme mode: {themeMode}</p>
      <p>Compact mode: {compactMode ? 'Enabled' : 'Disabled'}</p>
    </div>
  )
}
```

### 2. Using the ViewModeSelector Component

```typescript
import { ViewModeSelector } from '../components/shared'
import { useViewMode } from '../hooks/useViewMode'

const AppointmentsPage = () => {
  const { appointmentsView } = useViewMode()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Appointments</h1>
        <ViewModeSelector 
          section="appointments"
          currentView={appointmentsView}
          onViewChange={(view) => {
            console.log('View changed to:', view)
          }}
        />
      </div>
      
      {appointmentsView === 'grid' && <AppointmentsGridview />}
      {appointmentsView === 'list' && <AppointmentsListview />}
      {appointmentsView === 'card' && <AppointmentsCardview />}
    </div>
  )
}
```

### 3. Accessing Settings in Components

```typescript
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const MyComponent = () => {
  const { settings } = useSelector((state: RootState) => state.userSettings)
  
  if (!settings) {
    return <div>Loading settings...</div>
  }
  
  return (
    <div>
      <p>Calendar view: {settings.calendar_view}</p>
      <p>Appointments view: {settings.appointments_view}</p>
      <p>Theme: {settings.theme_mode}</p>
    </div>
  )
}
```

## Settings UI

The settings are accessible through the **Settings** page in the **UI** tab. Users can:

1. **View Preferences**: Select preferred view modes for each section
2. **Theme Settings**: Toggle dark mode and compact mode
3. **Save Changes**: Save settings to the database
4. **Reset to Defaults**: Restore default settings

## Automatic Loading

User settings are automatically loaded when:
- User logs in successfully
- User navigates to the Settings page
- Application initializes (if user is already authenticated)

## Integration with Existing Components

To integrate view mode settings with existing components:

1. **Import the hook**:
   ```typescript
   import { useViewMode } from '../hooks/useViewMode'
   ```

2. **Get the current view mode**:
   ```typescript
   const { getViewMode } = useViewMode()
   const currentView = getViewMode('appointments') // or 'services', 'staff', etc.
   ```

3. **Conditionally render components**:
   ```typescript
   {currentView === 'grid' && <GridView />}
   {currentView === 'list' && <ListView />}
   {currentView === 'card' && <CardView />}
   ```

4. **Add view mode selector** (optional):
   ```typescript
   import { ViewModeSelector } from '../components/shared'
   
   <ViewModeSelector 
     section="appointments"
     currentView={currentView}
   />
   ```

## File Structure

```
backend/
├── scripts/
│   └── create-user-settings-table.js
├── src/
│   ├── controllers/
│   │   └── userSettingsController.js
│   └── routes/
│       └── userSettings.js

frontend/
├── src/
│   ├── hooks/
│   │   └── useViewMode.ts
│   ├── components/
│   │   ├── shared/
│   │   │   └── ViewModeSelector.tsx
│   │   └── system/
│   │       └── settings/
│   │           └── Settings.tsx
│   └── store/
│       ├── actions/
│       │   └── userSettingsActions.ts
│       ├── epics/
│       │   └── userSettingsEpics.ts
│       └── reducers/
│           └── userSettingsSlice.ts
```

## Migration

To set up the user settings system:

1. **Run the database migration**:
   ```bash
   cd backend
   node scripts/create-user-settings-table.js
   ```

2. **Restart the backend server** to load the new routes

3. **The frontend will automatically load settings** when users log in

## Future Enhancements

- **Primary Color Customization**: Allow users to set custom primary colors
- **Layout Preferences**: Save window sizes, panel positions, etc.
- **Notification Settings**: Customize notification preferences
- **Accessibility Settings**: High contrast, font size, etc.
- **Export/Import Settings**: Allow users to backup and restore settings

## Troubleshooting

### Settings Not Loading
- Check if user is authenticated
- Verify database connection
- Check browser console for API errors

### Settings Not Saving
- Ensure user has proper permissions
- Check network connectivity
- Verify API endpoint is accessible

### View Modes Not Updating
- Check if Redux actions are being dispatched
- Verify component is using the useViewMode hook
- Ensure ViewModeSelector is properly connected


