import { apiService, ApiResponse } from './api'
// import { getFileUrl } from '../utils/fileUtils'

export interface FileUploadData {
  fileName: string
  originalName: string
  filePath: string
  fileUrl: string
  fileSize: number
  mimeType: string
  folderPath: string
}

export interface FileUploadResponse {
  success: boolean
  message: string
  data: FileUploadData
}

export interface FileInfoResponse {
  success: boolean
  data: {
    fileName: string
    filePath: string
    fileUrl: string
    fileSize: number
    createdAt: string
    modifiedAt: string
  }
}

class FileUploadService {
  private baseUrl = '/files'

  async uploadFile(file: File, folderPath: string): Promise<ApiResponse<FileUploadData>> {
    const formData = new FormData()
    formData.append('file', file)
    // Remove folderPath from FormData since it's not accessible to multer
    


    // Get the auth token
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await apiService.request<FileUploadData>(`${this.baseUrl}/upload?folderPath=${encodeURIComponent(folderPath)}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
    })

    return response
  }

  async deleteFile(filePath: string): Promise<{ success: boolean; message: string }> {
    // Get the auth token
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await apiService.request<{ success: boolean; message: string }>(`${this.baseUrl}/delete/${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return response.data!
  }

  async getFileInfo(filePath: string): Promise<FileInfoResponse> {
    // Get the auth token
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await apiService.request<FileInfoResponse>(`${this.baseUrl}/info/${encodeURIComponent(filePath)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return response.data!
  }


}

export const fileUploadService = new FileUploadService()
