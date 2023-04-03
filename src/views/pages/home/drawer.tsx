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
import ErrorBox from 'src/@core/components/error/ErrorBox'
import Icon from 'src/@core/components/icon'
import ButtonSpinner from 'src/@core/components/spinner/ButtonSpinner'
import { useEffect } from 'react'
import { errorMessageParser } from '@utils/error'
import { useQueryClient } from '@tanstack/react-query'

import useCustomToast from '@components/toast'
import { TTasksParams, usePostTasks, usePatchTasks, TTasks } from '@services/tasks'
import { dbRoutes } from 'src/configs/db'

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
  userId: yup.number().required(),
  task: yup.string().required()
})

const defaultValues = {
  task: ''
}

const SidebarAddGstRate = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, selectedItem } = props
  const post = usePostTasks()
  const patch = usePatchTasks()
  const toast = useCustomToast()
  const queryClient = useQueryClient()

  // ** Hooks
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
      setValue('userId', selectedItem.userId)
      setValue('task', selectedItem.task)
    }
  }, [selectedItem, setValue])

  const onSubmit = (values: TTasksParams) => {
    const finalActions = {
      onSuccess: () => {
        toggle()
        reset()
        queryClient.invalidateQueries([dbRoutes['tasks']])
        toast.success(`${selectedItem ? 'update' : 'create'} successfull`)
      },
      onError: (err: any) => {
        const errMsg = errorMessageParser(err)
        toast.error(errMsg)
      }
    }

    if (selectedItem) {
      const data = {
        ...values,
        id: selectedItem.id
      }

      patch.mutate(data, finalActions)
    } else {
      post.mutate(values, finalActions)
    }
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
        <Typography variant='h6'>{selectedItem ? 'Edit' : 'Add'} Gst Rate</Typography>
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
              name='task'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Rate in percentage'
                  onChange={onChange}
                  placeholder='Enter gst rate'
                  error={Boolean(errors.userId)}
                />
              )}
            />
            {errors.userId && <ErrorBox error={errors.userId} />}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='task'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Description'
                  onChange={onChange}
                  placeholder='Enter description'
                  error={Boolean(errors.task)}
                />
              )}
            />
            {errors.task && <ErrorBox error={errors.task} />}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button disabled={post.isLoading || patch.isLoading} type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
              {(post.isLoading || patch.isLoading) && <ButtonSpinner />}
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

export default SidebarAddGstRate
