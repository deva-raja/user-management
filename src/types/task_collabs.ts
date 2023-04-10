export interface ITaskCollabs {
  id: number
  created_at: string
  user_id: number
  task_id: number
  status: number
  users: Users
  tasks: Tasks
  collab_status: Collabstatus
}

interface Collabstatus {
  id: number
  created_at: string
  name: string
  uniq_id: number
}

interface Tasks {
  id: number
  created_at: string
  task: string
  user_id: number
  attachment?: any
}

interface Users {
  id: number
  created_at: string
  email: string
  password: string
  role: number
  name: string
}
