// ** React Imports

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import { useQueryClient } from '@tanstack/react-query'
import { errorMessageParser } from '@utils/error'
import { useEffect, useState } from 'react'
import ErrorBox from 'src/@core/components/error/ErrorBox'
import Icon from 'src/@core/components/icon'
import ButtonSpinner from 'src/@core/components/spinner/ButtonSpinner'

import FileUploaderMultiple from '@components/file-upload/FileUploaderMultiple'
import useCustomToast from '@components/toast'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { useGetUsers } from '@services/auth'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { getFilesPublicUrl, useHandleFileDelete, useHandleFileUpload } from '@services/file'
import { TTasks, TTasksParams, usePatchTasks, usePostTasks } from '@services/tasks'
import { useGetAcceptedCollabs } from '@services/task_collab'
import { useGetTaskStatus } from '@services/task_status'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { dbRoutes } from 'src/configs/db'
import { engageSpotTemplates, notificationTypes, userRoles } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  selectedItem: null | TTasks['data'][0]
  statusEdit: boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  user_id: yup.string().required(),
  task: yup.string().required()
})

const defaultValues = {
  task: '',
  user_id: 0,
  status: 1
}

const SidebarAddTasks = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, selectedItem, statusEdit } = props
  const post = usePostTasks()
  const patch = usePatchTasks()
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const users = useGetUsers()
  const taskStatus = useGetTaskStatus()
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const [files, setFiles] = useState<File[] | string[]>([])
  const handleFileUpload = useHandleFileUpload()
  const deleteFile = useHandleFileDelete()
  const collabs = useGetAcceptedCollabs(selectedItem?.id)
  const user = useGetUser()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TTasksParams>({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (selectedItem) {
      setValue('user_id', selectedItem.users.id)
      setValue('task', selectedItem.task)
      setValue('status', selectedItem.task_status.id)

      if (selectedItem.attachment) {
        const attachment = getFilesPublicUrl(selectedItem.attachment)
        setFiles([attachment.publicUrl])
      }
    }
  }, [selectedItem, setValue])

  const onSubmit = async (values: TTasksParams) => {
    const selectedUser = users?.data?.find(item => item.id === Number(values.user_id))
    const email = selectedUser?.email
    const collaboratorsEmail = collabs?.data?.map(collab => collab.users.email)
    if (!email) return

    const attachments = await Promise.all(
      [...files]
        .filter(item => typeof item !== 'string')
        .map(async file => {
          try {
            const response = await handleFileUpload.mutateAsync(file as File)

            return response?.path
          } catch (err) {
            const errMsg = errorMessageParser(err)
            toast.error(errMsg)
          }
        })
    )

    const notificationData = {
      recipients: [email, ...(collaboratorsEmail ?? [])],
      notification: {
        templateId: engageSpotTemplates['tasks']
      },
      data: {
        title: `${selectedItem ? (statusEdit ? 'Changed Status of the task' : 'Updated the task') : 'Assigned a task'}`,
        attachment: attachments?.[0],
        message: values.task,
        notificationType: selectedItem
          ? statusEdit
            ? notificationTypes['task_status_change']
            : notificationTypes['task_edited']
          : notificationTypes['task_assigned'],
        ...(selectedItem &&
          statusEdit && {
            statusData: {
              from: selectedItem?.task_status?.name,
              to: taskStatus?.data?.find(item => item.id === Number(values.status))?.name
            }
          }),
        sendBy: user?.name
      }
    }

    const finalActions = {
      onSuccess: async () => {
        // rollback
        if (selectedItem) {
          const alreadyUploadedAttachment = selectedItem.attachment

          if (files && files.length > 0 && files?.[0] !== alreadyUploadedAttachment) {
            deleteFile.mutate(alreadyUploadedAttachment, {
              onError: (err: any) => {
                const errMsg = errorMessageParser(err)
                toast.error(errMsg)
              }
            })
          }
        }

        return sendEngageSpotNotification.mutate(notificationData, {
          onSuccess: async () => {
            queryClient.invalidateQueries([dbRoutes['tasks']])
            toast.success(`${selectedItem ? 'update' : 'create'} successfull`)
            reset()
            toggle()
            setFiles([])
          }
        })
      },
      onError: (err: any) => {
        const errMsg = errorMessageParser(err)
        toast.error(errMsg)
      }
    }

    if (selectedItem) {
      const data = {
        ...values,
        user_id: Number(values.user_id),
        id: Number(selectedItem.id),
        status: Number(values?.status),
        ...(attachments &&
          attachments.length > 0 && {
            attachment: attachments[0]
          }),
        ...(files &&
          files.length === 0 && {
            attachment: null
          })
      }

      patch.mutate(data, finalActions)
    } else {
      const data = {
        ...values,
        user_id: Number(values.user_id),
        ...(attachments &&
          attachments.length > 0 && {
            attachment: attachments[0]
          })
      }

      post.mutate(data, finalActions)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
    setFiles([])
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        {statusEdit ? (
          <Typography variant='h6'>Task Status</Typography>
        ) : (
          <Typography variant='h6'>{selectedItem ? 'Edit' : 'Add'} Task</Typography>
        )}
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!statusEdit && (
            <>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='user_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <InputLabel id='status-select-1'>Assign To</InputLabel>
                      <Select
                        id='select-status-1'
                        label='Select Account Status'
                        labelId='status-select-1'
                        inputProps={{ placeholder: 'Assign to' }}
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value=''>Assign To</MenuItem>
                        {users?.data
                          ?.filter?.(user => user.role !== userRoles['super_admin'])
                          ?.map(item => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </>
                  )}
                />
                {errors.user_id && <ErrorBox error={errors.user_id} />}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='task'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Task'
                      onChange={onChange}
                      placeholder='Enter task description'
                      multiline
                      rows={4}
                      error={Boolean(errors.task)}
                    />
                  )}
                />
                {errors.task && <ErrorBox error={errors.task} />}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <DropzoneWrapper>
                  <FileUploaderMultiple files={files} setFiles={setFiles} />
                </DropzoneWrapper>
              </FormControl>
            </>
          )}

          {selectedItem && statusEdit && (
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <InputLabel id='status-select-1'>Task Status</InputLabel>
                    <Select
                      id='select-status-1'
                      label='Task Status'
                      labelId='status-select-1'
                      inputProps={{ placeholder: 'Assign to' }}
                      value={value}
                      onChange={onChange}
                    >
                      {taskStatus?.data?.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.status && <ErrorBox error={errors.status} />}
            </FormControl>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              disabled={post.isLoading || patch.isLoading || handleFileUpload.isLoading || deleteFile.isLoading}
              type='submit'
              variant='contained'
              sx={{ mr: 3 }}
            >
              Submit
              {(post.isLoading || patch.isLoading || handleFileUpload.isLoading || deleteFile.isLoading) && (
                <ButtonSpinner />
              )}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddTasks
