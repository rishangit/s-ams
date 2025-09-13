import { ROLES, RoleId } from '../constants/roles'

/**
 * Safely parse user role from string or number to RoleId
 * @param role - The role value (string or number)
 * @returns The parsed role as RoleId
 */
export const parseUserRole = (role: string | number | undefined): RoleId => {
  if (typeof role === 'number') {
    return role as RoleId
  }
  if (typeof role === 'string') {
    const parsed = parseInt(role, 10)
    return isNaN(parsed) ? ROLES.USER : (parsed as RoleId)
  }
  return ROLES.USER
}

/**
 * Check if user has a specific role
 * @param userRole - The user's role
 * @param targetRole - The role to check against
 * @returns True if user has the target role
 */
export const hasRole = (userRole: string | number | undefined, targetRole: RoleId): boolean => {
  return parseUserRole(userRole) === targetRole
}

/**
 * Check if user has any of the specified roles
 * @param userRole - The user's role
 * @param targetRoles - Array of roles to check against
 * @returns True if user has any of the target roles
 */
export const hasAnyRole = (userRole: string | number | undefined, targetRoles: RoleId[]): boolean => {
  const parsedRole = parseUserRole(userRole)
  return targetRoles.includes(parsedRole)
}

/**
 * Check if user role is in a list of roles (for includes checks)
 * @param userRole - The user's role
 * @param targetRoles - Array of roles to check against
 * @returns True if user role is in the target roles
 */
export const isRoleInList = (userRole: string | number | undefined, targetRoles: number[]): boolean => {
  const parsedRole = parseUserRole(userRole)
  return targetRoles.includes(parsedRole)
}
