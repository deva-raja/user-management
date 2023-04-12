import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { TTasks } from '@services/tasks'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import ChatContent from 'src/views/pages/home/ChatContent'

const TaskChat = ({ handleBack, selectedItem }: { handleBack: () => void; selectedItem: null | TTasks['data'][0] }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  return (
    <Grid item xs={12}>
      <Card>
        <Button
          sx={{ marginTop: '1.5rem', marginLeft: '1.5rem', marginBottom: '1.5rem' }}
          onClick={handleBack}
          variant='outlined'
        >
          <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
          <span style={{ marginLeft: '.5rem' }}>Back</span>
        </Button>

        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'background.paper',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <ChatContent selectedItem={selectedItem} />
        </Box>
      </Card>
    </Grid>
  )
}

TaskChat.contentHeightFixed = true

export default TaskChat
