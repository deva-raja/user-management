import { useMutation } from '@tanstack/react-query'
import { axiosEngageSpotInstance } from 'src/axios/axiosEngageSpotInstance'

export interface IEngageSpotCreateUser {
  identifier: string
  profile?: {}
}

export interface IEngageSpotSendNotification {
  notification?: {
    title?: string
    message?: string
    icon?: string
    url?: string
    templateId?: number
  }
  recipients: string[]
  data?: any
  override?: {
    title: string
  }
}

const createUser = async (values: IEngageSpotCreateUser) => {
  const { data } = await axiosEngageSpotInstance.post(`/users`, values)

  return data
}

const sendNotification = async (values: IEngageSpotSendNotification) => {
  const { data } = await axiosEngageSpotInstance.post(`/notifications`, values)

  return data
}

export const useCreateEngageSpotUser = () => {
  return useMutation((data: IEngageSpotCreateUser) => createUser(data))
}

export const useSendEngageSpotNotification = () => {
  return useMutation((data: IEngageSpotSendNotification) => sendNotification(data))
}
