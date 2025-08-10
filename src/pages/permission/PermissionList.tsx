import React from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Tag, 
  Dropdown, 
  Modal, 
  message,
  Row,
  Col,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchPermissions, 
  deletePermission, 
  batchDeletePermissions,
  searchPermissions
} from '../../store/slices/permissionSlice';
import { Permission, ListPermissionsRequest } from '../../types';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';

const { Search } = Input;
const { Option } = Select;

const PermissionList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { permissions, loading, pagination } = useAppSelector(state => state.permission);
  const { userPermissions } = useAppSelector(state => state.auth);

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = React.useState<ListPermissionsRequest>({
    page: 1,
    limit: 10,
  });
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: 'single' | 'batch'; id?: number }>({ type: 'single' });

  React.useEffect(() => {
    dispatch(fetchPermissions(searchParams));
  }, [dispatch, searchParams]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      dispatch(searchPermissions(value.trim()));
    } else {
      setSearchParams(prev => ({ ...prev, keyword: undefined, page: 1 }));
    }
  };

  const handleTableChange = (pagination: any) => {
    setSearchParams(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleCreate = () => {
    navigate('/permissions/create');
  };

  const handleEdit = (record: Permission) => {
    navigate(`/permissions/${record.id}/edit`);
  };

  const handleView = (record: Permission) => {
    navigate(`/permissions/${record.id}`);
  };

  const handleDelete = (record: Permission) => {
    setDeleteTarget({ type: 'single', id: record.id });
    setDeleteModalVisible(true);
  };

  const handleBatchDelete = () => {
    setDeleteTarget({ type: 'batch' });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteTarget.type === 'single' && deleteTarget.id) {
        await dispatch(deletePermission(deleteTarget.id)).unwrap();
        message.success('权限删除成功');
      } else if (deleteTarget.type === 'batch') {
        await dispatch(batchDeletePermissions(selectedRowKeys as number[])).unwrap();
        message.success('批量删除成功');
        setSelectedRowKeys([]);
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchPermissions(searchParams));
  };

  const handleExport = () => {
    message.info('导出功能开发中');
  };

  // 权限检查
  const canCreate = userPermissions.includes('permission:create');
  const canUpdate = userPermissions.includes('permission:update');
  const canDelete = userPermissions.includes('permission:delete');
  const canView = userPermissions.includes('permission:view');

  const getActionMenuItems = (record: Permission): MenuProps['items'] => {
    const items: MenuProps['items'] = [];
    
    if (canView) {
      items.push({
        key: 'view',
        label: '查看详情',
        onClick: () => handleView(record),
      });
    }
    
    if (canUpdate) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑',
        onClick: () => handleEdit(record),
      });
    }
    
    if (canDelete) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => handleDelete(record),
      });
    }

    return items;
  };

  const columns: ColumnsType<Permission> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
      render: (code: string) => (
        <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>
          {code}
        </code>
      ),
    },
    {
      title: '权限类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; label: string }> = {
          menu: { color: 'blue', label: '菜单' },
          action: { color: 'green', label: '操作' },
          data: { color: 'orange', label: '数据' },
          api: { color: 'purple', label: 'API' },
        };
        const typeInfo = typeMap[type] || { color: 'default', label: type };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: '资源路径',
      dataIndex: 'resource',
      key: 'resource',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const menuItems = getActionMenuItems(record);
        
        if (menuItems.length === 0) {
          return <span style={{ color: '#ccc' }}>无权限</span>;
        }

        if (menuItems.length === 1) {
          const item = menuItems[0];
          return (
            <Button
              type="link"
              size="small"
              icon={item?.icon}
              onClick={item?.onClick}
            >
              {item?.label}
            </Button>
          );
        }

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="link" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const rowSelection: TableRowSelection<Permission> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: !canDelete,
    }),
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <div style={{ marginBottom: '16px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                {canCreate && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    新建权限
                  </Button>
                )}
                {canDelete && selectedRowKeys.length > 0 && (
                  <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                )}
                <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                  刷新
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="搜索权限名称、代码"
                  allowClear
                  style={{ width: 300 }}
                  onSearch={handleSearch}
                />
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          rowSelection={canDelete ? rowSelection : undefined}
          loading={loading}
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.limit,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 删除确认对话框 */}
      <Modal
        title={deleteTarget.type === 'single' ? '删除权限' : '批量删除权限'}
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okType="danger"
        okText="删除"
        cancelText="取消"
        confirmLoading={loading}
      >
        <p>
          {deleteTarget.type === 'single' 
            ? '确定要删除这个权限吗？' 
            : `确定要删除选中的 ${selectedRowKeys.length} 个权限吗？`
          }
        </p>
        <p style={{ color: '#ff4d4f' }}>
          注意：删除后将无法恢复，且会影响使用该权限的所有用户和角色。
        </p>
      </Modal>
    </div>
  );
};

export default PermissionList;