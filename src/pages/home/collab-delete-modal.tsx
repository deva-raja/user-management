import DeleteModalBody from '@components/modals/delete-modal-body'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { ITaskCollabs } from '@type/task_collabs'
import { errorMessageParser } from 'src/@core/utils/error'
import { engageSpotTemplates, notificationTypes } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'
import useCustomToast from '../../@core/components/toast'

const CollabDeleteModal = ({
  open,
  remove,
  setOpen,
  routeToInvalidate,
  itemToRemove
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  remove: UseMutationResult<null, unknown, { id: number }, unknown>
  itemToRemove: ITaskCollabs | null
  routeToInvalidate: string
}) => {
  const toast = useCustomToast()
  const handleClose = () => setOpen(false)
  const queryClient = useQueryClient()
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const user = useGetUser()

  const handleSubmit = () => {
    if (!itemToRemove) return

    const data = {
      id: itemToRemove?.id
    }

    const email = itemToRemove?.users.email
    if (!email) return

    const notificationData = {
      recipients: [email],
      notification: {
        templateId: engageSpotTemplates['tasks']
      },
      data: {
        title: `Unallocated from the task`,
        message: itemToRemove?.tasks,
        notificationType: notificationTypes['task_deleted'],
        sendBy: user?.name
      }
    }

    remove.mutate(data, {
      onSuccess: () => {
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

export default CollabDeleteModal
