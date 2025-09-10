import React, { useState } from 'react'
import { Tabs, Tab, Box, Typography } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="p-3">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const CustomTabs: React.FC = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box className="w-full max-w-md">
      <Box className="border-b border-gray-200">
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example"
          className="bg-white"
        >
          <Tab label="Tab 1" className="text-gray-700" />
          <Tab label="Tab 2" className="text-gray-700" />
          <Tab label="Tab 3" className="text-gray-700" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Content for Tab 1
      </TabPanel>
      <TabPanel value={value} index={1}>
        Content for Tab 2
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Tab 3
      </TabPanel>
    </Box>
  )
}

export default CustomTabs
