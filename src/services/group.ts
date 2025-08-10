import api from './api';
import type {
  ListGroupsRequest,
  BatchGroupResponse,
  CreateGroupRequest,
  GroupResponse,
  UpdateGroupRequest,
  AssignRolesToGroupRequest,
  RemoveRolesFromGroupRequest,
  BatchRoleResponse,
  BaseResponse,
} from '../types';

export const groupService = {
  // 获取组织列表
  async getGroups(params: ListGroupsRequest): Promise<BatchGroupResponse> {
    const response = await api.get<BatchGroupResponse>('/groups', { data: params });
    return response.data;
  },

  // 获取组织详情
  async getGroupById(id: string): Promise<GroupResponse> {
    const response = await api.get<GroupResponse>(`/group/${id}`);
    return response.data;
  },

  // 创建组织
  async createGroup(groupData: CreateGroupRequest): Promise<GroupResponse> {
    const response = await api.post<GroupResponse>('/group', groupData);
    return response.data;
  },

  // 更新组织信息
  async updateGroup(groupData: UpdateGroupRequest): Promise<BaseResponse> {
    const response = await api.put<BaseResponse>(`/group/${groupData.id}`, groupData);
    return response.data;
  },

  // 删除组织
  async deleteGroup(id: string): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/group/${id}`);
    return response.data;
  },

  // 获取组织关联的角色
  async getGroupRoles(groupId: string): Promise<BatchRoleResponse> {
    const response = await api.get<BatchRoleResponse>(`/group/${groupId}/roles`);
    return response.data;
  },

  // 为组织分配角色
  async assignRolesToGroup(data: AssignRolesToGroupRequest): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(`/group/${data.groupId}/roles`, data);
    return response.data;
  },

  // 从组织移除角色
  async removeRolesFromGroup(data: RemoveRolesFromGroupRequest): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/group/${data.groupId}/roles`, { data });
    return response.data;
  },
};