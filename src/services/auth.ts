import { useMutation, useQuery } from '@tanstack/react-query'
import { dbRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'

type TLogin = {
  email: string
}

type TRegister = {
  email: string
}

const login = async (values: TLogin) => {
  const { data } = await supabase.from(dbRoutes['users']).select().eq('email', values.email)

  return data
}

const register = async (values: TRegister) => {
  const { data } = await supabase.from(dbRoutes['users']).insert(values).select()

  return data
}

const get = async () => {
  const { data } = await supabase.from(dbRoutes['users']).select()

  return data
}

export const usePostLogin = () => {
  return useMutation((data: TLogin) => login(data))
}

export const usePostRegister = () => {
  return useMutation((data: TRegister) => register(data))
}

export const useGetUsers = () => {
  return useQuery([dbRoutes['users']], () => get())
}
