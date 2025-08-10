import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routeConfig } from './routes';
import PrivateRoute from '../components/common/PrivateRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

// 递归生成路由
const generateRoutes = (routes: any[]) => {
  return routes.map(route => ({
    path: route.path,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {route.public ? (
          <route.element />
        ) : (
          <PrivateRoute permission={route.permission}>
            <route.element />
          </PrivateRoute>
        )}
      </Suspense>
    ),
    children: route.children ? generateRoutes(route.children) : undefined,
  }));
};

const router = createBrowserRouter(generateRoutes(routeConfig));

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;