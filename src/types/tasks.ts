export interface ITasks {
  id: number
  created_at: string
  task: string
  user_id: number
  attachment?: string
  users: Users
}

interface Users {
  id: number
  created_at: string
  email: string
  password: string
  role: number
  name: string
}
