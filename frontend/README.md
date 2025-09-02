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
