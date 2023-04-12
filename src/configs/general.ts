export const userRoles = {
  client: 1,
  super_admin: 2
}

export const engageSpotTemplates = {
  tasks: 8496,
  comments: 8501
}

export const collabStatus = {
  pending: 1,
  accepted: 2,
  rejected: 3
}

export const taskStatus = {
  'to do': 1,
  'in progress': 2,
  'in qa': 3,
  'qa passed': 4,
  'approved for production': 5
}

export const notificationTypes = {
  task_assigned: 'task_assigned',
  task_edited: 'task_edited',
  task_deleted: 'task_deleted',
  task_comment: 'task_comment',
  task_status_change: 'task_status_change',
  task_collab_request: 'task_collab_request',
  task_collab_accepted: 'task_collab_accepted',
  task_collab_rejected: 'task_collab_rejected'
}

export const recipientIds = {
  admin: 'admin@gmail.com'
}