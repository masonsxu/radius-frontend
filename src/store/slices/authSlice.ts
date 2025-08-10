import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import type { AuthState, LoginRequest, LoginResponse } from '../../types';

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
    // 存储令牌到sessionStorage
    sessionStorage.setItem('accessToken', response.accessToken);
    return response;
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
    const response = await authService.verifyToken();
    return response;
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
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.userInfo;
        state.token = action.payload.accessToken;
        // 从用户的角色中提取权限
        const permissions: string[] = [];
        action.payload.userInfo.roles?.forEach(role => {
          // 这里需要获取角色对应的权限，暂时先用空数组
        });
        state.permissions = permissions;
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
      .addCase(verifyTokenAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.userInfo;
          // 从用户的角色中提取权限
          const permissions: string[] = [];
          action.payload.userInfo.roles?.forEach(role => {
            // 这里需要获取角色对应的权限，暂时先用空数组
          });
          state.permissions = permissions;
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