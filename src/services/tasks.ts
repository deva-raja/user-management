import { useMutation, useQuery } from '@tanstack/react-query'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

export type TTasksParams = {
  id?: string
  user_id: number
  task: string
}

export type TTasks = any

const get = async () => {
  const { data } = await supabase.from(dbRoutes['tasks']).select(`*, users(*)`)

  return data
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

const remove = async ({ id }: { id: string }) => {
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
  return useMutation(({ id }: { id: string }) => remove({ id }))
}

export const useGetTasks = () => {
  return useQuery([dbRoutes['tasks']], () => get())
}
