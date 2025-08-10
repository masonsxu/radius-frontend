import React from 'react';
import { Navigate } from 'react-router-dom';

// 路由配置接口
export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  children?: RouteConfig[];
  public?: boolean;
  permission?: string;
}

// 懒加载页面组件
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const MainLayout = React.lazy(() => import('../components/layout/MainLayout'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserList = React.lazy(() => import('../pages/user/UserList'));
const UserCreate = React.lazy(() => import('../pages/user/UserCreate'));
const UserEdit = React.lazy(() => import('../pages/user/UserEdit'));
const UserDetail = React.lazy(() => import('../pages/user/UserDetail'));
const GroupList = React.lazy(() => import('../pages/group/GroupList'));
const GroupCreate = React.lazy(() => import('../pages/group/GroupCreate'));
const GroupEdit = React.lazy(() => import('../pages/group/GroupEdit'));
const GroupDetail = React.lazy(() => import('../pages/group/GroupDetail'));
const PermissionList = React.lazy(() => import('../pages/permission/PermissionList'));
const PermissionCreate = React.lazy(() => import('../pages/permission/PermissionCreate'));
const PermissionEdit = React.lazy(() => import('../pages/permission/PermissionEdit'));
const RoleList = React.lazy(() => import('../pages/role/RoleList'));

// 路由配置
export const routeConfig: RouteConfig[] = [
  {
    path: '/login',
    element: LoginPage,
    public: true,
  },
  {
    path: '/',
    element: MainLayout,
    children: [
      {
        path: '',
        element: function Redirect() { return React.createElement(Navigate, { to: '/dashboard', replace: true }); },
      },
      {
        path: 'dashboard',
        element: Dashboard,
      },
      {
        path: 'users',
        element: UserList,
        permission: 'user:list',
      },
      {
        path: 'users/create',
        element: UserCreate,
        permission: 'user:create',
      },
      {
        path: 'users/:id/edit',
        element: UserEdit,
        permission: 'user:update',
      },
      {
        path: 'users/:id',
        element: UserDetail,
        permission: 'user:view',
      },
      {
        path: 'groups',
        element: GroupList,
        permission: 'group:list',
      },
      {
        path: 'groups/create',
        element: GroupCreate,
        permission: 'group:create',
      },
      {
        path: 'groups/:id/edit',
        element: GroupEdit,
        permission: 'group:update',
      },
      {
        path: 'groups/:id',
        element: GroupDetail,
        permission: 'group:view',
      },
      {
        path: 'permissions',
        element: PermissionList,
        permission: 'permission:list',
      },
      {
        path: 'permissions/create',
        element: PermissionCreate,
        permission: 'permission:create',
      },
      {
        path: 'permissions/:id/edit',
        element: PermissionEdit,
        permission: 'permission:update',
      },
      {
        path: 'roles',
        element: RoleList,
        permission: 'role:list',
      },
    ],
  },
];

// 获取扁平化路由列表
export const getFlatRoutes = (routes: RouteConfig[], parentPath = ''): RouteConfig[] => {
  const flatRoutes: RouteConfig[] = [];
  
  routes.forEach(route => {
    const fullPath = parentPath + route.path;
    flatRoutes.push({ ...route, path: fullPath });
    
    if (route.children) {
      flatRoutes.push(...getFlatRoutes(route.children, fullPath + '/'));
    }
  });
  
  return flatRoutes;
};