import { api } from './api';
import type { 
  Permission,
  ListPermissionsRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionResponse,
  BatchPermissionResponse,
  BaseResponse
} from '../types';

export const permissionService = {
  // 获取权限列表
  async getPermissions(params: ListPermissionsRequest = {}): Promise<BatchPermissionResponse> {
    const response = await api.get('/permissions', { params });
    return response.data;
  },

  // 根据ID获取权限详情
  async getPermissionById(id: string): Promise<PermissionResponse> {
    const response = await api.get(`/permission/${id}`);
    return response.data;
  },

  // 创建权限
  async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
    const response = await api.post('/permission', data);
    return response.data;
  },

  // 更新权限
  async updatePermission(id: string, data: UpdatePermissionRequest): Promise<BaseResponse> {
    const response = await api.put(`/permission/${id}`, data);
    return response.data;
  },

  // 删除权限
  async deletePermission(id: string): Promise<BaseResponse> {
    const response = await api.delete(`/permission/${id}`);
    return response.data;
  },

  // 批量删除权限
  async batchDeletePermissions(ids: number[]): Promise<BaseResponse> {
    const response = await api.post('/permissions/batch-delete', { ids });
    return response.data;
  },

  // 获取权限树形结构（用于权限选择器）
  async getPermissionTree(): Promise<BatchPermissionResponse> {
    const response = await api.get('/permissions/tree');
    return response.data;
  },

  // 搜索权限
  async searchPermissions(keyword: string): Promise<BatchPermissionResponse> {
    const response = await api.get('/permissions/search', { 
      params: { keyword } 
    });
    return response.data;
  }
};

export default permissionService;