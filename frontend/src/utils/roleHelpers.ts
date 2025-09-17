// Helper functions to replace parseInt(user.role) calls throughout the application
import { parseUserRole, hasRole, hasAnyRole } from './roleUtils'
import { ROLES } from '../constants/roles'

// Re-export isRoleInList for convenience
export { isRoleInList } from './roleUtils'

/**
 * Check if user has admin role (0)
 */
export const isAdmin = (userRole: string | number | undefined): boolean => {
  return hasRole(userRole, ROLES.ADMIN)
}

/**
 * Check if user has owner role (1)
 */
export const isOwner = (userRole: string | number | undefined): boolean => {
  return hasRole(userRole, ROLES.OWNER)
}

/**
 * Check if user has staff role (2)
 */
export const isStaff = (userRole: string | number | undefined): boolean => {
  return hasRole(userRole, ROLES.STAFF)
}

/**
 * Check if user has user role (3)
 */
export const isUser = (userRole: string | number | undefined): boolean => {
  return hasRole(userRole, ROLES.USER)
}

/**
 * Check if user has admin or owner role
 */
export const isAdminOrOwner = (userRole: string | number | undefined): boolean => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.OWNER])
}

/**
 * Check if user has owner or user role
 */
export const isOwnerOrUser = (userRole: string | number | undefined): boolean => {
  return hasAnyRole(userRole, [ROLES.OWNER, ROLES.USER])
}

/**
 * Check if user has admin, owner, or user role
 */
export const isAdminOwnerOrUser = (userRole: string | number | undefined): boolean => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.OWNER, ROLES.USER])
}

/**
 * Check if user has owner, staff, or user role
 */
export const isOwnerStaffOrUser = (userRole: string | number | undefined): boolean => {
  return hasAnyRole(userRole, [ROLES.OWNER, ROLES.STAFF, ROLES.USER])
}

/**
 * Get the numeric role value
 */
export const getRoleValue = (userRole: string | number | undefined): number => {
  return parseUserRole(userRole)
}
