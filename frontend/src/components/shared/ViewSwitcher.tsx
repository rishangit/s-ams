import React from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { ViewModule as GridViewIcon, ViewList as ListViewIcon, ViewComfy as CardViewIcon } from '@mui/icons-material'

export type ViewMode = 'grid' | 'list' | 'card'

interface ViewSwitcherProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  theme: {
    primary: string
    text: string
    border: string
  }
  showGrid?: boolean
  showList?: boolean
  showCard?: boolean
  className?: string
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  theme,
  showGrid = true,
  showList = true,
  showCard = true,
  className = ''
}) => {

  const getButtonStyle = (mode: ViewMode) => ({
    backgroundColor: 'transparent',
    color: viewMode === mode ? theme.primary : theme.text
  })

  const getIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'grid':
        return <GridViewIcon fontSize="small" />
      case 'list':
        return <ListViewIcon fontSize="small" />
      case 'card':
        return <CardViewIcon fontSize="small" />
      default:
        return null
    }
  }

  const getTooltipTitle = (mode: ViewMode) => {
    switch (mode) {
      case 'grid':
        return 'Grid View'
      case 'list':
        return 'List View'
      case 'card':
        return 'Card View'
      default:
        return ''
    }
  }

  return (
    <Box className={`flex items-center gap-2 ${className}`}>
      {showGrid && (
        <Tooltip title={getTooltipTitle('grid')}>
          <IconButton
            size="small"
            onClick={() => onViewModeChange('grid')}
            style={getButtonStyle('grid')}
            className="transition-all duration-200 hover:scale-110"
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'transparent'
              },
              '&.Mui-active': {
                backgroundColor: 'transparent'
              }
            }}
          >
            {getIcon('grid')}
          </IconButton>
        </Tooltip>
      )}
      
      {showList && (
        <Tooltip title={getTooltipTitle('list')}>
          <IconButton
            size="small"
            onClick={() => onViewModeChange('list')}
            style={getButtonStyle('list')}
            className="transition-all duration-200 hover:scale-110"
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'transparent'
              },
              '&.Mui-active': {
                backgroundColor: 'transparent'
              }
            }}
          >
            {getIcon('list')}
          </IconButton>
        </Tooltip>
      )}
      
      {showCard && (
        <Tooltip title={getTooltipTitle('card')}>
          <IconButton
            size="small"
            onClick={() => onViewModeChange('card')}
            style={getButtonStyle('card')}
            className="transition-all duration-200 hover:scale-110"
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'transparent'
              },
              '&.Mui-active': {
                backgroundColor: 'transparent'
              }
            }}
          >
            {getIcon('card')}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default ViewSwitcher
