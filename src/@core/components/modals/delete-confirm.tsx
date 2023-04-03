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

const DeleteConfirmModal = ({
  open,
  remove,
  setOpen,
  routeToInvalidate,
  idToRemove
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  remove: UseMutationResult<null, unknown, { id: string }, unknown>
  idToRemove: string
  routeToInvalidate: string
}) => {
  // ** State

  const toast = useCustomToast()
  const handleClose = () => setOpen(false)
  const queryClient = useQueryClient()

  const handleSubmit = () => {
    const data = {
      id: idToRemove
    }

    remove.mutate(data, {
      onSuccess: () => {
        toast.success('delete success')
        handleClose()
        queryClient.invalidateQueries([routeToInvalidate])
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
          <Button disabled={remove.isLoading} color='error' onClick={handleSubmit}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DeleteConfirmModal
