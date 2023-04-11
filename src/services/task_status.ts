import { useQuery } from '@tanstack/react-query'
import { ITaskStatus } from '@type/task_status'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

const get = async () => {
  const { data } = await supabase.from(dbRoutes['task_status']).select().order('id', { ascending: false })

  return data as unknown as ITaskStatus[]
}

export const useGetTaskStatus = () => {
  return useQuery([dbRoutes['task_status']], () => get())
}
