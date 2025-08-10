# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + Redux Toolkit 的前端权限管理系统，采用分层架构设计，实现用户认证、用户管理、组织架构、权限控制、角色管理等完整的权限管理功能。

## 技术栈

- **前端框架**: React 19.1.1
- **状态管理**: Redux Toolkit 2.8.2
- **路由管理**: React Router 7.8.0
- **HTTP客户端**: Axios 1.11.0
- **UI组件库**: Ant Design 5.26.7
- **表单处理**: Formik 2.4.6 + Yup 1.7.0
- **类型检查**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.0
- **代码规范**: ESLint 9.32.0 + Prettier 3.6.2

## 开发命令

```bash
# 开发环境启动（支持0.0.0.0监听）
npm run dev
# 或 
yarn dev

# 构建（包含TypeScript类型检查）
npm run build
# 或
yarn build

# 代码检查
npm run lint
# 或
yarn lint

# 预览构建结果
npm run preview
# 或
yarn preview
```

## 项目目录结构

```
src/
├── assets/           # 静态资源（图片、样式）
├── components/       # 通用组件
│   ├── common/       # 基础组件（按钮、输入框等）
│   ├── layout/       # 布局组件
│   └── business/     # 业务组件（权限选择器等）
├── pages/            # 页面组件
│   ├── auth/         # 认证相关页面
│   ├── user/         # 用户管理页面
│   ├── group/        # 组织管理页面
│   ├── permission/   # 权限管理页面
│   └── role/         # 角色管理页面
├── store/            # 状态管理
│   ├── slices/       # Redux切片
│   └── index.ts      # store配置
├── services/         # API服务
│   ├── api.ts        # Axios配置
│   ├── auth.ts       # 认证相关接口
│   └── ...           # 其他业务接口
├── router/           # 路由配置
├── utils/            # 工具函数
├── hooks/            # 自定义钩子
├── types/            # TypeScript类型定义
└── App.tsx           # 应用入口组件
```

## 核心架构设计

### RBAC权限模型
- 权限：最小权限单元（如`user:list`、`user:create`）
- 角色：一组权限的集合（如"管理员"包含所有权限）
- 用户：关联多个角色，继承角色的所有权限
- 组织：四级结构（医院/院区/科室/小组）

### 认证机制
- accessToken存储在内存+sessionStorage
- refreshToken存储在HttpOnly Cookie
- 401错误时自动刷新令牌
- 权限控制通过路由守卫和权限组件实现

### HTTP拦截器设计
- 请求拦截器：自动添加令牌
- 响应拦截器：处理401错误，实现令牌自动刷新
- 错误处理和重试机制

## API接口规范

所有API基础路径：`http://localhost:8080/api/v1`

### 核心接口
- 认证：`POST /auth/login`, `POST /auth/refresh`, `POST /auth/verify`
- 用户：`GET /users`, `POST /user/create`, `PUT /user/:id`, `DELETE /user/:id`
- 组织：`GET /groups`, `POST /group`, `PUT /group/:id`, `DELETE /group/:id`
- 权限：`GET /permissions`, `POST /permission`, `PUT /permission/:id`
- 角色：`GET /roles`, `POST /role`, `PUT /role/:id`
- 菜单：`GET /menus`, `GET /user/:id/menus`

### 认证机制实现
- **accessToken**: 存储在sessionStorage，用于API请求认证
- **refreshToken**: 存储在HttpOnly Cookie，用于令牌刷新
- **自动刷新**: 401错误时自动调用刷新接口
- **拦截器**: 请求自动添加Authorization头，响应处理令牌刷新

## 开发阶段和当前状态

项目分为8个开发阶段，按优先级递减：

### 当前进度
1. **基础框架搭建和认证功能** ✅ **已完成**
   - 项目架构搭建完成
   - Redux Store配置完整
   - 路由系统配置完成
   - API服务架构实现
   - 类型系统完整定义

2. **用户管理功能** ⚠️ **部分完成**
   - 页面组件结构已创建
   - 路由配置完成
   - 业务逻辑待实现

3. **组织架构管理功能** ⚠️ **部分完成**
   - 页面组件结构已创建
   - 路由配置完成
   - 业务逻辑待实现

4. **权限核心功能** ⚠️ **部分完成**
   - 页面组件结构已创建
   - 路由配置完成
   - 业务逻辑待实现

5. **关联管理功能** ❌ **待开始** (中)
6. **权限检查和展示功能** ❌ **待开始** (中)
7. **菜单权限管理功能** ❌ **待开始** (中低)
8. **系统优化和完善** ❌ **待开始** (低)

## 关键组件模式

### 权限控制组件
```tsx
const PermissionGuard = ({ permission, children }) => {
  const { userPermissions } = useSelector(state => state.auth);
  return userPermissions.includes(permission) ? children : null;
};
```

### 路由守卫
- **PrivateRoute**: 保护需要认证的页面
- **权限检查**: 基于路由配置中的permission字段
- **动态路由**: 支持基于用户权限的路由过滤
- **懒加载**: 所有页面组件采用React.lazy实现

### 表单处理
使用Formik + Yup进行表单状态管理和验证，集成Ant Design表单组件

### 状态管理架构
- **模块化切片**: auth、user、group、permission、role
- **类型化Redux**: 完整的TypeScript类型支持
- **异步操作**: 使用createAsyncThunk处理API调用
- **中间件**: 配置序列化检查忽略persist动作

## 测试策略

- 单元测试：Jest (工具函数、hooks、组件逻辑)
- 端到端测试：Cypress (登录流程、权限控制、核心业务流程)

## 性能优化重点

- 组件懒加载和路由按需加载
- 数据缓存和分页处理
- 虚拟滚动处理大列表
- React.memo和useMemo优化重渲染

## 开发注意事项

### Store配置
- authReducer采用动态导入以避免循环依赖
- 所有reducer都配置了完整的类型安全
- 使用类型化的hooks：useAppDispatch和useAppSelector

### 路由配置
- 路由支持嵌套结构和权限控制
- 所有页面组件都配置了懒加载
- 路由配置文件包含完整的类型定义

### API服务
- 统一的错误处理和令牌刷新机制
- 模块化的API服务组织
- 支持请求和响应拦截器

### 开发环境
- Vite开发服务器支持0.0.0.0监听
- 构建时包含TypeScript类型检查
- ESLint配置支持React和TypeScript