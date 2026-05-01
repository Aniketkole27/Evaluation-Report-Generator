import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routes/public';
import { appRoutes } from './routes/app';

/**
 * Main Router configuration
 * We split routes into public and app (protected) for better maintainability.
 * Standard practices followed:
 * 1. Modular route definitions
 * 2. Layout-based nesting
 * 3. Role-based protection
 * 4. Centralized path constants
 */
export const router = createBrowserRouter([
    ...publicRoutes,
    appRoutes,
    // Catch-all route for 404
    {
        path: '*',
        element: <div className="h-screen flex items-center justify-center">404 - Page Not Found</div>,
    },
]);