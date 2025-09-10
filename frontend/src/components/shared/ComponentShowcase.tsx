import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../hooks/useTheme'
import CustomButton from './CustomButton'
import CustomCard from './CustomCard'
import CustomInput from './CustomInput'
import CustomModal from './CustomModal'
import CustomTabs from './CustomTabs'
import CustomAlert from './CustomAlert'
import CustomBadge from './CustomBadge'
import CustomSelect from './CustomSelect'
import CustomCheckbox from './CustomCheckbox'
import CustomRadio from './CustomRadio'
import CustomSwitch from './CustomSwitch'
import CustomSlider from './CustomSlider'
import CustomProgress from './CustomProgress'
import CustomSkeleton from './CustomSkeleton'
import CustomTooltip from './CustomTooltip'
import CustomMenu from './CustomMenu'
import CustomTable from './CustomTable'
import CustomPagination from './CustomPagination'
import CustomBreadcrumbs from './CustomBreadcrumbs'

const ComponentShowcase: React.FC = () => {
  const { theme, toggle } = useTheme()

  const components = [
    { name: 'Button', component: <CustomButton />, description: 'Customizable buttons with different variants' },
    { name: 'Card', component: <CustomCard />, description: 'Material UI cards with enhanced styling' },
    { name: 'Input', component: <CustomInput />, description: 'Form inputs with validation states' },
    { name: 'Modal', component: <CustomModal />, description: 'Dialog modals with backdrop' },
    { name: 'Tabs', component: <CustomTabs />, description: 'Tab navigation components' },
    { 
      name: 'Alert', 
      component: (
        <Stack spacing={2} className="w-full">
          <CustomAlert 
            severity="success" 
            message="This is a success alert — check it out!" 
            show={true}
          />
          <CustomAlert 
            severity="info" 
            message="This is an info alert — check it out!" 
            show={true}
          />
          <CustomAlert 
            severity="warning" 
            message="This is a warning alert — check it out!" 
            show={true}
          />
          <CustomAlert 
            severity="error" 
            message="This is an error alert — check it out!" 
            show={true}
          />
        </Stack>
      ), 
      description: 'Alert messages with different severities' 
    },
    { name: 'Badge', component: <CustomBadge />, description: 'Badge components for notifications' },
    { name: 'Select', component: <CustomSelect />, description: 'Dropdown select components' },
    { name: 'Checkbox', component: <CustomCheckbox />, description: 'Checkbox inputs with labels' },
    { name: 'Radio', component: <CustomRadio />, description: 'Radio button groups' },
    { name: 'Switch', component: <CustomSwitch />, description: 'Toggle switch components' },
    { name: 'Slider', component: <CustomSlider />, description: 'Range slider components' },
    { name: 'Progress', component: <CustomProgress />, description: 'Progress indicators' },
    { name: 'Skeleton', component: <CustomSkeleton />, description: 'Loading skeleton components' },
    { name: 'Tooltip', component: <CustomTooltip />, description: 'Tooltip components' },
    { name: 'Menu', component: <CustomMenu />, description: 'Dropdown menu components' },
    { name: 'Table', component: <CustomTable />, description: 'Data table components' },
    { name: 'Pagination', component: <CustomPagination />, description: 'Pagination controls' },
    { name: 'Breadcrumbs', component: <CustomBreadcrumbs />, description: 'Navigation breadcrumbs' },
  ]

  return (
    <Container maxWidth="xl" className="py-8">
      <Box className="mb-8">
        <Box className="flex justify-between items-center mb-4">
          <Typography 
            variant="h3" 
            component="h1" 
            className="font-bold"
            style={{ color: theme.text }}
          >
            Component Showcase
          </Typography>
          <Tooltip title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton 
              onClick={toggle}
              className="transition-colors duration-200"
              style={{ 
                color: theme.text,
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`
              }}
            >
              {theme.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography 
          variant="h6" 
          className="mb-2"
          style={{ color: theme.textSecondary }}
        >
          Material UI Components with Tailwind CSS Styling
        </Typography>
        
        <Stack direction="row" spacing={2} className="mb-4">
          <Chip 
            label={`Theme: ${theme.mode}`} 
            color="primary" 
            style={{ backgroundColor: theme.primary, color: '#fff' }}
          />
          <Chip 
            label="Redux + RxJS" 
            color="secondary"
            style={{ backgroundColor: theme.secondary, color: '#fff' }}
          />
          <Chip 
            label="TypeScript" 
            color="info"
            style={{ backgroundColor: theme.border, color: theme.text }}
          />
        </Stack>
        
        <Divider style={{ backgroundColor: theme.divider }} className="mb-6" />
      </Box>

      <Grid container spacing={4}>
        {components.map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Paper 
              elevation={2} 
              className="p-6 hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.text
              }}
            >
              <Typography 
                variant="h6" 
                className="mb-3 font-semibold"
                style={{ color: theme.text }}
              >
                {item.name}
              </Typography>
              <Typography 
                variant="body2" 
                className="mb-4"
                style={{ color: theme.textSecondary }}
              >
                {item.description}
              </Typography>
              <Box className="flex justify-center">
                {item.component}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ComponentShowcase
