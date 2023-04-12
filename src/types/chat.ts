export type ChatLogChatType = {
  msg: string
  time: string | Date
}

export type MessageGroupType = {
  sender: Users
  messages: ChatLogChatType[]
}

export type FormattedChatsType = {
  sender: Users
  messages: ChatLogChatType[]
}

export interface ITaskChat {
  id: number
  created_at: string
  comment: string
  task_id: number
  user_id: number
  users: Users
  tasks: Tasks
}

interface Tasks {
  id: number
  created_at: string
  task: string
  user_id: number
  attachment?: any
  status: number
}

interface Users {
  id: number
  created_at: string
  email: string
  password: string
  role: number
  name: string
}
