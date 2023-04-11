import { useMutation, useQuery } from '@tanstack/react-query'
import { ITasks } from '@type/tasks'
import { dbRoutes } from 'src/configs/db'
import { collabStatus, userRoles } from 'src/configs/general'
import supabase from 'src/configs/supabase'

export type TTasksParams = {
  id?: number
  user_id: number
  task: string
  attachment?: string | null
  status?: number
}

export type TTasks = { data: ITasks[] }

const get = async () => {
  const user = JSON.parse(localStorage.getItem('user') as string)
  const id = user?.id
  const role = user?.role

  // if admin
  if (Number(role) === userRoles['super_admin']) {
    const { data } = await supabase
      .from(dbRoutes['tasks'])
      .select(`*, users(*), task_status(*)`)
      .order('id', { ascending: false })

    return data as unknown as TTasks['data']
  }

  // if client
  const { data: taskCollabData } = await supabase
    .from(dbRoutes['tasks'])
    .select(`*, users(*), task_status(*), tasks_collabs!inner (*)`)
    .order('id', { ascending: false })
    .filter('tasks_collabs.user_id', 'eq', id)
    .filter('tasks_collabs.status', 'eq', collabStatus['accepted'])

  const { data } = await supabase
    .from(dbRoutes['tasks'])
    .select(`*, users(*), task_status(*), tasks_collabs!inner (*)`)
    .order('id', { ascending: false })
    .filter('user_id', 'eq', id)

  return [...(taskCollabData ?? []), ...(data ?? [])] as unknown as TTasks['data']
}

const post = async (values: TTasksParams) => {
  const { data } = await supabase.from(dbRoutes['tasks']).insert(values)

  return data
}

const patch = async (values: TTasksParams) => {
  const id = values.id
  delete values['id']
  const response = await supabase.from(dbRoutes['tasks']).update(values).eq('id', id)

  return response.data
}

const remove = async ({ id }: { id: number }) => {
  const { data } = await supabase.from(dbRoutes['tasks']).delete().eq('id', id)

  return data
}

export const usePostTasks = () => {
  return useMutation((data: TTasksParams) => post(data))
}

export const usePatchTasks = () => {
  return useMutation((data: TTasksParams) => patch(data))
}

export const useDeleteTasks = () => {
  return useMutation(({ id }: { id: number }) => remove({ id }))
}

export const useGetTasks = () => {
  return useQuery([dbRoutes['tasks']], () => get())
}
