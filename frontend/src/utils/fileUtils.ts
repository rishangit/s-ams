/**
 * Utility functions for handling file operations
 */

/**
 * Get the full URL for a file path
 * @param filePath - The file path relative to uploads directory
 * @returns The full URL to access the file
 */
export const getFileUrl = (filePath: string): string => {
  // In development, use relative URL since Vite dev server proxies /uploads to backend
  // In production, use the full URL from environment variable
  const isDevelopment = import.meta.env.DEV
  if (isDevelopment) {
    return `/uploads/${filePath}`
  } else {
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5001'
    return `${uploadsBaseUrl}/uploads/${filePath}`
  }
}

/**
 * Get the full URL for a profile image
 * @param profileImagePath - The profile image path
 * @returns The full URL to access the profile image, or undefined if no path provided
 */
export const getProfileImageUrl = (profileImagePath?: string): string | undefined => {
  if (!profileImagePath) return undefined
  return getFileUrl(profileImagePath)
}
