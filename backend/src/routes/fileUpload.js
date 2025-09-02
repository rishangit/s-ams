import express from 'express'
import { uploadFile, deleteFile, getFileInfo } from '../controllers/fileUploadController.js'
import { uploadSingle, handleUploadError } from '../middleware/fileUpload.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Upload file route
router.post('/upload', 
  authenticateToken, 
  uploadSingle, 
  handleUploadError, 
  uploadFile
)

// Delete file route
router.delete('/delete/:filePath(*)', 
  authenticateToken, 
  deleteFile
)

// Get file info route
router.get('/info/:filePath(*)', 
  authenticateToken, 
  getFileInfo
)

export default router
