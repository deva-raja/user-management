export interface ITasks {
  id: number
  created_at: string
  task: string
  user_id: number
  attachment?: string
  users: Users
  task_status: {
    id: number
    name: string
  }
}

interface Users {
  id: number
  created_at: string
  email: string
  password: string
  role: number
  name: string
}
