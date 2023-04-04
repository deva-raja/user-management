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
        backgroundColor: '#e8e6fd',
        color: '#7367F0',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={handleRedirect}
    >
      <Icon icon='tabler:link' fontSize={16} style={{ marginRight: '4px' }} />
      attachment
    </button>
  )
}

// ** Styled component for the subtitle in MenuItems

function Notification({ notification }: any) {
  return (
    <>
      <p style={{ fontSize: '14px', marginBottom: '6px' }}>{notification.heading}</p>
      <p style={{ fontSize: '12px' }}>{notification.data.message}</p>
      <NotificationActionItems notificationAttachment={notification.data.attachment} />
      <p style={{ fontSize: '11px', color: '#888888' }}>{notification.time}</p>
    </>
  )
}

export default Notification
