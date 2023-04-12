import { useMutation, useQuery } from '@tanstack/react-query'
import { ITaskChat } from '@type/chat'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

type TTaskChatData = {
  comment: string
  user_id: number
  task_id: number
}

const get = async (id?: number) => {
  const { data } = await supabase
    .from(dbRoutes['task_comments'])
    .select(`*, users(*), tasks(*)`)
    .order('id')
    .eq('task_id', id)

  return data as unknown as ITaskChat[]
}

const post = async (values: TTaskChatData) => {
  const { data } = await supabase.from(dbRoutes['task_comments']).insert(values).select()

  return data
}

export const useGetTaskComments = (id?: number) => {
  return useQuery([dbRoutes['task_comments'], id], () => get(id), {
    enabled: !!id
  })
}

export const usePostTaskComment = () => {
  return useMutation((data: TTaskChatData) => post(data))
}
