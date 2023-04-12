import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TTasks } from '@services/tasks'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'

const ChatContent = ({ selectedItem }: { selectedItem: null | TTasks['data'][0] }) => {
  const renderContent = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'action.hover'
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500 }}>{'Comments'}</Typography>
                <Typography sx={{ color: 'text.disabled' }}>{`Task - ${selectedItem?.task}`}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <ChatLog selectedItem={selectedItem} />
        <SendMsgForm selectedItem={selectedItem} />
      </Box>
    )
  }

  return renderContent()
}

export default ChatContent
