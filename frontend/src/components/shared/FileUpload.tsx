import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fileUploadService, FileUploadData } from '../../services/fileUploadService'
import { ApiResponse } from '../../services/api'

interface FileUploadProps {
  onFileUploaded: (filePath: string, fileUrl: string) => void
  onFileDeleted?: () => void
  currentImagePath?: string
  folderPath: string
  label?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  onFileDeleted,
  currentImagePath,
  folderPath,
  label = 'Upload Image',
  accept = import.meta.env.VITE_UPLOAD_ALLOWED_TYPES || 'image/*',
  maxSize = parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE || '5242880') / (1024 * 1024), // Convert bytes to MB
  className = ''
}) => {
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError('')
    setUploading(true)

    try {
      const response: ApiResponse<FileUploadData> = await fileUploadService.uploadFile(file, folderPath)
      
      if (response.success && response.data) {
        setError('')
        onFileUploaded(response.data.filePath, response.data.fileUrl)
      } else {
        setError(response.message || 'Upload failed')
      }
    } catch (error) {
      console.error('File upload error:', error)
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentImagePath) return

    try {
      await fileUploadService.deleteFile(currentImagePath)
      onFileDeleted?.()
    } catch (error) {
      console.error('File deletion error:', error)
      setError('Failed to delete file. Please try again.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const hasImage = currentImagePath || false

  return (
    <Box className={`flex flex-col items-center space-y-4 ${className}`}>
      {error && (
        <Alert severity="error" className="w-full">
          {error}
        </Alert>
      )}

      {uploading && (
        <Box className="flex items-center justify-center">
          <CircularProgress size={40} style={{ color: uiTheme.primary }} />
        </Box>
      )}

      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={handleUploadClick}
        disabled={uploading}
        style={{
          borderColor: uiTheme.primary,
          color: uiTheme.primary
        }}
        className="hover:bg-opacity-10"
      >
        {uploading ? 'Uploading...' : label}
      </Button>

      {hasImage && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={uploading}
          className="hover:bg-red-50"
        >
          Remove Image
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <Typography
        variant="caption"
        style={{ color: uiTheme.textSecondary }}
        className="text-center"
      >
        Supported formats: JPG, PNG, GIF
        <br />
        Maximum size: {maxSize}MB
      </Typography>
    </Box>
  )
}

export default FileUpload
