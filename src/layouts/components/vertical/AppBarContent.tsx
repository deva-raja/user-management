// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Notification from '@components/engagespot/attachment'
import { Engagespot } from '@engagespot/react-component'
import { useEffect, useState } from 'react'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

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
    const user = JSON.parse(localStorage.getItem('user') as string)
    const email = user?.email
    setUniqueId(email ?? '')
  }, [])

  const theme = {
    colors: {
      brandingPrimary: '#7367F0',
      colorPrimary: '#7367F0'
    },
    feedItem: {
      imageSize: '48px',
      imageRadius: '16px',
      hoverBackground: '#fbf7ff',
      notificationDot: '#7053dd'
    },
    panel: {
      width: '380px'
    },
    unreadBadgeCount: {
      background: '#7053dd',
      color: '#7053dd'
    }
  }

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
          <div id='engagespot_container'>
            <Engagespot
              theme={theme}
              apiKey={process.env.NEXT_PUBLIC_ENGAGESPOT_KEY}
              userId={uniqueId}
              hideNotificationAvatar={true}
              renderNotificationBody={notification => {
                return (
                  <>
                    <Notification notification={notification} />
                  </>
                )
              }}
            />
          </div>
        )}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
