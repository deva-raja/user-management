import { CustomChipProps } from '@components/chip/types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useGetUsers } from '@services/auth'
import { getFilesPublicUrl } from '@services/file'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { taskStatus, userRoles } from 'src/configs/general'
import { TTasks, useGetTasks } from 'src/services/tasks'

interface CellType {
  row: TTasks['data'][0]
}

function TasksView({
  RowOptions,
  toggleAddTaskDrawer,
  user
}: {
  RowOptions: ({ item }: { item: TTasks['data'][0] }) => JSX.Element
  toggleAddTaskDrawer: () => void
  user?: any
}) {
  const tasks = useGetTasks()
  const [pageSize, setPageSize] = useState<number>(10)
  const users = useGetUsers()

  const columns = [
    {
      flex: 0.3,
      minWidth: 190,
      field: 'Task',
      headerName: 'Task',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            sx={{ color: 'text.secondary', wordBreak: 'break-word', whiteSpace: 'normal' }}
          >{`${row.task}`}</Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'Assigned To',
      headerName: 'Assigned To',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.users?.['name']}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 190,
      field: 'Attachment',
      headerName: 'Attachment',
      renderCell: ({ row }: CellType) => {
        let attachment = {
          publicUrl: ''
        }

        if (row.attachment) {
          attachment = getFilesPublicUrl(row.attachment)
        }

        return (
          <>
            {row.attachment ? (
              <Button
                onClick={() => window.open(attachment?.publicUrl, '_blank')}
                variant='text'
                sx={{ '& svg': { mr: 2 } }}
                size='small'
              >
                view
              </Button>
            ) : (
              <Typography noWrap sx={{ color: 'text.secondary' }}>
                {''}
              </Typography>
            )}
          </>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'Collaborators',
      headerName: 'Collaborators',
      renderCell: ({ row }: CellType) => {
        const collabNames = row?.tasks_collabs?.map((collab: any) => {
          const data = users.data?.find((user: any) => user.id === collab.user_id)

          return {
            ...data,
            status: collab.status
          }
        })

        return collabNames.map(collabUser => {
          let color: CustomChipProps['color'] = 'warning'

          if (collabUser.status === 2) {
            color = 'success'
          }

          if (collabUser.status === 3) {
            color = 'error'
          }

          return (
            <CustomChip
              key={collabUser?.id}
              rounded
              typeof='success'
              skin='light'
              label={collabUser?.name}
              color={color}
            />
          )
        })
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'Status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        let color: CustomChipProps['color'] = 'secondary'

        if (row?.task_status?.id === taskStatus['in progress']) {
          color = 'warning'
        }

        if (row?.task_status?.id === taskStatus['in qa']) {
          color = 'info'
        }

        if (row?.task_status?.id === taskStatus['qa passed']) {
          color = 'success'
        }

        if (row?.task_status?.id === taskStatus['approved for production']) {
          color = 'primary'
        }

        return <CustomChip rounded typeof='success' skin='light' label={row?.task_status?.['name']} color={color} />
      }
    },
    {
      flex: 0.12,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions item={row} />
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Tasks' />

        {user?.role === userRoles['super_admin'] && (
          <Box
            sx={{
              rowGap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: '1rem',
              marginRight: '1rem'
            }}
          >
            <Button onClick={toggleAddTaskDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add
            </Button>
          </Box>
        )}

        <DataGrid
          autoHeight
          getEstimatedRowHeight={() => 80}
          getRowHeight={() => 'auto'}
          rows={tasks?.data ?? ([] as TTasks['data'])}
          density={'standard'}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          rowsPerPageOptions={[10, 25, 50]}
          onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 2
            }
          }}
        />
      </Card>
    </Grid>
  )
}

export default TasksView
