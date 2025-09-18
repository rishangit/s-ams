import React from 'react'
import {
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setSidebarOpen } from '../../store/reducers/uiSlice'
import { Navigation } from './navigation'
import { Header } from './header'

interface SystemLayoutProps {
  children: React.ReactNode
  title?: string
}

const drawerWidth = 250

const SystemLayout: React.FC<SystemLayoutProps> = ({
  children,
  title = 'S-AMS System'
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()

  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)

  const handleDrawerToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen))
  }

  return (
    <Box className="flex h-screen overflow-hidden w-full">
      {/* Navigation Component */}
      <Navigation
        drawerWidth={drawerWidth}
        mobileOpen={sidebarOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        className="flex-1 flex flex-col relative"
        style={{
          backgroundColor: uiTheme.background,
          marginLeft: isMobile ? 0 : drawerWidth,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          minWidth: 0,
          zIndex: 10
        }}
      >
        {/* Header Component */}
        <Header
          title={title}
          drawerWidth={drawerWidth}
          onDrawerToggle={handleDrawerToggle}
        />

        {/* Content Area */}
        <Box className="flex-1 overflow-auto p-4">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default SystemLayout
