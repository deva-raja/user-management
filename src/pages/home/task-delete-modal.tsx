import DeleteModalBody from '@components/modals/delete-modal-body'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { useHandleFileDelete } from '@services/file'
import { TTasks } from '@services/tasks'
import { useGetAcceptedCollabs } from '@services/task_collab'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { errorMessageParser } from 'src/@core/utils/error'
import { engageSpotTemplates, notificationTypes } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'
import useCustomToast from '../../@core/components/toast'

const TaskDeleteModal = ({
  open,
  remove,
  setOpen,
  routeToInvalidate,
  itemToRemove
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  remove: UseMutationResult<null, unknown, { id: number }, unknown>
  itemToRemove: TTasks['data'][0] | null
  routeToInvalidate: string
}) => {
  const toast = useCustomToast()
  const handleClose = () => setOpen(false)
  const queryClient = useQueryClient()
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const deleteFile = useHandleFileDelete()
  const user = useGetUser()
  const collabs = useGetAcceptedCollabs(itemToRemove?.id)

  const handleSubmit = () => {
    if (!itemToRemove) return

    const data = {
      id: itemToRemove?.id
    }

    const email = itemToRemove?.users.email
    const collaboratorsEmail = collabs?.data?.map(collab => collab.users.email)

    if (!email) return

    const notificationData = {
      recipients: [email, ...(collaboratorsEmail ?? [])],
      notification: {
        templateId: engageSpotTemplates['tasks']
      },
      data: {
        title: `Removed the task`,
        message: itemToRemove?.task,
        notificationType: notificationTypes['task_deleted'],
        sendBy: user?.name
      }
    }

    remove.mutate(data, {
      onSuccess: () => {
        if (itemToRemove?.attachment) {
          deleteFile.mutate(itemToRemove.attachment, {
            onError: err => {
              const errMsg = errorMessageParser(err)
              toast.error(errMsg)
            }
          })
        }

        return sendEngageSpotNotification.mutate(notificationData, {
          onSuccess: () => {
            handleClose()
            toast.success('delete success')
            queryClient.invalidateQueries([routeToInvalidate])
          },
          onError: err => {
            const errMsg = errorMessageParser(err)
            toast.error(errMsg)
          }
        })
      },
      onError: err => {
        const errMsg = errorMessageParser(err)
        toast.error(errMsg)
      }
    })
  }

  return <DeleteModalBody handleClose={handleClose} handleSubmit={handleSubmit} open={open} />
}

export default TaskDeleteModal
