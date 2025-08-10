import api from './api';
import type {
  ListUsersRequest,
  BatchUserResponse,
  CreateUserRequest,
  UserResponse,
  UpdateUserRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  AddUserToGroupsRequest,
  RemoveUserFromGroupsRequest,
  GetUserAllPermissionsRequest,
  BatchPermissionResponse,
  BatchGroupResponse,
  BaseResponse,
} from '../types';

export const userService = {
  // 获取用户列表
  async getUsers(params: ListUsersRequest): Promise<BatchUserResponse> {
    const response = await api.get<BatchUserResponse>('/users', { data: params });
    return response.data;
  },

  // 获取用户详情
  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/user/info/${id}`);
    return response.data;
  },

  // 创建用户
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/user/create', userData);
    return response.data;
  },

  // 更新用户信息
  async updateUser(userData: UpdateUserRequest): Promise<BaseResponse> {
    const response = await api.put<BaseResponse>(`/user/${userData.id}`, userData);
    return response.data;
  },

  // 删除用户
  async deleteUser(id: string): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/user/${id}`);
    return response.data;
  },

  // 更新用户密码
  async updatePassword(data: UpdatePasswordRequest): Promise<BaseResponse> {
    const response = await api.put<BaseResponse>(`/user/${data.userId}/password`, data);
    return response.data;
  },

  // 重置用户密码
  async resetPassword(data: ResetPasswordRequest): Promise<BaseResponse> {
    const response = await api.put<BaseResponse>(`/user/${data.userId}/reset-password`, data);
    return response.data;
  },

  // 获取用户所属组织
  async getUserGroups(userId: string): Promise<BatchGroupResponse> {
    const response = await api.get<BatchGroupResponse>(`/user/${userId}/groups`);
    return response.data;
  },

  // 将用户添加到组织
  async addUserToGroups(data: AddUserToGroupsRequest): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(`/user/${data.userId}/groups`, data);
    return response.data;
  },

  // 从组织中移除用户
  async removeUserFromGroups(data: RemoveUserFromGroupsRequest): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/user/${data.userId}/groups`, { data });
    return response.data;
  },

  // 获取用户所有权限
  async getUserAllPermissions(data: GetUserAllPermissionsRequest): Promise<BatchPermissionResponse> {
    const response = await api.get<BatchPermissionResponse>(`/user/${data.userId}/permissions`, { data });
    return response.data;
  },
};