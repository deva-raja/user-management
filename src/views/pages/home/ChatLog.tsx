import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { TTasks } from '@services/tasks'
import { useGetTaskComments } from '@services/task_comments'
import { ReactNode, Ref, useEffect, useRef } from 'react'
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useGetUser } from 'src/hooks/useGetUser'
import { ChatLogChatType, FormattedChatsType, ITaskChat, MessageGroupType } from 'src/types/chat'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

const ChatLog = ({ selectedItem }: { selectedItem: null | TTasks['data'][0] }) => {
  // ** Props
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const user = useGetUser()
  const getTaskComments = useGetTaskComments(selectedItem?.id)
  const data = getTaskComments.data

  // ** Ref
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = 1000
      }
    }
  }

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    // let chatLog: MessageType[] | [] = []

    let chatLog: ITaskChat[] | [] = []

    if (data) {
      chatLog = data
    }

    const formattedChatLog: FormattedChatsType[] = []

    let chatMessageSender = chatLog?.[0]?.users

    let msgGroup: MessageGroupType = {
      sender: chatMessageSender,
      messages: []
    }

    chatLog.forEach((msg: ITaskChat, index: number) => {
      if (chatMessageSender.id === msg.user_id) {
        msgGroup.messages.push({
          time: msg.created_at,
          msg: msg.comment
        })
      } else {
        chatMessageSender = msg.users

        formattedChatLog.push(msgGroup)
        msgGroup = {
          sender: msg.users,
          messages: [
            {
              time: msg.created_at,
              msg: msg.comment
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  useEffect(() => {
    if (data && data.length > 0) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // ** Renders user chat
  const renderChats = () => {
    if (getTaskComments.isLoading) return null

    return formattedChatData().map((item: FormattedChatsType, index: number) => {
      const isSender = item.sender.id === user.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: index !== formattedChatData().length - 1 ? 4 : undefined
          }}
        >
          <div>
            <CustomAvatar
              skin='light'
              sx={{
                width: 32,
                height: 32,
                fontSize: '1rem',
                ml: isSender ? 3 : undefined,
                mr: !isSender ? 3 : undefined
              }}
            >
              {getInitials(item.sender.name)}
            </CustomAvatar>
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
            {item.messages.map((chat: ChatLogChatType, index: number, { length }: { length: number }) => {
              const time = new Date(chat.time)

              return (
                <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                  <div>
                    <Typography
                      sx={{
                        boxShadow: 1,
                        borderRadius: 1,
                        width: 'fit-content',
                        p: theme => theme.spacing(2.25, 4),
                        ml: isSender ? 'auto' : undefined,
                        borderTopLeftRadius: !isSender ? 0 : undefined,
                        borderTopRightRadius: isSender ? 0 : undefined,
                        color: isSender ? 'common.white' : 'text.primary',
                        backgroundColor: isSender ? 'primary.main' : 'background.paper'
                      }}
                    >
                      {chat.msg}
                    </Typography>
                  </div>

                  {index + 1 === length ? (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSender ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {time
                          ? new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                          : null}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box
          sx={{ p: 5, height: '100%', minHeight: '50vh', maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden' }}
        >
          {children}
          <div ref={chatArea} />
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar
          style={{ minHeight: '50vh', maxHeight: '50vh', overflowY: 'auto' }}
          ref={chatArea}
          options={{ wheelPropagation: false }}
        >
          {children}
        </PerfectScrollbar>
      )
    }
  }

  return (
    <Box sx={{ height: 'calc(100% - 8.9375rem)' }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  )
}

export default ChatLog
