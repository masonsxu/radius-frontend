import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Permission,
  ListPermissionsRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionResponse,
  BatchPermissionResponse,
  BaseResponse,
  PageResponse
} from '../../types';
import { permissionService } from '../../services/permission';

interface PermissionState {
  permissions: Permission[];
  currentPermission: Permission | null;
  permissionTree: Permission[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
}

const initialState: PermissionState = {
  permissions: [],
  currentPermission: null,
  permissionTree: [],
  loading: false,
  error: null,
  pagination: null,
};

// 异步获取权限列表
export const fetchPermissionsAsync = createAsyncThunk(
  'permission/fetchPermissions',
  async (params: ListPermissionsRequest) => {
    const response = await permissionService.getPermissions(params);
    return response;
  },
);

// 异步获取权限详情
export const fetchPermissionByIdAsync = createAsyncThunk(
  'permission/fetchPermissionById',
  async (id: number) => {
    const response = await permissionService.getPermissionById(id.toString());
    return response;
  },
);

// 异步创建权限
export const createPermissionAsync = createAsyncThunk(
  'permission/createPermission',
  async (permissionData: CreatePermissionRequest) => {
    const response = await permissionService.createPermission(permissionData);
    return response;
  },
);

// 异步更新权限
export const updatePermissionAsync = createAsyncThunk(
  'permission/updatePermission',
  async ({ id, data }: { id: number; data: UpdatePermissionRequest }) => {
    const response = await permissionService.updatePermission(id.toString(), data);
    return { response, id, data };
  },
);

// 异步删除权限
export const deletePermissionAsync = createAsyncThunk(
  'permission/deletePermission',
  async (id: number) => {
    const response = await permissionService.deletePermission(id.toString());
    return { response, id };
  },
);

// 异步批量删除权限
export const batchDeletePermissionsAsync = createAsyncThunk(
  'permission/batchDeletePermissions',
  async (ids: number[]) => {
    const response = await permissionService.batchDeletePermissions(ids);
    return { response, ids };
  },
);

// 异步获取权限树
export const fetchPermissionTreeAsync = createAsyncThunk(
  'permission/fetchPermissionTree',
  async () => {
    const response = await permissionService.getPermissionTree();
    return response;
  },
);

// 异步搜索权限
export const searchPermissionsAsync = createAsyncThunk(
  'permission/searchPermissions',
  async (keyword: string) => {
    const response = await permissionService.searchPermissions(keyword);
    return response;
  },
);

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPermission: (state) => {
      state.currentPermission = null;
    },
    clearPermissionTree: (state) => {
      state.permissionTree = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取权限列表
      .addCase(fetchPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsAsync.fulfilled, (state, action: PayloadAction<BatchPermissionResponse>) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(fetchPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取权限列表失败';
      })
      // 获取权限详情
      .addCase(fetchPermissionByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionByIdAsync.fulfilled, (state, action: PayloadAction<PermissionResponse>) => {
        state.loading = false;
        state.currentPermission = action.payload.permission;
        state.error = null;
      })
      .addCase(fetchPermissionByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取权限详情失败';
      })
      // 创建权限
      .addCase(createPermissionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionAsync.fulfilled, (state, action: PayloadAction<PermissionResponse>) => {
        state.loading = false;
        state.permissions.unshift(action.payload.permission);
        state.error = null;
      })
      .addCase(createPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建权限失败';
      })
      // 更新权限
      .addCase(updatePermissionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissionAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.permissions.findIndex(permission => permission.id === id);
        if (index !== -1) {
          state.permissions[index] = { ...state.permissions[index], ...data };
        }
        if (state.currentPermission && state.currentPermission.id === id) {
          state.currentPermission = { ...state.currentPermission, ...data };
        }
        state.error = null;
      })
      .addCase(updatePermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新权限失败';
      })
      // 删除权限
      .addCase(deletePermissionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermissionAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.permissions = state.permissions.filter(permission => permission.id !== id);
        if (state.currentPermission && state.currentPermission.id === id) {
          state.currentPermission = null;
        }
        state.error = null;
      })
      .addCase(deletePermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除权限失败';
      })
      // 批量删除权限
      .addCase(batchDeletePermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchDeletePermissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { ids } = action.payload;
        state.permissions = state.permissions.filter(permission => !ids.includes(permission.id));
        state.error = null;
      })
      .addCase(batchDeletePermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '批量删除权限失败';
      })
      // 获取权限树
      .addCase(fetchPermissionTreeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionTreeAsync.fulfilled, (state, action: PayloadAction<BatchPermissionResponse>) => {
        state.loading = false;
        state.permissionTree = action.payload.permissions;
        state.error = null;
      })
      .addCase(fetchPermissionTreeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取权限树失败';
      })
      // 搜索权限
      .addCase(searchPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPermissionsAsync.fulfilled, (state, action: PayloadAction<BatchPermissionResponse>) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(searchPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '搜索权限失败';
      });
  },
});

export const { clearError, clearCurrentPermission, clearPermissionTree } = permissionSlice.actions;

// 导出别名以保持一致性
export const fetchPermissions = fetchPermissionsAsync;
export const fetchPermissionById = fetchPermissionByIdAsync;
export const createPermission = createPermissionAsync;
export const updatePermission = updatePermissionAsync;
export const deletePermission = deletePermissionAsync;
export const batchDeletePermissions = batchDeletePermissionsAsync;
export const fetchPermissionTree = fetchPermissionTreeAsync;
export const searchPermissions = searchPermissionsAsync;

export default permissionSlice.reducer;