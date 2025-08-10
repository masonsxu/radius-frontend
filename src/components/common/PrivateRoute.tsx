import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface PrivateRouteProps {
  children: React.ReactNode;
  permission?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permission }) => {
  const { isAuthenticated, userPermissions, loading } = useAppSelector(state => state.auth);
  const location = useLocation();

  // 正在验证登录状态时显示加载
  if (loading) {
    return <div>Loading...</div>;
  }

  // 未登录时重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 需要权限验证且用户没有权限时
  if (permission && !userPermissions.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;