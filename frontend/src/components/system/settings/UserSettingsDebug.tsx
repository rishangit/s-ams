import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { Box, Typography, Paper } from '@mui/material'

const UserSettingsDebug: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { settings, loading, error, updating } = useSelector((state: RootState) => state.userSettings)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Paper 
      elevation={1} 
      style={{ 
        padding: '16px', 
        margin: '16px 0',
        backgroundColor: uiTheme.surface,
        border: `1px solid ${uiTheme.border}`
      }}
    >
      <Typography variant="h6" style={{ color: uiTheme.text, marginBottom: '16px' }}>
        User Settings Debug Info
      </Typography>
      
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>User:</strong> {user ? `${user.firstName} ${user.lastName} (ID: ${user.id})` : 'Not logged in'}
        </Typography>
        
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>Token:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Missing'}
        </Typography>
        
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>Updating:</strong> {updating ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>Error:</strong> {error || 'None'}
        </Typography>
        
        <Typography variant="body2" style={{ color: uiTheme.text }}>
          <strong>Settings:</strong> {settings ? 'Loaded' : 'Not loaded'}
        </Typography>
        
        {settings && (
          <Box style={{ marginTop: '8px' }}>
            <Typography variant="body2" style={{ color: uiTheme.text }}>
              <strong>Settings Data:</strong>
            </Typography>
            <pre style={{ 
              fontSize: '12px', 
              color: uiTheme.textSecondary, 
              backgroundColor: uiTheme.background,
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(settings, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default UserSettingsDebug


