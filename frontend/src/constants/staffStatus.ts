// Staff status enum constants
export const STAFF_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
  SUSPENDED: 2,
  TERMINATED: 3
} as const

// Status names mapping
export const STATUS_NAMES = {
  [STAFF_STATUS.ACTIVE]: 'active',
  [STAFF_STATUS.INACTIVE]: 'inactive',
  [STAFF_STATUS.SUSPENDED]: 'suspended',
  [STAFF_STATUS.TERMINATED]: 'terminated'
} as const

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [STAFF_STATUS.ACTIVE]: 'Active',
  [STAFF_STATUS.INACTIVE]: 'Inactive',
  [STAFF_STATUS.SUSPENDED]: 'Suspended',
  [STAFF_STATUS.TERMINATED]: 'Terminated'
} as const

// Helper functions
export const getStatusName = (statusId: number): string => {
  return STATUS_NAMES[statusId as keyof typeof STATUS_NAMES] || 'unknown'
}

export const getStatusDisplayName = (statusId: number): string => {
  return STATUS_DISPLAY_NAMES[statusId as keyof typeof STATUS_DISPLAY_NAMES] || 'Unknown'
}

export const getStatusId = (statusName: string): number => {
  const statusEntry = Object.entries(STATUS_NAMES).find(([, name]) => name === statusName)
  return statusEntry ? parseInt(statusEntry[0]) : STAFF_STATUS.ACTIVE
}

export const isValidStatus = (statusId: number): boolean => {
  return Object.values(STAFF_STATUS).includes(statusId as any)
}

export const isValidStatusName = (statusName: string): boolean => {
  return Object.values(STATUS_NAMES).includes(statusName as any)
}

// Status checks
export const isActiveStatus = (statusId: number): boolean => {
  return statusId === STAFF_STATUS.ACTIVE
}

export const isInactiveStatus = (statusId: number): boolean => {
  return statusId === STAFF_STATUS.INACTIVE
}

export const isSuspendedStatus = (statusId: number): boolean => {
  return statusId === STAFF_STATUS.SUSPENDED
}

export const isTerminatedStatus = (statusId: number): boolean => {
  return statusId === STAFF_STATUS.TERMINATED
}

// Status transitions (what statuses can be changed to from current status)
export const ALLOWED_STATUS_TRANSITIONS = {
  [STAFF_STATUS.ACTIVE]: [STAFF_STATUS.INACTIVE, STAFF_STATUS.SUSPENDED, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.INACTIVE]: [STAFF_STATUS.ACTIVE, STAFF_STATUS.SUSPENDED, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.SUSPENDED]: [STAFF_STATUS.ACTIVE, STAFF_STATUS.INACTIVE, STAFF_STATUS.TERMINATED],
  [STAFF_STATUS.TERMINATED]: [] // Cannot change from terminated
} as const

export const canTransitionTo = (fromStatus: number, toStatus: number): boolean => {
  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[fromStatus as keyof typeof ALLOWED_STATUS_TRANSITIONS]
  return allowedTransitions ? (allowedTransitions as readonly number[]).includes(toStatus) : false
}
