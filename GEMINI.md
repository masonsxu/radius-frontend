# Gemini Code Assistant Context

## Project Overview

This is a frontend project for a Radius management system, built with React, TypeScript, and Vite. It uses Ant Design for UI components, Redux Toolkit for state management, and React Router for routing. The project is set up with ESLint for code linting and Prettier for code formatting.

## Building and Running

### Development

To run the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:5173` and accessible from any network interface.

### Building for Production

To create a production build:

```bash
npm run build
```

The production files will be located in the `dist` directory.

### Linting

To lint the codebase:

```bash
npm run lint
```

## Development Conventions

### Routing

The application uses `react-router-dom` for routing. Routes are defined in `src/router/routes.ts`. The application uses a centralized routing configuration, with lazy loading for each route.

### State Management

The application uses Redux Toolkit for state management. The Redux store is configured in `src/store/index.ts`. The state is divided into slices for different features of the application.

### API Communication

The application uses `axios` to communicate with the backend API. The API service files are located in `src/services`.

### Styling

The project uses CSS modules for component-level styling and global CSS files for application-wide styles. Ant Design components are used for the UI.
