// Appointment status enum constants
export const APPOINTMENT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const

// Status names mapping
export const STATUS_NAMES = {
  [APPOINTMENT_STATUS.PENDING]: 'pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'cancelled'
} as const

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [APPOINTMENT_STATUS.PENDING]: 'Pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled'
} as const

// Status colors for consistent UI
export const STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: '#f59e0b',    // Orange
  [APPOINTMENT_STATUS.CONFIRMED]: '#3b82f6',  // Blue
  [APPOINTMENT_STATUS.COMPLETED]: '#10b981',  // Green
  [APPOINTMENT_STATUS.CANCELLED]: '#ef4444'   // Red
} as const

// Status background colors (lighter versions for chips/badges)
export const STATUS_BACKGROUND_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: '#fef3c7',    // Light orange
  [APPOINTMENT_STATUS.CONFIRMED]: '#dbeafe',  // Light blue
  [APPOINTMENT_STATUS.COMPLETED]: '#d1fae5',  // Light green
  [APPOINTMENT_STATUS.CANCELLED]: '#fee2e2'   // Light red
} as const

// Status text colors (for contrast)
export const STATUS_TEXT_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: '#92400e',    // Dark orange
  [APPOINTMENT_STATUS.CONFIRMED]: '#1e40af',  // Dark blue
  [APPOINTMENT_STATUS.COMPLETED]: '#065f46',  // Dark green
  [APPOINTMENT_STATUS.CANCELLED]: '#991b1b'   // Dark red
} as const

// Helper functions
export const getStatusName = (statusId: number): string => {
  return STATUS_NAMES[statusId as keyof typeof STATUS_NAMES] || 'unknown'
}

export const getStatusDisplayName = (statusId: number): string => {
  return STATUS_DISPLAY_NAMES[statusId as keyof typeof STATUS_DISPLAY_NAMES] || 'Unknown'
}

export const getStatusColor = (statusId: number): string => {
  return STATUS_COLORS[statusId as keyof typeof STATUS_COLORS] || '#6b7280'
}

export const getStatusBackgroundColor = (statusId: number): string => {
  return STATUS_BACKGROUND_COLORS[statusId as keyof typeof STATUS_BACKGROUND_COLORS] || '#f3f4f6'
}

export const getStatusTextColor = (statusId: number): string => {
  return STATUS_TEXT_COLORS[statusId as keyof typeof STATUS_TEXT_COLORS] || '#374151'
}

export const getStatusId = (statusName: string): number => {
  const statusEntry = Object.entries(STATUS_NAMES).find(([, name]) => name === statusName)
  return statusEntry ? parseInt(statusEntry[0]) : APPOINTMENT_STATUS.PENDING
}

export const isValidStatus = (statusId: number): boolean => {
  return Object.values(APPOINTMENT_STATUS).includes(statusId as any)
}

export const isValidStatusName = (statusName: string): boolean => {
  return Object.values(STATUS_NAMES).includes(statusName as any)
}

// Status checks
export const isPendingStatus = (statusId: number): boolean => {
  return statusId === APPOINTMENT_STATUS.PENDING
}

export const isConfirmedStatus = (statusId: number): boolean => {
  return statusId === APPOINTMENT_STATUS.CONFIRMED
}

export const isCompletedStatus = (statusId: number): boolean => {
  return statusId === APPOINTMENT_STATUS.COMPLETED
}

export const isCancelledStatus = (statusId: number): boolean => {
  return statusId === APPOINTMENT_STATUS.CANCELLED
}

// Status transitions (what statuses can be changed to from current status)
export const ALLOWED_STATUS_TRANSITIONS = {
  [APPOINTMENT_STATUS.PENDING]: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.CANCELLED],
  [APPOINTMENT_STATUS.CONFIRMED]: [APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED],
  [APPOINTMENT_STATUS.COMPLETED]: [], // Cannot change from completed
  [APPOINTMENT_STATUS.CANCELLED]: [] // Cannot change from cancelled
} as const

export const canTransitionTo = (fromStatus: number, toStatus: number): boolean => {
  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[fromStatus as keyof typeof ALLOWED_STATUS_TRANSITIONS]
  return allowedTransitions ? (allowedTransitions as readonly number[]).includes(toStatus) : false
}

// Get next status for dynamic menu actions
export const getNextStatus = (currentStatus: number): number | null => {
  switch (currentStatus) {
    case APPOINTMENT_STATUS.PENDING:
      return APPOINTMENT_STATUS.CONFIRMED
    case APPOINTMENT_STATUS.CONFIRMED:
      return APPOINTMENT_STATUS.COMPLETED
    default:
      return null // No next status for completed or cancelled
  }
}

// Get next status action label
export const getNextStatusLabel = (currentStatus: number): string => {
  switch (currentStatus) {
    case APPOINTMENT_STATUS.PENDING:
      return 'Confirm Appointment'
    case APPOINTMENT_STATUS.CONFIRMED:
      return 'Mark as Completed'
    default:
      return 'Update Status'
  }
}

// Get next status action color
export const getNextStatusColor = (currentStatus: number): string => {
  switch (currentStatus) {
    case APPOINTMENT_STATUS.PENDING:
      return STATUS_COLORS[APPOINTMENT_STATUS.CONFIRMED] // Blue for confirm
    case APPOINTMENT_STATUS.CONFIRMED:
      return STATUS_COLORS[APPOINTMENT_STATUS.COMPLETED] // Green for complete
    default:
      return '#6b7280' // Gray for disabled
  }
}

// Type definitions
export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS]
export type StatusName = typeof STATUS_NAMES[keyof typeof STATUS_NAMES]
export type StatusDisplayName = typeof STATUS_DISPLAY_NAMES[keyof typeof STATUS_DISPLAY_NAMES]
