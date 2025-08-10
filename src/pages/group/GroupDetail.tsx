import React from 'react';
import { Card, Descriptions, Button, Tag, Spin, message, Space, Tree, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, TeamOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchGroupById, deleteGroup, fetchGroupRoles } from '../../store/slices/groupSlice';
import { GroupType, Role } from '../../types';

const GroupDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentGroup, groupRoles, loading } = useAppSelector(state => state.group);
  const { userPermissions } = useAppSelector(state => state.auth);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(parseInt(id)));
      dispatch(fetchGroupRoles(id));
    }
  }, [dispatch, id]);

  const getGroupTypeLabel = (type: GroupType) => {
    const typeMap = {
      [GroupType.HOSPITAL]: { label: '医院', color: 'blue' },
      [GroupType.CAMPUS]: { label: '院区', color: 'green' },
      [GroupType.DEPARTMENT]: { label: '科室', color: 'orange' },
      [GroupType.TEAM]: { label: '小组', color: 'purple' },
    };
    return typeMap[type] || { label: '未知', color: 'default' };
  };

  const handleEdit = () => {
    navigate(`/groups/${id}/edit`);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!id || !currentGroup) return;

    try {
      await dispatch(deleteGroup(parseInt(id))).unwrap();
      message.success('组织删除成功');
      navigate('/groups');
    } catch (error: any) {
      message.error(error.message || '删除失败');
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleBack = () => {
    navigate('/groups');
  };

  const canEdit = userPermissions.includes('group:update');
  const canDelete = userPermissions.includes('group:delete');

  if (loading || !currentGroup) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const typeInfo = getGroupTypeLabel(currentGroup.type);

  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回组织列表
        </Button>
      </div>

      <Card 
        title={
          <Space>
            <span>{currentGroup.name}</span>
            <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
          </Space>
        }
        extra={
          <Space>
            {canEdit && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                编辑
              </Button>
            )}
            {canDelete && (
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                删除
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="组织ID">
            {currentGroup.id}
          </Descriptions.Item>
          <Descriptions.Item label="组织名称">
            {currentGroup.name}
          </Descriptions.Item>
          <Descriptions.Item label="组织类型">
            <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={currentGroup.status === 'active' ? 'green' : 'red'}>
              {currentGroup.status === 'active' ? '启用' : '禁用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(currentGroup.createdAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(currentGroup.updatedAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
          {currentGroup.description && (
            <Descriptions.Item label="组织描述" span={2}>
              {currentGroup.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 关联角色 */}
      <Card 
        title={
          <Space>
            <KeyOutlined />
            关联角色
          </Space>
        }
        style={{ marginTop: '16px' }}
      >
        <Table
          columns={roleColumns}
          dataSource={groupRoles}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个角色`,
          }}
          locale={{ emptyText: '暂无关联角色' }}
        />
      </Card>

      {/* 删除确认对话框 */}
      <Modal
        title="删除组织"
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okType="danger"
        okText="删除"
        cancelText="取消"
        confirmLoading={loading}
      >
        <p>确定要删除组织 <strong>{currentGroup.name}</strong> 吗？</p>
        <p style={{ color: '#ff4d4f' }}>
          注意：删除后将无法恢复，且会影响该组织下的所有用户和子组织。
        </p>
      </Modal>
    </div>
  );
};

export default GroupDetail;