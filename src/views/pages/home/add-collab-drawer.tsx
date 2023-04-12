// ** React Imports

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import { useQueryClient } from '@tanstack/react-query'
import { errorMessageParser } from '@utils/error'
import ErrorBox from 'src/@core/components/error/ErrorBox'
import Icon from 'src/@core/components/icon'
import ButtonSpinner from 'src/@core/components/spinner/ButtonSpinner'

import useCustomToast from '@components/toast'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { useGetUsers } from '@services/auth'
import { useSendEngageSpotNotification } from '@services/engagespot'
import { TTasks, TTasksParams } from '@services/tasks'
import { usePostCollabs } from '@services/task_collab'
import { dbRoutes } from 'src/configs/db'
import { collabStatus, engageSpotTemplates, notificationTypes, userRoles } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  selectedItem: null | TTasks['data'][0]
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  user_id: yup.string().required('is required')
})

const defaultValues = {
  user_id: 0
}

const SidebarAddCollab = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, selectedItem } = props
  const post = usePostCollabs()
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const users = useGetUsers()
  const sendEngageSpotNotification = useSendEngageSpotNotification()
  const user = useGetUser()


  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TTasksParams>({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (values: TTasksParams) => {
    const selectedUser = users?.data?.find(user => user.id === Number(values.user_id))
    const email = selectedUser?.email
    if (!email) return

    const finalActions = {
      onSuccess: async (response: any) => {
        console.log(response, 'teh response')

        const notificationData = {
          recipients: [email],
          notification: {
            templateId: engageSpotTemplates['tasks']
          },
          data: {
            title: `You have been requested as a collaborator for the task`,
            message: selectedItem?.task,
            notificationType: notificationTypes['task_collab_request'],
            sendBy: user?.name,
            task_collab: response
          }
        }

        return sendEngageSpotNotification.mutate(notificationData, {
          onSuccess: async () => {
            queryClient.invalidateQueries([dbRoutes['tasks_collabs']])
            toast.success(`created successfull`)
            reset()
            toggle()
          }
        })
      },
      onError: (err: any) => {
        const errMsg = errorMessageParser(err)
        toast.error(errMsg)
      }
    }

    const data = {
      ...values,
      user_id: Number(values.user_id),
      task_id: Number(selectedItem?.id),
      status: collabStatus['pending']
    }

    post.mutate(data, finalActions)
  }

  const handleClose = () => {
    toggle()
    reset()
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
        <Typography variant='h6'>Collaborators</Typography>
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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='user_id'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <InputLabel id='status-select-1'>Collaborate With</InputLabel>
                  <Select
                    id='select-status-1'
                    label='Select Account Status'
                    labelId='status-select-1'
                    inputProps={{ placeholder: 'Assign to' }}
                    value={value}
                    onChange={onChange}
                  >
                    <MenuItem value=''>Collaborate With</MenuItem>
                    {users?.data
                      ?.filter?.(user => user.role !== userRoles['super_admin'])
                      ?.filter?.(user => user.email !== selectedItem?.['users']?.['email'])
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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button disabled={post.isLoading} type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
              {post.isLoading && <ButtonSpinner />}
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

export default SidebarAddCollab
