import { CustomChipProps } from '@components/mui/chip/types'
import { CardMedia } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useGetCollabs } from '@services/task_collab'
import { ITaskCollabs } from '@type/task_collabs'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { collabStatus, userRoles } from 'src/configs/general'
import { useGetUser } from 'src/hooks/useGetUser'
import { TTasks } from 'src/services/tasks'

interface CellType {
  row: ITaskCollabs
}

function CollabView({
  RowOptions,
  toggleCollabDrawer,
  handleBack,
  selectedItem
}: {
  RowOptions: ({ item }: { item: ITaskCollabs }) => JSX.Element
  toggleCollabDrawer: () => void
  handleBack: () => void
  selectedItem: null | TTasks['data'][0]
}) {
  const taskId = selectedItem?.id
  const collabs = useGetCollabs(taskId)
  const [pageSize, setPageSize] = useState<number>(10)
  const user = useGetUser()
  const taskOwner = selectedItem?.users.id === user.id

  const columns = [
    {
      flex: 0.15,
      minWidth: 190,
      field: 'Collaborator',
      headerName: 'Collaborator',
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
      field: 'Status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        let color: CustomChipProps['color'] = 'warning'

        if (row?.collab_status?.id === collabStatus['accepted']) {
          color = 'success'
        }

        if (row?.collab_status?.id === collabStatus['rejected']) {
          color = 'error'
        }

        return <CustomChip rounded typeof='success' skin='light' label={row?.collab_status?.['name']} color={color} />
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
    <Grid item xs={12}>
      <Card>
        <Button sx={{ marginTop: '1.5rem', marginLeft: '1.5rem' }} onClick={handleBack} variant='outlined'>
          <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
          <span style={{ marginLeft: '.5rem' }}>Back</span>
        </Button>

        <CardHeader title='Collaborations' />

        <CardMedia
          sx={{ color: 'text.secondary', padding: '0 1.5rem', marginBottom: `${taskOwner ? '0rem' : '1rem'}` }}
        >{`Task - ${selectedItem?.task}`}</CardMedia>

        {(taskOwner || user.role === userRoles['super_admin']) && (
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
            <Button onClick={toggleCollabDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add
            </Button>
          </Box>
        )}

        <DataGrid
          autoHeight
          getEstimatedRowHeight={() => 80}
          getRowHeight={() => 'auto'}
          rows={collabs?.data ?? ([] as ITaskCollabs[])}
          density={'standard'}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          rowsPerPageOptions={[10, 25, 50]}
          onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          loading={collabs?.isLoading}
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

export default CollabView
