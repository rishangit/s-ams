import path from 'path'
import fs from 'fs'

// Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const folderPath = req.query.folderPath || 'general'

    const fileName = req.file.filename
    const originalName = req.file.originalname
    const fileSize = req.file.size
    const mimeType = req.file.mimetype

    // Create relative path for database storage (normalize to forward slashes for URLs)
    const relativePath = path.join(folderPath, fileName).replace(/\\/g, '/')
    
    // Create full URL path for frontend access
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const fileUrl = `${baseUrl}/uploads/${relativePath}`

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: fileName,
        originalName: originalName,
        filePath: relativePath,
        fileUrl: fileUrl,
        fileSize: fileSize,
        mimeType: mimeType,
        folderPath: folderPath
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during file upload'
    })
  }
}

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { filePath } = req.params
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      })
    }

    const uploadsDir = path.join(process.cwd(), 'uploads')
    const fullPath = path.join(uploadsDir, filePath.replace(/\//g, path.sep))

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    // Delete file
    fs.unlinkSync(fullPath)

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('File deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during file deletion'
    })
  }
}

// Get file info
export const getFileInfo = async (req, res) => {
  try {
    const { filePath } = req.params
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      })
    }

    const uploadsDir = path.join(process.cwd(), 'uploads')
    const fullPath = path.join(uploadsDir, filePath.replace(/\//g, path.sep))

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    // Get file stats
    const stats = fs.statSync(fullPath)
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const fileUrl = `${baseUrl}/uploads/${filePath}`

    res.status(200).json({
      success: true,
      data: {
        fileName: path.basename(filePath),
        filePath: filePath,
        fileUrl: fileUrl,
        fileSize: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    })
  } catch (error) {
    console.error('Get file info error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting file info'
    })
  }
}
