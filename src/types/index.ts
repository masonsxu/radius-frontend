// API响应通用类型
export enum ErrorCode {
  SUCCESS = 0,
  INVALID_PARAM = 1,
  RESOURCE_NOT_FOUND = 2,
  RESOURCE_EXIST = 3,
  PERMISSION_DENIED = 4,
  SYSTEM_ERROR = 5,
  DB_ERROR = 6,
  AUTH_FAILED = 7,
  INVALID_TOKEN = 8,
  TOKEN_EXPIRED = 9,
  ACCOUNT_LOCKED = 10,
  ACCOUNT_DISABLED = 11,
}

export interface BaseResponse {
  code: ErrorCode;
  message: string;
}

export interface PageRequest {
  keyword?: string;
  pageNum: number;
  pageSize: number;
}

export interface PageResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 组织相关类型
export enum GroupType {
  HOSPITAL = 1,
  CAMPUS = 2,
  DEPARTMENT = 3,
  TEAM = 4,
}

export interface Group {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: GroupType;
  parentId?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface GroupResponse {
  base: BaseResponse;
  group: Group;
}

export interface BatchGroupResponse {
  base: BaseResponse;
  groups: Group[];
  page: PageResponse;
}

export interface ListGroupsRequest {
  code?: string;
  isEnabled?: boolean;
  parentId?: string;
  type?: GroupType;
  page: PageRequest;
}

export interface CreateGroupRequest {
  code: string;
  name: string;
  description?: string;
  type: GroupType;
  parentId?: string;
  isEnabled: boolean;
}

export interface UpdateGroupRequest {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: GroupType;
  parentId?: string;
  isEnabled: boolean;
}

export interface AssignRolesToGroupRequest {
  groupId: string;
  roleIds: string[];
}

export interface RemoveRolesFromGroupRequest {
  groupId: string;
  roleIds: string[];
}

// 权限相关类型
export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  createTime: number;
  updateTime: number;
}

export interface PermissionResponse {
  base: BaseResponse;
  permission: Permission;
}

export interface BatchPermissionResponse {
  base: BaseResponse;
  permissions: Permission[];
  page: PageResponse;
}

export interface ListPermissionsRequest {
  code?: string;
  page: PageRequest;
}

export interface CreatePermissionRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  id: string;
  code: string;
  name: string;
  description?: string;
}

// 角色相关类型
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface RoleResponse {
  base: BaseResponse;
  role: Role;
}

export interface BatchRoleResponse {
  base: BaseResponse;
  roles: Role[];
  page: PageResponse;
}

export interface ListRolesRequest {
  code?: string;
  isEnabled?: boolean;
  page: PageRequest;
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  isEnabled: boolean;
}

export interface UpdateRoleRequest {
  id: string;
  code: string;
  name: string;
  description?: string;
  isEnabled: boolean;
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  name: string;
  employeeId: string;
  description?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface UserResponse {
  base: BaseResponse;
  user: User;
}

export interface BatchUserResponse {
  base: BaseResponse;
  users: User[];
  page: PageResponse;
}

export interface ListUsersRequest {
  username?: string;
  employeeId?: string;
  isEnabled?: boolean;
  page: PageRequest;
}

export interface CreateUserRequest {
  username: string;
  name: string;
  employeeId: string;
  description?: string;
  initialPassword: string;
  isEnabled: boolean;
}

export interface UpdateUserRequest {
  id: string;
  username: string;
  name: string;
  employeeId: string;
  description?: string;
  isEnabled: boolean;
}

export interface UpdatePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
}

export interface AddUserToGroupsRequest {
  userId: string;
  groupIds: string[];
}

export interface RemoveUserFromGroupsRequest {
  userId: string;
  groupIds: string[];
}

export interface GetUserAllPermissionsRequest {
  userId: string;
  groupId?: string;
}

// 认证相关类型
export interface LoginUserInfo {
  userId: string;
  username: string;
  name: string;
  employeeId: string;
  loginTime: number;
  groups: Group[];
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
  clientId?: string;
  deviceInfo?: string;
}

export interface LoginResponse {
  base: BaseResponse;
  accessToken: string;
  refreshToken: string;
  expireTime: number;
  userInfo: LoginUserInfo;
}

export interface LogoutRequest {
  accessToken: string;
  userId: string;
}

export interface RefreshTokenRequest {
  clientId?: string;
  refreshToken: string;
}

export interface TokenVerifyRequest {
  accessToken: string;
}

export interface TokenVerifyResponse {
  base: BaseResponse;
  userInfo: LoginUserInfo;
}

export interface CheckPermissionRequest {
  userId: string;
  groupId?: string;
  permissionCode: string;
}

export interface CheckPermissionResponse {
  base: BaseResponse;
  hasPermission: boolean;
}

// 菜单相关类型
export enum MenuType {
  DIRECTORY = 1,
  MENU = 2,
  BUTTON = 3,
}

export interface Menu {
  id: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: MenuType;
  parentId?: string;
  order: number;
  isEnabled: boolean;
  permissions?: Permission[];
  createTime: number;
  updateTime: number;
}

export interface MenuResponse {
  base: BaseResponse;
  menu: Menu;
}

export interface BatchMenuResponse {
  base: BaseResponse;
  menus: Menu[];
  page: PageResponse;
}

export interface GetUserMenusResponse {
  base: BaseResponse;
  menus: Menu[];
}

export interface ListMenusRequest {
  name?: string;
  isEnabled?: boolean;
  page: PageRequest;
}

export interface CreateMenuRequest {
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: MenuType;
  parentId?: string;
  order: number;
  isEnabled: boolean;
}

export interface UpdateMenuRequest {
  id: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: MenuType;
  parentId?: string;
  order: number;
  isEnabled: boolean;
}

// Redux状态类型
export interface AuthState {
  isAuthenticated: boolean;
  user: LoginUserInfo | null;
  token: string | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}