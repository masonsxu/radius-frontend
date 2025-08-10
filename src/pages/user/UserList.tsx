import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Pagination,
  Modal,
  message,
  Tooltip,
  Switch,
  Select,
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
  updateUserStatusAsync, 
  clearError 
} from '../../store/slices/userSlice';
import { User, ListUsersRequest } from '../../types';
import { formatDateTime } from '../../utils';
import PermissionGuard from '../../components/business/PermissionGuard';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector(state => state.user);

  const [searchParams, setSearchParams] = useState<{
    username: string;
    employeeId: string;
    isEnabled?: boolean;
  }>({ username: '', employeeId: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = useCallback(() => {
    const params: ListUsersRequest = {
      pageNum: currentPage,
      pageSize: pageSize,
      username: searchParams.username || undefined,
      employeeId: searchParams.employeeId || undefined,
      isEnabled: searchParams.isEnabled,
    };
    dispatch(fetchUsersAsync(params));
  }, [dispatch, currentPage, pageSize, searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleReset = () => {
    setSearchParams({ username: '', employeeId: '' });
    setCurrentPage(1);
  };

  const handleDelete = (user: User) => {
    confirm({
      title: '删除用户',
      content: `确定要删除用户 "${user.name || user.username}" 吗？此操作不可恢复。`,
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

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleStatusChange = (userId: string, isEnabled: boolean) => {
    dispatch(updateUserStatusAsync({ userId, isEnabled })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        message.success('用户状态更新成功');
        fetchUsers();
      }
    });
  };

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
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={searchParams.isEnabled}
              onChange={(value) => setSearchParams(prev => ({ ...prev, isEnabled: value }))}
            >
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
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

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />

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