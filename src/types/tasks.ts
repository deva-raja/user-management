export interface ITasks {
  id: number
  created_at: string
  task: string
  user_id: number
  attachment?: any
  status: number
  users: Users
  task_status: Taskstatus
  tasks_collabs: Taskscollab[]
}

interface Taskscollab {
  id: number
  created_at: string
  user_id: number
  task_id: number
  status: number
}

interface Taskstatus {
  id: number
  created_at: string
  name: string
  uniq_id: number
}

interface Users {
  id: number
  created_at: string
  email: string
  password: string
  role: number
  name: string
}
