import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  Group, 
  ListGroupsRequest, 
  CreateGroupRequest, 
  UpdateGroupRequest,
  AssignRolesToGroupRequest,
  RemoveRolesFromGroupRequest,
  BatchGroupResponse,
  GroupResponse,
  BatchRoleResponse,
  BaseResponse,
  PageResponse,
  Role,
} from '../../types';
import { groupService } from '../../services/group';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  groupRoles: Role[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
  rolesPagination: PageResponse | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  groupRoles: [],
  loading: false,
  error: null,
  pagination: null,
  rolesPagination: null,
};

// 异步获取组织列表
export const fetchGroupsAsync = createAsyncThunk(
  'group/fetchGroups',
  async (params: ListGroupsRequest) => {
    const response = await groupService.getGroups(params);
    return response;
  },
);

// 异步获取组织详情
export const fetchGroupByIdAsync = createAsyncThunk(
  'group/fetchGroupById',
  async (id: number) => {
    const response = await groupService.getGroupById(id.toString());
    return response;
  },
);

// 异步创建组织
export const createGroupAsync = createAsyncThunk(
  'group/createGroup',
  async (groupData: CreateGroupRequest) => {
    const response = await groupService.createGroup(groupData);
    return response;
  },
);

// 异步更新组织
export const updateGroupAsync = createAsyncThunk(
  'group/updateGroup',
  async ({ id, data }: { id: number; data: UpdateGroupRequest }) => {
    const response = await groupService.updateGroup({ ...data, id: id.toString() });
    return { response, id: id.toString(), data };
  },
);

// 异步删除组织
export const deleteGroupAsync = createAsyncThunk(
  'group/deleteGroup',
  async (id: number) => {
    const response = await groupService.deleteGroup(id.toString());
    return { response, id: id.toString() };
  },
);

// 异步获取组织角色
export const fetchGroupRolesAsync = createAsyncThunk(
  'group/fetchGroupRoles',
  async (groupId: string) => {
    const response = await groupService.getGroupRoles(groupId);
    return response;
  },
);

// 异步为组织分配角色
export const assignRolesToGroupAsync = createAsyncThunk(
  'group/assignRolesToGroup',
  async (data: AssignRolesToGroupRequest) => {
    const response = await groupService.assignRolesToGroup(data);
    return response;
  },
);

// 异步从组织移除角色
export const removeRolesFromGroupAsync = createAsyncThunk(
  'group/removeRolesFromGroup',
  async (data: RemoveRolesFromGroupRequest) => {
    const response = await groupService.removeRolesFromGroup(data);
    return response;
  },
);

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearGroupRoles: (state) => {
      state.groupRoles = [];
      state.rolesPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取组织列表
      .addCase(fetchGroupsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsAsync.fulfilled, (state, action: PayloadAction<BatchGroupResponse>) => {
        state.loading = false;
        state.groups = action.payload.groups;
        state.pagination = action.payload.page || null;
        state.error = null;
      })
      .addCase(fetchGroupsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取组织列表失败';
      })
      // 获取组织详情
      .addCase(fetchGroupByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupByIdAsync.fulfilled, (state, action: PayloadAction<GroupResponse>) => {
        state.loading = false;
        state.currentGroup = action.payload.group || null;
        state.error = null;
      })
      .addCase(fetchGroupByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取组织详情失败';
      })
      // 创建组织
      .addCase(createGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupAsync.fulfilled, (state, action: PayloadAction<GroupResponse>) => {
        state.loading = false;
        if (action.payload.group) {
          state.groups.unshift(action.payload.group);
        }
        state.error = null;
      })
      .addCase(createGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建组织失败';
      })
      // 更新组织
      .addCase(updateGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroupAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.groups.findIndex(group => group.id === id);
        if (index !== -1) {
          state.groups[index] = { ...state.groups[index], ...data };
        }
        if (state.currentGroup && state.currentGroup.id === id) {
          state.currentGroup = { ...state.currentGroup, ...data };
        }
        state.error = null;
      })
      .addCase(updateGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新组织失败';
      })
      // 删除组织
      .addCase(deleteGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroupAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.groups = state.groups.filter(group => group.id !== id);
        if (state.currentGroup && state.currentGroup.id === id) {
          state.currentGroup = null;
        }
        state.error = null;
      })
      .addCase(deleteGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除组织失败';
      })
      // 获取组织角色
      .addCase(fetchGroupRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupRolesAsync.fulfilled, (state, action: PayloadAction<BatchRoleResponse>) => {
        state.loading = false;
        state.groupRoles = action.payload.roles;
        state.rolesPagination = action.payload.page || null;
        state.error = null;
      })
      .addCase(fetchGroupRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取组织角色失败';
      })
      // 分配角色
      .addCase(assignRolesToGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRolesToGroupAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(assignRolesToGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '分配角色失败';
      })
      // 移除角色
      .addCase(removeRolesFromGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRolesFromGroupAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeRolesFromGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '移除角色失败';
      });
  },
});

export const { clearError, clearCurrentGroup, clearGroupRoles } = groupSlice.actions;

// 导出别名以保持一致性
export const fetchGroups = fetchGroupsAsync;
export const fetchGroupById = fetchGroupByIdAsync;
export const createGroup = createGroupAsync;
export const updateGroup = updateGroupAsync;
export const deleteGroup = deleteGroupAsync;
export const fetchGroupRoles = fetchGroupRolesAsync;
export const assignRolesToGroup = assignRolesToGroupAsync;
export const removeRolesFromGroup = removeRolesFromGroupAsync;

export default groupSlice.reducer;