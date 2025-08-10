import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Tag,
  Pagination,
  Modal,
  message,
  Tooltip,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchUsersAsync, 
  deleteUserAsync, 
  clearError 
} from '../../store/slices/userSlice';
import { User, ListUsersRequest, PageRequest } from '../../types';
import { formatDateTime } from '../../utils';
import PermissionGuard from '../../components/business/PermissionGuard';

const { Search } = Input;
const { Title } = Typography;
const { confirm } = Modal;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector(state => state.user);

  // 搜索和分页状态
  const [searchParams, setSearchParams] = useState<{
    username: string;
    employeeId: string;
    isEnabled: boolean | undefined;
  }>({
    username: '',
    employeeId: '',
    isEnabled: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取用户列表
  const fetchUsers = () => {
    const params: ListUsersRequest = {
      page: {
        pageNum: currentPage,
        pageSize: pageSize,
        keyword: searchParams.username || searchParams.employeeId || '',
      },
      username: searchParams.username || undefined,
      employeeId: searchParams.employeeId || undefined,
      isEnabled: searchParams.isEnabled,
    };

    dispatch(fetchUsersAsync(params));
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      username: '',
      employeeId: '',
      isEnabled: undefined,
    });
    setCurrentPage(1);
    setTimeout(() => {
      fetchUsers();
    }, 0);
  };

  // 删除用户
  const handleDelete = (user: User) => {
    confirm({
      title: '删除用户',
      content: `确定要删除用户 "${user.name}" 吗？此操作不可恢复。`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch(deleteUserAsync(user.id)).then((result) => {
          if (result.meta.requestStatus === 'fulfilled') {
            message.success('用户删除成功');
            fetchUsers();
          }
        });
      },
    });
  };

  // 页码变化
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 状态切换
  const handleStatusChange = (userId: string, enabled: boolean) => {
    // TODO: 实现状态切换API
    message.info('状态切换功能待实现');
  };

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '员工编号',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (enabled: boolean, record: User) => (
        <PermissionGuard permission="user:update">
          <Switch
            checked={enabled}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            size="small"
          />
        </PermissionGuard>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: number) => formatDateTime(new Date(time * 1000)),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: User) => (
        <Space>
          <PermissionGuard permission="user:view">
            <Tooltip title="查看详情">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/users/${record.id}`)}
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard permission="user:update">
            <Tooltip title="编辑用户">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => navigate(`/users/${record.id}/edit`)}
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard permission="user:update">
            <Tooltip title="重置密码">
              <Button
                type="link"
                icon={<KeyOutlined />}
                onClick={() => navigate(`/users/${record.id}/reset-password`)}
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard permission="user:delete">
            <Tooltip title="删除用户">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>用户管理</Title>
        <PermissionGuard permission="user:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/create')}
          >
            新增用户
          </Button>
        </PermissionGuard>
      </div>

      <Card>
        {/* 搜索区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="用户名"
              value={searchParams.username}
              onChange={(e) => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
              style={{ width: 150 }}
            />
            <Input
              placeholder="员工编号"
              value={searchParams.employeeId}
              onChange={(e) => setSearchParams(prev => ({ ...prev, employeeId: e.target.value }))}
              style={{ width: 150 }}
            />
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchUsers}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* 用户表格 */}
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />

        {/* 分页 */}
        {pagination && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={pagination.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserList;