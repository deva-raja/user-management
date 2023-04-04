// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import Icon from 'src/@core/components/icon'
import useCustomToast from '../toast'
import { errorMessageParser } from 'src/@core/utils/error'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { TTasks } from '@services/tasks'
import { useHandleFileDelete } from '@services/file'
import { engageSpotTemplates } from 'src/configs/general'

const DeleteConfirmModal = ({
  open,
  remove,
  setOpen,
  routeToInvalidate,
  itemToRemove
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  remove: UseMutationResult<null, unknown, { id: string }, unknown>
  itemToRemove: TTasks['data'][0]
  routeToInvalidate: string
}) => {
  // ** State

  const toast = useCustomToast()
  const handleClose = () => setOpen(false)
  const queryClient = useQueryClient()
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const deleteFile = useHandleFileDelete()

  const handleSubmit = () => {
    const data = {
      id: itemToRemove.id
    }

    const email = localStorage.getItem('email')
    if (!email) return

    const notificationData = {
      recipients: [email],
      notification: {
        templateId: engageSpotTemplates['tasks']
      },
      data: {
        title: `Admin remove the task`
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

  return (
    <Fragment>
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={() => {
          handleClose()
        }}
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogTitle style={{ marginBottom: '2rem' }} id='alert-dialog-title'>
          <Icon
            icon='tabler:trash'
            color='error'
            style={{ position: 'relative', top: '3px', marginRight: '6px', color: 'rgb(234, 84, 85)' }}
            fontSize='1.5rem'
          />
          Are you sure to delete ?
        </DialogTitle>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
          <Button disabled={remove.isLoading || deleteFile.isLoading} color='error' onClick={handleSubmit}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DeleteConfirmModal
