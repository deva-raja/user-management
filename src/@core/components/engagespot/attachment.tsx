import Icon from 'src/@core/components/icon'
import { getFilesPublicUrl } from '@services/file'

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
  return (
    <>
      <p style={{ fontSize: '14px', color: '#cec7d5', fontWeight: '600', marginBottom: '4px' }}>Admin</p>
      <p style={{ fontSize: '16px', color: '#55516b', fontWeight: '500', marginBottom: '4px' }}>
        {`${notification?.data?.title} - ${notification?.data?.message}`}
      </p>
      {notification?.data?.attachment && (
        <NotificationActionItems notificationAttachment={notification.data.attachment} />
      )}
      <p style={{ fontSize: '11px', color: '#888888' }}>{notification.time}</p>
    </>
  )
}

export default Notification
