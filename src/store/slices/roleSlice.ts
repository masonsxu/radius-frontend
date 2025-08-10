import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  Role,
  Permission,
  ListRolesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsToRoleRequest,
  RemovePermissionsFromRoleRequest,
  RoleResponse,
  BatchRoleResponse,
  BatchPermissionResponse,
  BaseResponse,
  PageResponse
} from '../../types';
import { roleService } from '../../services/role';

interface RoleState {
  roles: Role[];
  currentRole: Role | null;
  rolePermissions: Permission[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
  permissionsPagination: PageResponse | null;
}

const initialState: RoleState = {
  roles: [],
  currentRole: null,
  rolePermissions: [],
  loading: false,
  error: null,
  pagination: null,
  permissionsPagination: null,
};

// 异步获取角色列表
export const fetchRolesAsync = createAsyncThunk(
  'role/fetchRoles',
  async (params: ListRolesRequest) => {
    const response = await roleService.getRoles(params);
    return response;
  },
);

// 异步获取角色详情
export const fetchRoleByIdAsync = createAsyncThunk(
  'role/fetchRoleById',
  async (id: number) => {
    const response = await roleService.getRoleById(id.toString());
    return response;
  },
);

// 异步创建角色
export const createRoleAsync = createAsyncThunk(
  'role/createRole',
  async (roleData: CreateRoleRequest) => {
    const response = await roleService.createRole(roleData);
    return response;
  },
);

// 异步更新角色
export const updateRoleAsync = createAsyncThunk(
  'role/updateRole',
  async ({ id, data }: { id: number; data: UpdateRoleRequest }) => {
    const response = await roleService.updateRole(id.toString(), data);
    return { response, id, data };
  },
);

// 异步删除角色
export const deleteRoleAsync = createAsyncThunk(
  'role/deleteRole',
  async (id: number) => {
    const response = await roleService.deleteRole(id.toString());
    return { response, id };
  },
);

// 异步批量删除角色
export const batchDeleteRolesAsync = createAsyncThunk(
  'role/batchDeleteRoles',
  async (ids: number[]) => {
    const response = await roleService.batchDeleteRoles(ids);
    return { response, ids };
  },
);

// 异步获取角色权限
export const fetchRolePermissionsAsync = createAsyncThunk(
  'role/fetchRolePermissions',
  async (roleId: number) => {
    const response = await roleService.getRolePermissions(roleId.toString());
    return response;
  },
);

// 异步为角色分配权限
export const assignPermissionsToRoleAsync = createAsyncThunk(
  'role/assignPermissionsToRole',
  async (data: AssignPermissionsToRoleRequest) => {
    const response = await roleService.assignPermissionsToRole(data);
    return response;
  },
);

// 异步从角色移除权限
export const removePermissionsFromRoleAsync = createAsyncThunk(
  'role/removePermissionsFromRole',
  async (data: RemovePermissionsFromRoleRequest) => {
    const response = await roleService.removePermissionsFromRole(data);
    return response;
  },
);

// 异步搜索角色
export const searchRolesAsync = createAsyncThunk(
  'role/searchRoles',
  async (keyword: string) => {
    const response = await roleService.searchRoles(keyword);
    return response;
  },
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
    clearRolePermissions: (state) => {
      state.rolePermissions = [];
      state.permissionsPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取角色列表
      .addCase(fetchRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesAsync.fulfilled, (state, action: PayloadAction<BatchRoleResponse>) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(fetchRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取角色列表失败';
      })
      // 获取角色详情
      .addCase(fetchRoleByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleByIdAsync.fulfilled, (state, action: PayloadAction<RoleResponse>) => {
        state.loading = false;
        state.currentRole = action.payload.role;
        state.error = null;
      })
      .addCase(fetchRoleByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取角色详情失败';
      })
      // 创建角色
      .addCase(createRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action: PayloadAction<RoleResponse>) => {
        state.loading = false;
        state.roles.unshift(action.payload.role);
        state.error = null;
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建角色失败';
      })
      // 更新角色
      .addCase(updateRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.roles.findIndex(role => role.id === id);
        if (index !== -1) {
          state.roles[index] = { ...state.roles[index], ...data };
        }
        if (state.currentRole && state.currentRole.id === id) {
          state.currentRole = { ...state.currentRole, ...data };
        }
        state.error = null;
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新角色失败';
      })
      // 删除角色
      .addCase(deleteRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.roles = state.roles.filter(role => role.id !== id);
        if (state.currentRole && state.currentRole.id === id) {
          state.currentRole = null;
        }
        state.error = null;
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除角色失败';
      })
      // 批量删除角色
      .addCase(batchDeleteRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchDeleteRolesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { ids } = action.payload;
        state.roles = state.roles.filter(role => !ids.includes(role.id));
        state.error = null;
      })
      .addCase(batchDeleteRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '批量删除角色失败';
      })
      // 获取角色权限
      .addCase(fetchRolePermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolePermissionsAsync.fulfilled, (state, action: PayloadAction<BatchPermissionResponse>) => {
        state.loading = false;
        state.rolePermissions = action.payload.permissions;
        state.permissionsPagination = action.payload.page;
        state.error = null;
      })
      .addCase(fetchRolePermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取角色权限失败';
      })
      // 分配权限
      .addCase(assignPermissionsToRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPermissionsToRoleAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(assignPermissionsToRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '分配权限失败';
      })
      // 移除权限
      .addCase(removePermissionsFromRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePermissionsFromRoleAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removePermissionsFromRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '移除权限失败';
      })
      // 搜索角色
      .addCase(searchRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRolesAsync.fulfilled, (state, action: PayloadAction<BatchRoleResponse>) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(searchRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '搜索角色失败';
      });
  },
});

export const { clearError, clearCurrentRole, clearRolePermissions } = roleSlice.actions;

// 导出别名以保持一致性
export const fetchRoles = fetchRolesAsync;
export const fetchRoleById = fetchRoleByIdAsync;
export const createRole = createRoleAsync;
export const updateRole = updateRoleAsync;
export const deleteRole = deleteRoleAsync;
export const batchDeleteRoles = batchDeleteRolesAsync;
export const fetchRolePermissions = fetchRolePermissionsAsync;
export const assignPermissionsToRole = assignPermissionsToRoleAsync;
export const removePermissionsFromRole = removePermissionsFromRoleAsync;
export const searchRoles = searchRolesAsync;

export default roleSlice.reducer;