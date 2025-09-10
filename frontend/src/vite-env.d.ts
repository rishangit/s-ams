/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_SERVER_PORT: string
  readonly VITE_SERVER_HOST: string
  readonly VITE_UPLOAD_MAX_SIZE: string
  readonly VITE_UPLOAD_ALLOWED_TYPES: string
  readonly VITE_UPLOADS_BASE_URL: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_HOT_RELOAD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly DEV: boolean
  readonly PROD: boolean
}
