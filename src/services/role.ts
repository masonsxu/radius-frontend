import { api } from './api';
import type { 
  Role,
  ListRolesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsToRoleRequest,
  RemovePermissionsFromRoleRequest,
  RoleResponse,
  BatchRoleResponse,
  BatchPermissionResponse,
  BaseResponse
} from '../types';

export const roleService = {
  // 获取角色列表
  async getRoles(params: ListRolesRequest = {}): Promise<BatchRoleResponse> {
    const response = await api.get('/roles', { params });
    return response.data;
  },

  // 根据ID获取角色详情
  async getRoleById(id: string): Promise<RoleResponse> {
    const response = await api.get(`/role/${id}`);
    return response.data;
  },

  // 创建角色
  async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    const response = await api.post('/role', data);
    return response.data;
  },

  // 更新角色
  async updateRole(id: string, data: UpdateRoleRequest): Promise<BaseResponse> {
    const response = await api.put(`/role/${id}`, data);
    return response.data;
  },

  // 删除角色
  async deleteRole(id: string): Promise<BaseResponse> {
    const response = await api.delete(`/role/${id}`);
    return response.data;
  },

  // 批量删除角色
  async batchDeleteRoles(ids: number[]): Promise<BaseResponse> {
    const response = await api.post('/roles/batch-delete', { ids });
    return response.data;
  },

  // 获取角色的权限列表
  async getRolePermissions(roleId: string): Promise<BatchPermissionResponse> {
    const response = await api.get(`/role/${roleId}/permissions`);
    return response.data;
  },

  // 为角色分配权限
  async assignPermissionsToRole(data: AssignPermissionsToRoleRequest): Promise<BaseResponse> {
    const response = await api.post('/role/assign-permissions', data);
    return response.data;
  },

  // 从角色移除权限
  async removePermissionsFromRole(data: RemovePermissionsFromRoleRequest): Promise<BaseResponse> {
    const response = await api.post('/role/remove-permissions', data);
    return response.data;
  },

  // 搜索角色
  async searchRoles(keyword: string): Promise<BatchRoleResponse> {
    const response = await api.get('/roles/search', { 
      params: { keyword } 
    });
    return response.data;
  }
};

export default roleService;