import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridRowHeightParams, gridClasses } from '@mui/x-data-grid'
import { Tooltip } from '@mui/material'

import { useGetTasks, useDeleteTasks, TTasks } from 'src/services/tasks'

import SidebarAddTasks from 'src/views/pages/home/drawer'
import DeleteConfirmModal from 'src/@core/components/modals/delete-confirm'
import { dbRoutes } from 'src/configs/db'
import { getFilesPublicUrl } from '@services/file'

const Tasks = () => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<null | TTasks['data'][0]>(null)
  const remove = useDeleteTasks()
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false)

  const gstRates = useGetTasks()

  const toggleDrawer = () => {
    setSelectedItem(null)
    setDrawerOpen(!drawerOpen)
  }

  interface CellType {
    row: TTasks['data'][0]
  }

  const RowOptions = ({ item }: { item: TTasks['data'][0] }) => {
    const handleClick = () => {
      setSelectedItem(item)
      setDrawerOpen(!drawerOpen)
    }

    const handleDeleteOpen = () => {
      setSelectedItem(item)
      setOpenConfirmation(true)
    }

    return (
      <>
        <Tooltip title='edit' placement='top'>
          <IconButton onClick={handleClick} size='small'>
            <Icon icon='tabler:edit' />
          </IconButton>
        </Tooltip>

        <Tooltip title='delete' placement='top'>
          <IconButton onClick={handleDeleteOpen} size='small'>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Tooltip>
      </>
    )
  }

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
      flex: 0.15,
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
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions item={row} />
    }
  ]

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Tasks' />

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
              <Button onClick={toggleDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add
              </Button>
            </Box>

            <DataGrid
              autoHeight
              getEstimatedRowHeight={() => 80}
              getRowHeight={() => 'auto'}
              rows={gstRates?.data ?? ([] as TTasks['data'])}
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

        <SidebarAddTasks selectedItem={selectedItem} open={drawerOpen} toggle={toggleDrawer} />

        <DeleteConfirmModal
          routeToInvalidate={dbRoutes['tasks']}
          open={openConfirmation}
          remove={remove}
          setOpen={setOpenConfirmation}
          itemToRemove={selectedItem}
        />
      </Grid>
    </>
  )
}

export default Tasks

Tasks.guestGuard = true
