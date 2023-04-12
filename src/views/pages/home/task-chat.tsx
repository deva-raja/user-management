import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useSettings } from 'src/@core/hooks/useSettings'
import ChatContent from 'src/views/pages/home/ChatContent'

const TaskChat = () => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  return (
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
      <ChatContent />
    </Box>
  )
}

TaskChat.contentHeightFixed = true

export default TaskChat
