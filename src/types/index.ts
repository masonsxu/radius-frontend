// 登录相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginUserInfo {
  userId: string;
  username: string;
  name: string;
  loginTime: number;
  roles?: Role[];  // 添加角色信息，可选属性
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
  refreshToken: string;
}

export interface TokenVerifyRequest {
  accessToken: string;
}

export interface TokenVerifyResponse {
  base: BaseResponse;
  userInfo: LoginUserInfo;
}

// 基础响应类型
export interface BaseResponse {
  code: number;
  message: string;
}

// 分页相关类型
export interface PageRequest {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
}

export interface PageResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 权限相关类型
export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  createTime: number;
  updateTime: number;
}

export interface ListPermissionsRequest extends PageRequest {
  // 可以添加特定于权限列表的参数
}

export interface CreatePermissionRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  id: string;
  name?: string;
  code?: string;
  description?: string;
}

export interface PermissionResponse {
  base: BaseResponse;
  permission?: Permission;
}

export interface BatchPermissionResponse {
  base: BaseResponse;
  permissions: Permission[];
  page?: PageResponse;
}

// 角色相关类型
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface ListRolesRequest extends PageRequest {
  // 可以添加特定于角色列表的参数
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  isEnabled?: boolean;
}

export interface UpdateRoleRequest {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  isEnabled?: boolean;
}

export interface RoleResponse {
  base: BaseResponse;
  role?: Role;
}

export interface BatchRoleResponse {
  base: BaseResponse;
  roles: Role[];
  page?: PageResponse;
}

export interface AssignPermissionsToRoleRequest {
  roleId: string;
  permissionIds: string[];
}

export interface RemovePermissionsFromRoleRequest {
  roleId: string;
  permissionIds: string[];
}

// 组织相关类型
export type GroupType = 1 | 2 | 3 | 4;

export const GroupType = {
  HOSPITAL: 1 as GroupType,
  CAMPUS: 2 as GroupType,
  DEPARTMENT: 3 as GroupType,
  TEAM: 4 as GroupType
};

export interface Group {
  id: string;
  code: string;
  name: string;
  type: GroupType;
  parentId?: string;
  description?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface ListGroupsRequest extends PageRequest {
  code?: string;
  type?: GroupType;
  parentId?: string;
  isEnabled?: boolean;
}

export interface CreateGroupRequest {
  code?: string;
  name: string;
  type: GroupType;
  parentId?: string;
  description?: string;
  isEnabled?: boolean;
}

export interface UpdateGroupRequest {
  id: string;
  code?: string;
  name?: string;
  type?: GroupType;
  parentId?: string;
  description?: string;
  isEnabled?: boolean;
}

export interface GroupResponse {
  base: BaseResponse;
  group?: Group;
}

export interface BatchGroupResponse {
  base: BaseResponse;
  groups: Group[];
  page?: PageResponse;
}

export interface AssignRolesToGroupRequest {
  groupId: string;
  roleIds: string[];
}

export interface RemoveRolesFromGroupRequest {
  groupId: string;
  roleIds: string[];
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  employeeId: string;
  name?: string;
  description?: string;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
}

export interface ListUsersRequest extends PageRequest {
  username?: string;
  employeeId?: string;
  isEnabled?: boolean;
}

export interface CreateUserRequest {
  username: string;
  employeeId: string;
  name?: string;
  description?: string;
  isEnabled?: boolean;
  initialPassword: string;
}

export interface UpdateUserRequest {
  id: string;
  username?: string;
  employeeId?: string;
  name?: string;
  description?: string;
  isEnabled?: boolean;
}

export interface UserResponse {
  base: BaseResponse;
  user?: User;
}

export interface BatchUserResponse {
  base: BaseResponse;
  users: User[];
  page?: PageResponse;
}

export interface DeleteUserRequest {
  id: string;
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

export interface GetUserGroupsRequest {
  userId: string;
}

// 权限检查相关类型
export interface CheckPermissionRequest {
  userId: string;
  permissionCode: string;
  groupId?: string;
}

export interface CheckPermissionResponse {
  base: BaseResponse;
  hasPermission: boolean;
}

export interface GetUserAllPermissionsRequest {
  userId: string;
  groupId?: string;
}

// 菜单相关类型
export type MenuType = 1 | 2 | 3;

export const MenuType = {
  DIRECTORY: 1 as MenuType,
  MENU: 2 as MenuType,
  BUTTON: 3 as MenuType
};

export interface Menu {
  id: string;
  name: string;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  type: MenuType;
  order?: number;
  isEnabled: boolean;
  createTime: number;
  updateTime: number;
  permissions?: Permission[];
}

export interface CreateMenuRequest {
  name: string;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  type: MenuType;
  order?: number;
  isEnabled?: boolean;
}

export interface UpdateMenuRequest {
  id: string;
  name?: string;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: MenuType;
  order?: number;
  isEnabled?: boolean;
}

export interface MenuResponse {
  base: BaseResponse;
  menu?: Menu;
}

export interface BatchMenuResponse {
  base: BaseResponse;
  menus: Menu[];
  page?: PageResponse;
}

export interface GetMenuRequest {
  id: string;
}

export interface DeleteMenuRequest {
  id: string;
}

export interface ListMenusRequest extends PageRequest {
  name?: string;
  isEnabled?: boolean;
}

export interface AssignPermissionsToMenuRequest {
  menuId: string;
  permissionIds: string[];
}

export interface GetMenuPermissionsRequest {
  menuId: string;
}

export interface RemovePermissionsFromMenuRequest {
  menuId: string;
  permissionIds: string[];
}

export interface GetUserMenusRequest {
  userId: string;
}

export interface GetUserMenusResponse {
  base: BaseResponse;
  menus: Menu[];
}

// 状态管理相关类型
export interface AuthState {
  isAuthenticated: boolean;
  user: LoginUserInfo | null;
  token: string | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
}

export interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  groupRoles: Role[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
  rolesPagination: PageResponse | null;
}

export interface PermissionState {
  permissions: Permission[];
  currentPermission: Permission | null;
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
}

export interface RoleState {
  roles: Role[];
  currentRole: Role | null;
  rolePermissions: Permission[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
  permissionsPagination: PageResponse | null;
}

export interface MenuState {
  menus: Menu[];
  currentMenu: Menu | null;
  userMenus: Menu[];
  loading: boolean;
  error: string | null;
  pagination: PageResponse | null;
}