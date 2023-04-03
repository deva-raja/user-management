import { useMutation, useQuery } from '@tanstack/react-query'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

type TEmail = {
  email: string
}

const post = async (values: TEmail) => {
  const { data } = await supabase.from(dbRoutes['users']).select().eq('email', values.email)

  return data
}

const get = async () => {
  const { data } = await supabase.from(dbRoutes['users']).select()

  return data
}

export const usePostGstRates = () => {
  return useMutation((data: TEmail) => post(data))
}

export const useGetUsers = () => {
  return useQuery([dbRoutes['users']], () => get())
}
