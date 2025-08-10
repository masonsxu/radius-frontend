import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  User, 
  ListUsersRequest, 
  CreateUserRequest, 
  UpdateUserRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  BatchUserResponse,
  UserResponse,
  BaseResponse,
  PageResponse,
} from '../../types';
import { userService } from '../../services/user';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: null,
};

// 异步获取用户列表
export const fetchUsersAsync = createAsyncThunk(
  'user/fetchUsers',
  async (params: ListUsersRequest) => {
    const response = await userService.getUsers(params);
    return response;
  },
);

// 异步获取用户详情
export const fetchUserByIdAsync = createAsyncThunk(
  'user/fetchUserById',
  async (id: string) => {
    const response = await userService.getUserById(id);
    return response;
  },
);

// 异步创建用户
export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData: CreateUserRequest) => {
    const response = await userService.createUser(userData);
    return response;
  },
);

// 异步更新用户
export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async (userData: UpdateUserRequest) => {
    const response = await userService.updateUser(userData);
    return { response, userData };
  },
);

// 异步更新用户状态
export const updateUserStatusAsync = createAsyncThunk(
  'user/updateUserStatus',
  async ({ userId, isEnabled }: { userId: string, isEnabled: boolean }) => {
    const response = await userService.updateUser({ id: userId, isEnabled });
    return { response, userId, isEnabled };
  },
);

// 异步删除用户
export const deleteUserAsync = createAsyncThunk(
  'user/deleteUser',
  async (id: string) => {
    const response = await userService.deleteUser(id);
    return { response, id };
  },
);

// 异步更新用户密码
export const updatePasswordAsync = createAsyncThunk(
  'user/updatePassword',
  async (data: UpdatePasswordRequest) => {
    const response = await userService.updatePassword(data);
    return response;
  },
);

// 异步重置用户密码
export const resetPasswordAsync = createAsyncThunk(
  'user/resetPassword',
  async (data: ResetPasswordRequest) => {
    const response = await userService.resetPassword(data);
    return response;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户列表
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action: PayloadAction<BatchUserResponse>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.page || null;
        state.error = null;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户列表失败';
      })
      // 获取用户详情
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.loading = false;
        state.currentUser = action.payload.user || null;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户详情失败';
      })
      // 创建用户
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.loading = false;
        if (action.payload.user) {
          state.users.unshift(action.payload.user);
        }
        state.error = null;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建用户失败';
      })
      // 更新用户
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { userData } = action.payload;
        const index = state.users.findIndex(user => user.id === userData.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...userData };
        }
        if (state.currentUser && state.currentUser.id === userData.id) {
          state.currentUser = { ...state.currentUser, ...userData };
        }
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新用户失败';
      })
      // 更新用户状态
      .addCase(updateUserStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, isEnabled } = action.payload;
        const index = state.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          state.users[index].isEnabled = isEnabled;
        }
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser.isEnabled = isEnabled;
        }
        state.error = null;
      })
      .addCase(updateUserStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新用户状态失败';
      })
      // 删除用户
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.users = state.users.filter(user => user.id !== id);
        if (state.currentUser && state.currentUser.id === id) {
          state.currentUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除用户失败';
      })
      // 更新密码
      .addCase(updatePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新密码失败';
      })
      // 重置密码
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '重置密码失败';
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;