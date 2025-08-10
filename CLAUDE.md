# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + Redux Toolkit 的前端权限管理系统，采用分层架构设计，实现用户认证、用户管理、组织架构、权限控制、角色管理等完整的权限管理功能。

## 技术栈

- **前端框架**: React
- **状态管理**: Redux Toolkit
- **路由管理**: React Router  
- **HTTP客户端**: Axios
- **UI组件库**: Ant Design
- **表单处理**: Formik + Yup
- **类型检查**: TypeScript
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 开发命令

由于项目尚未初始化，预期的开发命令为：

```bash
# 开发环境启动
npm run dev
# 或 
yarn dev

# 构建
npm run build
# 或
yarn build

# 代码检查
npm run lint
# 或
yarn lint

# 测试
npm test
# 或
yarn test
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

所有API基础路径：`/api/v1/`

### 核心接口
- 认证：`POST /auth/login`, `POST /auth/refresh`, `POST /auth/verify`
- 用户：`GET /users`, `POST /user/create`, `PUT /user/:id`, `DELETE /user/:id`
- 组织：`GET /groups`, `POST /group`, `PUT /group/:id`, `DELETE /group/:id`
- 权限：`GET /permissions`, `POST /permission`, `PUT /permission/:id`
- 角色：`GET /roles`, `POST /role`, `PUT /role/:id`
- 菜单：`GET /menus`, `GET /user/:id/menus`

## 开发阶段

项目分为8个开发阶段，按优先级递减：
1. **基础框架搭建和认证功能** (高)
2. **用户管理功能** (高)
3. **组织架构管理功能** (高) 
4. **权限核心功能** (高)
5. **关联管理功能** (中)
6. **权限检查和展示功能** (中)
7. **菜单权限管理功能** (中低)
8. **系统优化和完善** (低)

## 关键组件模式

### 权限控制组件
```tsx
const PermissionGuard = ({ permission, children }) => {
  const { userPermissions } = useSelector(state => state.auth);
  return userPermissions.includes(permission) ? children : null;
};
```

### 路由守卫
支持动态路由配置，基于用户权限生成可访问路由列表

### 表单处理
使用Formik + Yup进行表单状态管理和验证

## 测试策略

- 单元测试：Jest (工具函数、hooks、组件逻辑)
- 端到端测试：Cypress (登录流程、权限控制、核心业务流程)

## 性能优化重点

- 组件懒加载和路由按需加载
- 数据缓存和分页处理
- 虚拟滚动处理大列表
- React.memo和useMemo优化重渲染