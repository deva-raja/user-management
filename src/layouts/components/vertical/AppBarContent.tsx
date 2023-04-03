// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { Engagespot } from '@engagespot/react-component'
import { useEffect, useState } from 'react'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const [uniqueId, setUniqueId] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('email')
    setUniqueId(email ?? '')
  }, [])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}

        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {process.env.NEXT_PUBLIC_ENGAGESPOT_KEY && !!uniqueId && (
          <Engagespot apiKey={process.env.NEXT_PUBLIC_ENGAGESPOT_KEY} userId={uniqueId}></Engagespot>
        )}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
