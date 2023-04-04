import { useMutation } from '@tanstack/react-query'
import { bucketRoutes } from 'src/configs/db'
import supabase from 'src/configs/supabase'
import { v4 as uuidv4 } from 'uuid'

export const post = async (fileToUpload: File) => {
  const fileName = uuidv4()
  const { data } = await supabase.storage.from(bucketRoutes['files']).upload(fileName, fileToUpload)

  return data
}

export const getFilesPublicUrl = (fileName: string) => {
  const { data } = supabase.storage.from(bucketRoutes['files']).getPublicUrl(fileName)

  return data
}

export const deleteFile = (fileName: string) => {
  return supabase.storage.from(bucketRoutes['files']).remove([fileName])
}

export const useHandleFileUpload = () => {
  return useMutation((data: File) => post(data))
}

export const useHandleFileDelete = () => {
  return useMutation((data: string) => deleteFile(data))
}
