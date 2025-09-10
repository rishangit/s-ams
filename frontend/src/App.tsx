import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from './store'
import { getProfileRequest } from './store/actions'
import ComponentShowcase from './components/shared/ComponentShowcase'
import { SystemRoutes } from './components/system/routing'

function App() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.ui.theme)
  const { isAuthenticated, user, loading, profileRequestInProgress } = useSelector((state: RootState) => state.auth)

  // Initialize user profile if authenticated but user data is missing
  useEffect(() => {
    if (isAuthenticated && !user && !loading && !profileRequestInProgress) {
      dispatch(getProfileRequest())
    }
  }, [isAuthenticated, user, loading, profileRequestInProgress, dispatch])

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <Routes>
        {/* Root redirect to system */}
        <Route path="/" element={<Navigate to="/system" replace />} />
        
        {/* Showcase routes */}
        <Route path="/showcase" element={<ComponentShowcase />} />
        
        {/* System Routes - all system functionality */}
        <Route path="/system/*" element={<SystemRoutes />} />
        
        {/* Catch all route - redirect to system */}
        <Route path="*" element={<Navigate to="/system" replace />} />
      </Routes>
    </div>
  )
}

export default App
