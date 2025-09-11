// Staff status enum constants
export const STAFF_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
  SUSPENDED: 2,
  TERMINATED: 3
}

// Status names mapping
export const STATUS_NAMES = {
  [STAFF_STATUS.ACTIVE]: 'active',
  [STAFF_STATUS.INACTIVE]: 'inactive',
  [STAFF_STATUS.SUSPENDED]: 'suspended',
  [STAFF_STATUS.TERMINATED]: 'terminated'
}

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [STAFF_STATUS.ACTIVE]: 'Active',
  [STAFF_STATUS.INACTIVE]: 'Inactive',
  [STAFF_STATUS.SUSPENDED]: 'Suspended',
  [STAFF_STATUS.TERMINATED]: 'Terminated'
}

// Helper functions
export const getStatusName = (statusId) => {
  return STATUS_NAMES[statusId] || 'unknown'
}

export const getStatusDisplayName = (statusId) => {
  return STATUS_DISPLAY_NAMES[statusId] || 'Unknown'
}

export const getStatusId = (statusName) => {
  const statusEntry = Object.entries(STATUS_NAMES).find(([id, name]) => name === statusName)
  return statusEntry ? parseInt(statusEntry[0]) : STAFF_STATUS.ACTIVE
}

export const isValidStatus = (statusId) => {
  return Object.values(STAFF_STATUS).includes(statusId)
}

export const isValidStatusName = (statusName) => {
  return Object.values(STATUS_NAMES).includes(statusName)
}

// Status checks
export const isActiveStatus = (statusId) => {
  return statusId === STAFF_STATUS.ACTIVE
}

export const isInactiveStatus = (statusId) => {
  return statusId === STAFF_STATUS.INACTIVE
}

export const isSuspendedStatus = (statusId) => {
  return statusId === STAFF_STATUS.SUSPENDED
}

export const isTerminatedStatus = (statusId) => {
  return statusId === STAFF_STATUS.TERMINATED
}

// Status transitions (what statuses can be changed to from current status)
export const ALLOWED_STATUS_TRANSITIONS = {
  [STAFF_STATUS.ACTIVE]: [STAFF_STATUS.INACTIVE, STAFF_STATUS.SUSPENDED, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.INACTIVE]: [STAFF_STATUS.ACTIVE, STAFF_STATUS.SUSPENDED, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.SUSPENDED]: [STAFF_STATUS.ACTIVE, STAFF_STATUS.INACTIVE, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.TERMINATED]: [] // Cannot change from terminated
}

export const canTransitionTo = (fromStatus, toStatus) => {
  return ALLOWED_STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false
}
