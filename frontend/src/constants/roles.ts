// Role enum constants - matches backend implementation
export const ROLES = {
  ADMIN: 0,
  OWNER: 1,
  STAFF: 2,
  USER: 3
} as const

// Role names mapping
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'admin',
  [ROLES.OWNER]: 'owner',
  [ROLES.STAFF]: 'staff',
  [ROLES.USER]: 'user'
} as const

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.OWNER]: 'Owner',
  [ROLES.STAFF]: 'Staff',
  [ROLES.USER]: 'User'
} as const

// Type definitions
export type RoleId = typeof ROLES[keyof typeof ROLES]
export type RoleName = typeof ROLE_NAMES[RoleId]
export type RoleDisplayName = typeof ROLE_DISPLAY_NAMES[RoleId]

// Role switching helper functions
export const canSwitchToRole = (currentRole: RoleId, targetRole: RoleId): boolean => {
  // Higher roles (lower numbers) can switch to lower roles (higher numbers)
  return currentRole < targetRole
}

export const getAvailableRolesForSwitch = (currentRole: RoleId): RoleId[] => {
  // Return all roles that the current role can switch to
  return Object.values(ROLES).filter(role => canSwitchToRole(currentRole, role as RoleId)) as RoleId[]
}

export const getRoleHierarchy = (): RoleId[] => {
  // Return roles in hierarchy order (highest to lowest)
  return [ROLES.ADMIN, ROLES.OWNER, ROLES.STAFF, ROLES.USER]
}

// Helper functions
export const getRoleName = (roleId: RoleId): RoleName => {
  return ROLE_NAMES[roleId] || 'user'
}

export const getRoleDisplayName = (roleId: RoleId): RoleDisplayName => {
  return ROLE_DISPLAY_NAMES[roleId] || 'User'
}

export const getRoleId = (roleName: RoleName): RoleId => {
  const roleEntry = Object.entries(ROLE_NAMES).find(([, name]) => name === roleName)
  return roleEntry ? (parseInt(roleEntry[0]) as RoleId) : ROLES.USER
}

export const isValidRole = (roleId: number): roleId is RoleId => {
  return Object.values(ROLES).includes(roleId as RoleId)
}

export const isValidRoleName = (roleName: string): roleName is RoleName => {
  return Object.values(ROLE_NAMES).includes(roleName as RoleName)
}

// Admin role checks
export const isAdminRole = (roleId: RoleId): boolean => {
  return roleId === ROLES.ADMIN || roleId === ROLES.OWNER
}

// Admin only role check (excludes owners)
export const isAdminOnlyRole = (roleId: RoleId): boolean => {
  return roleId === ROLES.ADMIN
}

export const isOwnerRole = (roleId: RoleId): boolean => {
  return roleId === ROLES.OWNER
}

export const isStaffRole = (roleId: RoleId): boolean => {
  return roleId === ROLES.STAFF
}

export const isUserRole = (roleId: RoleId): boolean => {
  return roleId === ROLES.USER
}

// Default role for new users
export const DEFAULT_USER_ROLE = ROLES.USER
