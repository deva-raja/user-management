import { useMutation, useQuery } from '@tanstack/react-query'
import { ITaskCollabs } from '@type/task_collabs'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

export type TCollabsParams = {
  id?: number
  user_id?: number
  task_id?: number
  status?: number
}

export type TCollabs = any

const get = async (taskId?: number) => {
  const { data } = await supabase
    .from(dbRoutes['tasks_collabs'])
    .select(`*, users(*), tasks(*), collab_status(*)`)
    .order('id', { ascending: false })
    .eq('task_id', taskId)

  return data as unknown as ITaskCollabs[]
}

const post = async (values: TCollabsParams) => {
  const { data } = await supabase.from(dbRoutes['tasks_collabs']).insert(values).select()

  return data
}

const patch = async (values: TCollabsParams) => {
  const id = values.id
  delete values['id']
  const response = await supabase.from(dbRoutes['tasks_collabs']).update(values).eq('id', id)

  return response.data
}

const remove = async ({ id }: { id: number }) => {
  const { data } = await supabase.from(dbRoutes['tasks_collabs']).delete().eq('id', id)

  return data
}

export const usePostCollabs = () => {
  return useMutation((data: TCollabsParams) => post(data))
}

export const usePatchCollabs = () => {
  return useMutation((data: TCollabsParams) => patch(data))
}

export const useDeleteCollabs = () => {
  return useMutation(({ id }: { id: number }) => remove({ id }))
}

export const useGetCollabs = (taskId?: number) => {
  return useQuery([dbRoutes['tasks_collabs']], () => get(taskId), {
    enabled: Boolean(taskId),
    cacheTime: 0
  })
}
