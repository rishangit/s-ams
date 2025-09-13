// Role enum constants
export const ROLES = {
  ADMIN: 0,
  OWNER: 1,
  STAFF: 2,
  USER: 3
}

// Role names mapping
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'admin',
  [ROLES.OWNER]: 'owner',
  [ROLES.STAFF]: 'staff',
  [ROLES.USER]: 'user'
}

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.OWNER]: 'Owner',
  [ROLES.STAFF]: 'Staff',
  [ROLES.USER]: 'User'
}

// Helper functions
export const getRoleName = (roleId) => {
  return ROLE_NAMES[roleId] || 'unknown'
}

export const getRoleDisplayName = (roleId) => {
  return ROLE_DISPLAY_NAMES[roleId] || 'Unknown'
}

export const getRoleId = (roleName) => {
  const roleEntry = Object.entries(ROLE_NAMES).find(([id, name]) => name === roleName)
  return roleEntry ? parseInt(roleEntry[0]) : ROLES.USER
}

export const isValidRole = (roleId) => {
  return Object.values(ROLES).includes(roleId)
}

export const isValidRoleName = (roleName) => {
  return Object.values(ROLE_NAMES).includes(roleName)
}

// Role switching helper functions
export const canSwitchToRole = (currentRole, targetRole) => {
  // Higher roles (lower numbers) can switch to lower roles (higher numbers)
  return currentRole < targetRole
}

export const getAvailableRolesForSwitch = (currentRole) => {
  // Return all roles that the current role can switch to
  return Object.values(ROLES).filter(role => canSwitchToRole(currentRole, role))
}

export const getRoleHierarchy = () => {
  // Return roles in hierarchy order (highest to lowest)
  return [ROLES.ADMIN, ROLES.OWNER, ROLES.STAFF, ROLES.USER]
}

// Admin role checks
export const isAdminRole = (roleId) => {
  return roleId === ROLES.ADMIN
}

export const isOwnerRole = (roleId) => {
  return roleId === ROLES.OWNER
}

export const isStaffRole = (roleId) => {
  return roleId === ROLES.STAFF
}

export const isUserRole = (roleId) => {
  return roleId === ROLES.USER
}
