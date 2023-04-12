import { SyntheticEvent, useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { usePostTaskComment } from '@services/task_comments'
import { useQueryClient } from '@tanstack/react-query'
import useCustomToast from '@components/toast'
import { errorMessageParser } from '@utils/error'
import { TTasks } from '@services/tasks'
import { dbRoutes } from 'src/configs/db'
import Icon from 'src/@core/components/icon'
import { useGetUser } from 'src/hooks/useGetUser'
import { useGetAcceptedCollabs } from '@services/task_collab'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { engageSpotTemplates, notificationTypes, recipientIds, userRoles } from 'src/configs/general'

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

const Form = styled('form')()

const SendMsgForm = ({
  selectedItem,
  isInNotification = false,
  setReplySend
}: {
  selectedItem: null | TTasks['data'][0]
  isInNotification?: boolean
  setReplySend?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const user = useGetUser()
  const [msg, setMsg] = useState<string>('')
  const post = usePostTaskComment()
  const queryClient = useQueryClient()
  const toast = useCustomToast()
  const collabs = useGetAcceptedCollabs(selectedItem?.id)
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const theme = useTheme()

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    const collaboratorsEmail = collabs?.data
      ?.map(collab => collab.users.email)
      ?.filter((email: string) => email !== user?.email)

    const notificationData = {
      recipients: [
        ...(user.role !== userRoles['super_admin'] ? [recipientIds['admin']] : []),
        ...(user.id !== selectedItem?.user_id && selectedItem?.users.email ? [selectedItem?.users.email] : []),
        ...(collaboratorsEmail ?? [])
      ],
      notification: {
        templateId: engageSpotTemplates['comments']
      },
      data: {
        title: `New comment added to task`,
        message: `${selectedItem?.task}`,
        notificationType: notificationTypes['task_comment'],
        sendBy: user?.name,
        comment: msg,
        task: selectedItem
      }
    }

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

          sendEngageSpotNotification.mutate(notificationData, {
            onSuccess: () => {
              setReplySend?.(true)
            }
          })
        },
        onError: err => {
          const errMsg = errorMessageParser(err)
          toast.error(errMsg)
        }
      })
    }
  }

  return (
    <Form
      sx={{
        padding: isInNotification ? 0 : theme.spacing(0, 5, 5)
      }}
      onSubmit={handleSendMsg}
    >
      <ChatFormWrapper
        sx={{
          backgroundColor: isInNotification ? `${theme.palette.customColors.lightPaperBg} !important` : 'inherit'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            value={msg}
            size='small'
            placeholder={isInNotification ? 'Reply…' : 'Enter your comment…'}
            onChange={e => setMsg(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': { boxShadow: 'none' }
              },
              '& .MuiOutlinedInput-input': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& fieldset': { border: '0 !important' },
              input: {
                color: isInNotification ? `${theme.palette.grey['700']} !important` : 'inherit'
              }
            }}
          />
        </Box>

        {!isInNotification && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'transparent !important'
              },
              width: 'auto'
            }}
          >
            <Button
              sx={{
                minWidth: '20px !important'
              }}
              disabled={post.isLoading}
              type='submit'
              variant='contained'
            >
              Send
              <Icon
                style={{
                  transform: 'rotate(45deg)',
                  marginLeft: '0.5rem'
                }}
                fontSize='1.125rem'
                icon='tabler:send'
              />
            </Button>
          </Box>
        )}

        {isInNotification && (
          <button type='submit'>
            <Icon
              style={{
                transform: 'rotate(45deg)',
                marginLeft: '0.5rem',
                color: theme.palette.primary.main,
                marginRight: '0.5rem'
              }}
              fontSize='1.125rem'
              icon='tabler:send'
            />
          </button>
        )}
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
