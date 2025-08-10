import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import { roleService } from '../../services/role';
import type { AuthState, LoginRequest, LoginResponse, TokenVerifyResponse } from '../../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: sessionStorage.getItem('accessToken'),
  permissions: [],
  loading: false,
  error: null,
};

// 异步登录操作
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    sessionStorage.setItem('accessToken', response.accessToken);

    const roles = response.userInfo.roles;
    if (roles && roles.length > 0) {
      const permissionPromises = roles.map(role => roleService.getRolePermissions(role.id));
      const permissionResponses = await Promise.all(permissionPromises);
      const permissions = permissionResponses.flatMap(res => res.permissions.map(p => p.code));
      const uniquePermissions = [...new Set(permissions)];
      return { ...response, permissions: uniquePermissions };
    }

    return { ...response, permissions: [] };
  },
);

// 异步登出操作
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
    sessionStorage.removeItem('accessToken');
  },
);

// 验证令牌
export const verifyTokenAsync = createAsyncThunk(
  'auth/verify',
  async () => {
    try {
      const response = await authService.verifyToken();
      if (response) {
        const roles = response.userInfo.roles;
        if (roles && roles.length > 0) {
          const permissionPromises = roles.map(role => roleService.getRolePermissions(role.id));
          const permissionResponses = await Promise.all(permissionPromises);
          const permissions = permissionResponses.flatMap(res => res.permissions.map(p => p.code));
          const uniquePermissions = [...new Set(permissions)];
          return { ...response, permissions: uniquePermissions };
        }
        return { ...response, permissions: [] };
      }
      return null;
    } catch (error) {
      return null;
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('accessToken', action.payload);
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.permissions = [];
      sessionStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse & { permissions: string[] }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.userInfo;
        state.token = action.payload.accessToken;
        state.permissions = action.payload.permissions;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '登录失败';
      })
      // 登出
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
      })
      // 验证令牌
      .addCase(verifyTokenAsync.fulfilled, (state, action: PayloadAction<(TokenVerifyResponse & { permissions: string[] }) | null>) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.userInfo;
          state.permissions = action.payload.permissions;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.permissions = [];
          sessionStorage.removeItem('accessToken');
        }
      })
      .addCase(verifyTokenAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        sessionStorage.removeItem('accessToken');
      });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;