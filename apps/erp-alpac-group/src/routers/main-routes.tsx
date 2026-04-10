import { LoginPage } from '@app/modules/auth/ui/pages/login/login.page';
import { Navigate, type RouteObject } from 'react-router-dom';
import { DashboardRoutes } from './dashboard-routes';
import { AuthGuard, PublicGuard } from './guardians';

export const MainRoutes: RouteObject[] = [
   {
      path: '/',
      element: <Navigate to="/auth" replace />,
   },
   {
      element: <PublicGuard />,
      children: [
         {
            path: 'auth',
            element: <LoginPage />,
         },
      ],
   },
   {
      path: ':alias_company',
      element: <AuthGuard />,

      children: [
         {
            index: true,
            element: <Navigate to="dashboard" replace />,
         },
         {
            path: 'dashboard',
            children: DashboardRoutes,
         },
      ],
   },
   {
      path: '*',
      element: <Navigate to="/auth" replace />,
   },
];
