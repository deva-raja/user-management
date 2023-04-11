import { Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'

import { TTasks, useDeleteTasks } from 'src/services/tasks'

import { useDeleteCollabs } from '@services/task_collab'
import { ITaskCollabs } from '@type/task_collabs'
import SidebarAddCollab from '@views/pages/home/add-collab-drawer'
import SidebarAddTasks from '@views/pages/home/add-task-drawer'
import CollabView from '@views/pages/home/collabs'
import TasksView from '@views/pages/home/tasks'
import { dbRoutes } from 'src/configs/db'
import { userRoles } from 'src/configs/general'
import TaskDeleteModal from 'src/pages/home/task-delete-modal'
import CollabDeleteModal from './collab-delete-modal'

const Tasks = () => {
  const [addTaskDrawerOpen, setAddTaskDrawerOpen] = useState<boolean>(false)
  const [collabDrawerOpen, setCollabDrawerOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<null | TTasks['data'][0]>(null)
  const [selectedCollab, setSelectedCollab] = useState<null | ITaskCollabs>(null)
  const removeTasks = useDeleteTasks()
  const removeCollab = useDeleteCollabs()
  const [openTaskDeleteModal, setOpenTaskDeleteModal] = useState<boolean>(false)
  const [openCollabDeleteModal, setOpenCollabDeleteModal] = useState(false)
  const [statusEdit, setStatusEdit] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') as string)

  const [taskView, setTaskView] = useState(true)
  const [collabView, setCollabView] = useState(false)

  const toggleAddTaskDrawer = () => {
    setSelectedItem(null)
    setAddTaskDrawerOpen(!addTaskDrawerOpen)
  }

  const toggleCollabDrawer = () => {
    setCollabDrawerOpen(!collabDrawerOpen)
  }

  const handleCollabBack = () => {
    setTaskView(true)
    setCollabView(false)
  }

  const TasksRowOptions = ({ item }: { item: TTasks['data'][0] }) => {
    const handleEdit = (isStatusEdit = false) => {
      if (isStatusEdit) {
        setStatusEdit(true)
      } else {
        setStatusEdit(false)
      }

      setSelectedItem(item)
      setAddTaskDrawerOpen(!addTaskDrawerOpen)
    }

    const handleDeleteOpen = () => {
      setSelectedItem(item)
      setOpenTaskDeleteModal(true)
    }

    const handleCollabOpen = () => {
      setSelectedItem(item)

      // setCollabDrawerOpen(true)
      setTaskView(false)
      setCollabView(true)
    }

    return (
      <>
        {user?.role === userRoles['super_admin'] && (
          <>
            <Tooltip title='edit' placement='top'>
              <IconButton onClick={() => handleEdit()} size='small'>
                <Icon icon='tabler:edit' />
              </IconButton>
            </Tooltip>

            <Tooltip title='delete' placement='top'>
              <IconButton onClick={handleDeleteOpen} size='small'>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </>
        )}

        <>
          <Tooltip title='collab' placement='top'>
            <IconButton onClick={handleCollabOpen} size='small'>
              <Icon icon='tabler:plus' />
            </IconButton>
          </Tooltip>

          <Tooltip title='status' placement='top'>
            <IconButton onClick={() => handleEdit(true)} size='small'>
              <Icon icon='tabler:affiliate' />
            </IconButton>
          </Tooltip>
        </>
      </>
    )
  }

  const CollabRowOptions = ({ item }: { item: ITaskCollabs }) => {
    const handleDeleteOpen = () => {
      setSelectedCollab(item)
      setOpenCollabDeleteModal(true)
    }

    return (
      <>
        <Tooltip title='delete' placement='top'>
          <IconButton onClick={handleDeleteOpen} size='small'>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Tooltip>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={6.5}>
        {taskView && <TasksView RowOptions={TasksRowOptions} toggleAddTaskDrawer={toggleAddTaskDrawer} user={user} />}

        {collabView && (
          <CollabView
            handleBack={handleCollabBack}
            RowOptions={CollabRowOptions}
            toggleCollabDrawer={toggleCollabDrawer}
            selectedItem={selectedItem}
          />
        )}

        <SidebarAddTasks
          statusEdit={statusEdit}
          selectedItem={selectedItem}
          open={addTaskDrawerOpen}
          toggle={toggleAddTaskDrawer}
        />
        <SidebarAddCollab selectedItem={selectedItem} open={collabDrawerOpen} toggle={toggleCollabDrawer} />

        <TaskDeleteModal
          routeToInvalidate={dbRoutes['tasks']}
          open={openTaskDeleteModal}
          remove={removeTasks}
          setOpen={setOpenTaskDeleteModal}
          itemToRemove={selectedItem}
        />

        <CollabDeleteModal
          routeToInvalidate={dbRoutes['tasks_collabs']}
          open={openCollabDeleteModal}
          remove={removeCollab}
          setOpen={setOpenCollabDeleteModal}
          itemToRemove={selectedCollab}
        />
      </Grid>
    </>
  )
}

export default Tasks

Tasks.guestGuard = true
