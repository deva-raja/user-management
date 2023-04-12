import ButtonSpinner from '@components/spinner/ButtonSpinner'
import useCustomToast from '@components/toast'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { getFilesPublicUrl } from '@services/file'
import { usePatchCollabs } from '@services/task_collab'
import { useQueryClient } from '@tanstack/react-query'
import { errorMessageParser } from '@utils/error'
import SendMsgForm from '@views/pages/home/SendMsgForm'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { dbRoutes } from 'src/configs/db'
import { collabStatus, engageSpotTemplates, notificationTypes, recipientIds } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'

function NotificationActionItems({ notificationAttachment }: { notificationAttachment: string }) {
  const attachmentPublicUrl = getFilesPublicUrl(notificationAttachment)

  const handleRedirect = () => {
    window.open(attachmentPublicUrl.publicUrl, '_blank')
  }

  return (
    <button
      style={{
        margin: '10px 0',
        backgroundColor: '#7367F0',
        color: 'white',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={handleRedirect}
    >
      <Icon icon='tabler:link' fontSize={16} style={{ marginRight: '4px' }} />
      view attachment
    </button>
  )
}

// ** Styled component for the subtitle in MenuItems

function Notification({ notification }: any) {
  const acceptPatchCollabs = usePatchCollabs()
  const rejectPatchCollabs = usePatchCollabs()
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const [collabActionResult, setCollabActionResult] = useState('')
  const [replySend, setReplySend] = useState(false)
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const user = useGetUser()

  const finalActions = {
    onError: (err: any) => {
      const errMsg = errorMessageParser(err)
      toast.error(errMsg)
    }
  }

  const sendNotification = ({
    title,
    message,
    notificationType,
    sendBy,
    recipients
  }: {
    title: string
    message: string
    notificationType: string
    sendBy: string
    recipients: string[]
  }) => {
    const notificationData = {
      recipients,
      notification: {
        templateId: engageSpotTemplates['tasks']
      },
      data: {
        title,
        message,
        notificationType,
        sendBy
      }
    }

    console.log('firing')

    return sendEngageSpotNotification.mutate(notificationData)
  }

  const handleCollabAction = (type: 'accepted' | 'rejected') => {
    if (acceptPatchCollabs.isLoading || rejectPatchCollabs.isLoading) return

    if (type === 'accepted') {
      return acceptPatchCollabs.mutate(
        { id: notification?.data?.task_collab?.[0]?.id, status: collabStatus[type] },
        {
          onSuccess: () => {
            toast.success(`accepted successfull`)
            queryClient.invalidateQueries([dbRoutes.tasks])
            setCollabActionResult('accepted')
            sendNotification({
              title: 'Accepted Collaboration for the task',
              message: notification?.data?.message,
              notificationType: notificationTypes['task_collab_accepted'],
              sendBy: user?.name,
              recipients: [notification?.data?.task?.users?.email, recipientIds['admin']]
            })
          },
          onError: finalActions['onError']
        }
      )
    }

    if (type === 'rejected') {
      return rejectPatchCollabs.mutate(
        { id: notification?.data?.task_collab?.[0]?.id, status: collabStatus[type] },
        {
          onSuccess: () => {
            toast.success(`rejected successfull`)
            queryClient.invalidateQueries([dbRoutes.tasks])
            setCollabActionResult('rejected')
            sendNotification({
              title: 'Rejected Collaboration for the task',
              message: notification?.data?.message,
              notificationType: notificationTypes['task_collab_rejected'],
              sendBy: user?.name,
              recipients: [notification?.data?.task?.users?.email, recipientIds['admin']]
            })
          },

          onError: finalActions['onError']
        }
      )
    }
  }

  return (
    <>
      <p
        style={{
          fontSize: '14px',
          color: '#cec7d5',
          fontWeight: '600',
          marginBottom: '4px',
          textTransform: 'capitalize'
        }}
      >
        {notification?.data?.sendBy ?? ''}
      </p>

      <p style={{ fontSize: '16px', color: '#55516b', fontWeight: '500', marginBottom: '4px' }}>
        {`${notification?.data?.title}  ${notification?.data?.message ? `- ${notification?.data?.message}` : ''}`}
      </p>

      {notification?.data?.attachment && (
        <NotificationActionItems notificationAttachment={notification.data.attachment} />
      )}

      {!collabActionResult && notification?.data?.notificationType === notificationTypes['task_collab_request'] && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            margin: '.5rem 0'
          }}
        >
          <Button
            onClick={() => handleCollabAction('accepted')}
            style={{ backgroundColor: '#655BD3' }}
            size='small'
            color='primary'
            variant='contained'
            disabled={acceptPatchCollabs.isLoading}
          >
            Accept
            {acceptPatchCollabs.isLoading && <ButtonSpinner left='6px' />}
          </Button>

          <Button
            onClick={() => handleCollabAction('rejected')}
            style={{ backgroundColor: '#CE4A4B' }}
            size='small'
            color='error'
            variant='contained'
            disabled={rejectPatchCollabs.isLoading}
          >
            Reject
            {rejectPatchCollabs.isLoading && <ButtonSpinner left='6px' />}
          </Button>
        </div>
      )}

      {collabActionResult && (
        <p
          style={{
            fontSize: '15px',
            color: `${collabActionResult === 'accepted' ? '#7367F0' : '#CE4A4B'}`,
            fontWeight: '500',
            margin: '4px 0'
          }}
        >
          Collaboration {collabActionResult}
        </p>
      )}

      {!collabActionResult && notification?.data?.notificationType === notificationTypes['task_status_change'] && (
        <div>
          <div
            style={{
              fontSize: '13px',
              margin: '.5rem 0',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <CustomChip
              rounded
              typeof='success'
              skin='light'
              label={notification?.data?.statusData?.from?.toUpperCase()}
              color={'secondary'}
              style={{ padding: '0 1rem' }}
            />
            <Icon color='#55516b' fontSize='1.125rem' icon='tabler:arrow-right' />
            <CustomChip
              rounded
              typeof='success'
              skin='light'
              label={notification?.data?.statusData?.to?.toUpperCase()}
              color={'primary'}
              style={{ padding: '0 1rem' }}
            />
          </div>
        </div>
      )}

      {!collabActionResult &&
        notification?.data?.notificationType === notificationTypes['task_status_change'] &&
        notification?.data?.statusData?.to === 'approved' && (
          <div style={{ margin: '1rem 0' }} className='image_show_container'>
            <img style={{ maxWidth: '100%' }} src='/images/success.gif' alt='approved' />
          </div>
        )}

      {notification?.data?.notificationType === notificationTypes['task_comment'] && (
        <>
          {!replySend && (
            <Box
              sx={{
                backgroundColor: 'rgba(168, 170, 174, 0.16)',
                borderRadius: '8px',
                p: '8px 12px !important',
                my: '16px !important',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#55516b',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}
              >
                {`Latest Comment - ${notification?.data?.comment}`}
              </Typography>

              <SendMsgForm
                setReplySend={setReplySend}
                isInNotification={true}
                selectedItem={notification?.data?.task}
              />
            </Box>
          )}

          {replySend && (
            <p
              style={{
                fontSize: '15px',
                color: `${'#7367F0'}`,
                fontWeight: '500',
                margin: '4px 0'
              }}
            >
              Reply Send
            </p>
          )}
        </>
      )}

      <p style={{ fontSize: '11px', color: '#888888' }}>{notification.time}</p>
    </>
  )
}

export default Notification
