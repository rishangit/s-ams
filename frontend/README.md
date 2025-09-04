# Frontend New - React Application

A modern React application built with TypeScript, Redux, Material UI, and Tailwind CSS.

## Features

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Material UI** components with custom styling
- **Tailwind CSS** for utility-first styling
- **React Router** for navigation
- **Component Showcase** at `/showcase` route

## Tech Stack

- React 18.2.0
- TypeScript 5.2.2
- Redux Toolkit 1.9.7
- Material UI 5.14.20
- Tailwind CSS 3.3.5
- Vite 4.5.0
- React Router DOM 6.20.1

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3001`

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_TIMEOUT=30000

# Server Configuration
VITE_SERVER_PORT=3001
VITE_SERVER_HOST=localhost

# File Upload Configuration
VITE_UPLOAD_MAX_SIZE=5242880
VITE_UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp
VITE_UPLOADS_BASE_URL=http://localhost:5001

# Authentication Configuration
VITE_AUTH_TOKEN_KEY=authToken
VITE_AUTH_REFRESH_TOKEN_KEY=refreshToken

# Application Configuration
VITE_APP_NAME=S-AMS
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Student Attendance Management System

# Feature Flags
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Development Tools
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_HOT_RELOAD=true
```

### Environment Variable Descriptions

- **VITE_API_BASE_URL**: Base URL for API endpoints
- **VITE_API_TIMEOUT**: API request timeout in milliseconds
- **VITE_SERVER_PORT**: Development server port
- **VITE_SERVER_HOST**: Development server host
- **VITE_UPLOAD_MAX_SIZE**: Maximum file upload size in bytes (5MB default)
- **VITE_UPLOAD_ALLOWED_TYPES**: Comma-separated list of allowed file types
- **VITE_UPLOADS_BASE_URL**: Base URL for file uploads and downloads
- **VITE_AUTH_TOKEN_KEY**: Local storage key for authentication token
- **VITE_AUTH_REFRESH_TOKEN_KEY**: Local storage key for refresh token
- **VITE_APP_NAME**: Application name
- **VITE_APP_VERSION**: Application version
- **VITE_APP_DESCRIPTION**: Application description
- **VITE_ENABLE_DEBUG_MODE**: Enable debug mode for development
- **VITE_ENABLE_ANALYTICS**: Enable analytics tracking
- **VITE_ENABLE_ERROR_REPORTING**: Enable error reporting
- **VITE_ENABLE_DEV_TOOLS**: Enable development tools
- **VITE_ENABLE_HOT_RELOAD**: Enable hot reload for development

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   └── shared/           # Material UI components with Tailwind styling
│       ├── ComponentShowcase.tsx
│       ├── CustomButton.tsx
│       ├── CustomCard.tsx
│       ├── CustomInput.tsx
│       ├── CustomModal.tsx
│       ├── CustomTabs.tsx
│       ├── CustomAlert.tsx
│       ├── CustomBadge.tsx
│       ├── CustomSelect.tsx
│       ├── CustomCheckbox.tsx
│       ├── CustomRadio.tsx
│       ├── CustomSwitch.tsx
│       ├── CustomSlider.tsx
│       ├── CustomProgress.tsx
│       ├── CustomSkeleton.tsx
│       ├── CustomTooltip.tsx
│       ├── CustomMenu.tsx
│       ├── CustomTable.tsx
│       ├── CustomPagination.tsx
│       └── CustomBreadcrumbs.tsx
├── store/                # Redux store configuration
│   ├── index.ts
│   └── reducers/
│       ├── index.ts
│       └── uiSlice.ts
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Component Showcase

Visit `/showcase` to see all available Material UI components with custom Tailwind CSS styling. The showcase includes:

- Buttons (Primary, Secondary, Success variants)
- Cards with user profiles
- Form inputs with icons
- Modal dialogs
- Tab navigation
- Alert messages
- Badge notifications
- Select dropdowns
- Checkboxes and radio buttons
- Switches and sliders
- Progress indicators
- Loading skeletons
- Tooltips
- Dropdown menus
- Data tables
- Pagination
- Breadcrumb navigation

## Styling

The application uses a combination of Material UI components and Tailwind CSS utilities:

- Material UI provides the base components and theming
- Tailwind CSS classes are used for custom styling and responsive design
- The `important: true` setting in `tailwind.config.js` ensures Tailwind classes can override Material UI styles when needed

## State Management

Redux Toolkit is used for state management with a simple UI slice that manages:
- Theme (light/dark)
- Sidebar open/close state
- Loading states

## Development

The application is configured with:
- Vite for fast development and building
- TypeScript for type safety
- ESLint for code quality
- PostCSS and Autoprefixer for CSS processing
