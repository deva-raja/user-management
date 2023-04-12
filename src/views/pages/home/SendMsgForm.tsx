import { SyntheticEvent, useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { usePostTaskComment } from '@services/task_comments'
import { useQueryClient } from '@tanstack/react-query'
import useCustomToast from '@components/toast'
import { errorMessageParser } from '@utils/error'
import { TTasks } from '@services/tasks'
import { dbRoutes } from 'src/configs/db'
import Icon from 'src/@core/components/icon'
import { useGetUser } from 'src/hooks/useGetUser'

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

const SendMsgForm = ({ selectedItem }: { selectedItem: null | TTasks['data'][0] }) => {
  const user = useGetUser()
  const [msg, setMsg] = useState<string>('')
  const post = usePostTaskComment()
  const queryClient = useQueryClient()
  const toast = useCustomToast()

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()

    if (!selectedItem) return toast.error('Please select a task first')

    if (msg.trim().length) {
      const data = {
        user_id: user.id,
        task_id: selectedItem.id,
        comment: msg
      }

      post.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries([dbRoutes['task_comments'], selectedItem?.id])
          setMsg('')
        },
        onError: err => {
          const errMsg = errorMessageParser(err)
          toast.error(errMsg)
        }
      })
    }
  }

  return (
    <Form onSubmit={handleSendMsg}>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            value={msg}
            size='small'
            placeholder='Enter your comment…'
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
          <Button disabled={post.isLoading} type='submit' variant='contained'>
            Send
            <Icon style={{ transform: 'rotate(45deg)', marginLeft: '0.5rem' }} fontSize='1.125rem' icon='tabler:send' />
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
