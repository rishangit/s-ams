// Appointment status enum constants
export const APPOINTMENT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  CANCELLED: 3
}

// Status names mapping
export const STATUS_NAMES = {
  [APPOINTMENT_STATUS.PENDING]: 'pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'cancelled'
}

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [APPOINTMENT_STATUS.PENDING]: 'Pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled'
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
  return statusEntry ? parseInt(statusEntry[0]) : APPOINTMENT_STATUS.PENDING
}

export const isValidStatus = (statusId) => {
  return Object.values(APPOINTMENT_STATUS).includes(statusId)
}

export const isValidStatusName = (statusName) => {
  return Object.values(STATUS_NAMES).includes(statusName)
}

// Status checks
export const isPendingStatus = (statusId) => {
  return statusId === APPOINTMENT_STATUS.PENDING
}

export const isConfirmedStatus = (statusId) => {
  return statusId === APPOINTMENT_STATUS.CONFIRMED
}

export const isCompletedStatus = (statusId) => {
  return statusId === APPOINTMENT_STATUS.COMPLETED
}

export const isCancelledStatus = (statusId) => {
  return statusId === APPOINTMENT_STATUS.CANCELLED
}

// Status transitions (what statuses can be changed to from current status)
export const ALLOWED_STATUS_TRANSITIONS = {
  [APPOINTMENT_STATUS.PENDING]: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.CANCELLED],
  [APPOINTMENT_STATUS.CONFIRMED]: [APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED],
  [APPOINTMENT_STATUS.COMPLETED]: [], // Cannot change from completed
  [APPOINTMENT_STATUS.CANCELLED]: [] // Cannot change from cancelled
}

export const canTransitionTo = (fromStatus, toStatus) => {
  return ALLOWED_STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false
}
