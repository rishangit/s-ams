import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import { store } from './store/index.ts'
import './index.css'

// Create a theme provider component that reads from Redux
const ThemedApp: React.FC = () => {
  const theme = store.getState().ui.theme

  const muiTheme = createTheme({
    palette: {
      mode: theme.mode,
      primary: {
        main: theme.primary,
      },
      secondary: {
        main: theme.secondary,
      },
      background: {
        default: theme.background,
        paper: theme.surface,
      },
      text: {
        primary: theme.text,
        secondary: theme.textSecondary,
      },
      divider: theme.divider,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: theme.background,
            color: theme.text,
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

// Clear any existing content to prevent conflicts
container.innerHTML = ''

const root = ReactDOM.createRoot(container)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemedApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
