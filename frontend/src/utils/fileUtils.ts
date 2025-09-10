/**
 * Utility functions for handling file operations
 */

/**
 * Get the full URL for a file path
 * @param filePath - The file path relative to uploads directory
 * @returns The full URL to access the file
 */
export const getFileUrl = (filePath: string): string => {
  // Use environment variable if set, otherwise default to localhost for development
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5001'
  
  // Ensure the filePath doesn't already start with /uploads
  const cleanFilePath = filePath.startsWith('uploads/') ? filePath : `uploads/${filePath}`
  
  return `${uploadsBaseUrl}/${cleanFilePath}`
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
