import api from './api';
import type { 
  LoginRequest, 
  LoginResponse, 
  LogoutRequest, 
  RefreshTokenRequest,
  TokenVerifyRequest,
  TokenVerifyResponse,
  CheckPermissionRequest,
  CheckPermissionResponse 
} from '../types';

export const authService = {
  // 用户登录
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // 用户登出
  async logout(): Promise<void> {
    // 获取当前用户信息和令牌
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      const logoutRequest: LogoutRequest = {
        accessToken: token,
        userId: '', // 这里可以从当前登录用户获取
      };
      await api.post('/auth/logout', logoutRequest);
    }
  },

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const request: RefreshTokenRequest = {
      refreshToken,
    };
    const response = await api.post<LoginResponse>('/auth/refresh', request);
    return response.data;
  },

  // 验证令牌
  async verifyToken(): Promise<TokenVerifyResponse | null> {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return null;
    }

    try {
      const request: TokenVerifyRequest = {
        accessToken: token,
      };
      const response = await api.post<TokenVerifyResponse>('/auth/verify', request);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // 检查用户权限
  async checkPermission(userId: string, permissionCode: string, groupId?: string): Promise<boolean> {
    try {
      const request: CheckPermissionRequest = {
        userId,
        permissionCode,
        groupId,
      };
      const response = await api.post<CheckPermissionResponse>('/auth/check-permission', request);
      return response.data.hasPermission;
    } catch (error) {
      return false;
    }
  },
};