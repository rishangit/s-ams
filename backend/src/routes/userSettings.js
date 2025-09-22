import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  getUserSettings,
  updateUserSettings,
  resetUserSettings
} from '../controllers/userSettingsController.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// GET /api/user-settings - Get user settings
router.get('/', getUserSettings)

// PUT /api/user-settings - Update user settings
router.put('/', updateUserSettings)

// POST /api/user-settings/reset - Reset user settings to defaults
router.post('/reset', resetUserSettings)

export default router

