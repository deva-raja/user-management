import Icon from 'src/@core/components/icon'
import { getFilesPublicUrl } from '@services/file'
import { Button } from '@mui/material'
import { usePatchCollabs } from '@services/task_collab'
import { collabStatus, notificationTypes } from 'src/configs/general'
import ButtonSpinner from '@components/spinner/ButtonSpinner'
import useCustomToast from '@components/toast'
import { errorMessageParser } from '@utils/error'
import { useQueryClient } from '@tanstack/react-query'
import { dbRoutes } from 'src/configs/db'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

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
  // console.log(notification)

  const acceptPatchCollabs = usePatchCollabs()
  const rejectPatchCollabs = usePatchCollabs()
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const [collabActionResult, setCollabActionResult] = useState('')

  const finalActions = {
    onError: (err: any) => {
      const errMsg = errorMessageParser(err)
      toast.error(errMsg)
    }
  }

  const handleCollabAction = (type: 'accepted' | 'rejected') => {
    if (acceptPatchCollabs.isLoading || rejectPatchCollabs.isLoading) return

    if (type === 'accepted')
      acceptPatchCollabs.mutate(
        { id: notification?.data?.task_collab?.[0]?.id, status: collabStatus[type] },
        {
          onSuccess: () => {
            toast.success(`accepted successfull`)
            queryClient.invalidateQueries([dbRoutes.tasks])
            setCollabActionResult('accepted')
          },
          onError: finalActions['onError']
        }
      )

    if (type === 'rejected')
      rejectPatchCollabs.mutate(
        { id: notification?.data?.task_collab?.[0]?.id, status: collabStatus[type] },
        {
          onSuccess: () => {
            toast.success(`rejected successfull`)
            queryClient.invalidateQueries([dbRoutes.tasks])
            setCollabActionResult('rejected')
          },

          onError: finalActions['onError']
        }
      )
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

      <p style={{ fontSize: '11px', color: '#888888' }}>{notification.time}</p>
    </>
  )
}

export default Notification
