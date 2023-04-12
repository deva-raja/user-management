import { SyntheticEvent, useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = () => {
  const [msg, setMsg] = useState<string>('')

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()

    // do api call to send message and then invalidate
    setMsg('')
  }

  return (
    <Form onSubmit={handleSendMsg}>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            value={msg}
            size='small'
            placeholder='Type your message here…'
            onChange={e => setMsg(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': { boxShadow: 'none' }
              },
              '& .MuiOutlinedInput-input': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& fieldset': { border: '0 !important' }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type='submit' variant='contained'>
            Send
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
