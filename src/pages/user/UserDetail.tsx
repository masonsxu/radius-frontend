import React, { useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Descriptions,
  Button,
  Space,
  Spin,
  Tag,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  KeyOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchUserByIdAsync,
  clearCurrentUser,
  clearError 
} from '../../store/slices/userSlice';
import { formatDateTime } from '../../utils';
import PermissionGuard from '../../components/business/PermissionGuard';

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector(state => state.user);

  // 组件卸载时清理当前用户
  useEffect(() => {
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch]);

  // 获取用户详情
  useEffect(() => {
    if (id) {
      dispatch(fetchUserByIdAsync(id));
    }
  }, [id, dispatch]);

  // 错误处理
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 如果没有找到用户或用户ID无效
  if (!id) {
    return (
      <div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Typography.Title level={4}>无效的用户ID</Typography.Title>
        </div>
      </div>
    );
  }

  // 加载中状态
  if (loading && !currentUser) {
    return (
      <div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // 用户不存在
  if (!loading && !currentUser) {
    return (
      <div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Typography.Title level={4}>用户不存在</Typography.Title>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>

        <Space>
          <PermissionGuard permission="user:update">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              编辑用户
            </Button>
          </PermissionGuard>
          
          <PermissionGuard permission="user:update">
            <Button
              icon={<KeyOutlined />}
              onClick={() => navigate(`/users/${id}/reset-password`)}
            >
              重置密码
            </Button>
          </PermissionGuard>
        </Space>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <UserOutlined style={{ fontSize: 24, marginRight: 12 }} />
          <Title level={3} style={{ margin: 0 }}>
            用户详情
          </Title>
        </div>

        {currentUser && (
          <>
            <Descriptions
              title="基本信息"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="用户名">
                <Text code>{currentUser.username}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="姓名">
                {currentUser.name}
              </Descriptions.Item>
              
              <Descriptions.Item label="员工编号">
                <Text code>{currentUser.employeeId}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="用户状态">
                <Tag color={currentUser.isEnabled ? 'green' : 'red'}>
                  {currentUser.isEnabled ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {formatDateTime(new Date(currentUser.createTime * 1000))}
              </Descriptions.Item>
              
              <Descriptions.Item label="更新时间">
                {formatDateTime(new Date(currentUser.updateTime * 1000))}
              </Descriptions.Item>
            </Descriptions>

            {currentUser.description && (
              <>
                <Divider />
                <div>
                  <Title level={5}>描述信息</Title>
                  <Text>{currentUser.description}</Text>
                </div>
              </>
            )}

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <TeamOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                  <div>
                    <Text strong>所属组织</Text>
                    <br />
                    <Text type="secondary">点击查看用户所属的组织结构</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      type="link" 
                      onClick={() => {
                        // TODO: 实现查看用户组织功能
                        console.log('查看用户组织');
                      }}
                    >
                      查看组织
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                  <div>
                    <Text strong>用户权限</Text>
                    <br />
                    <Text type="secondary">查看用户拥有的所有权限</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      type="link"
                      onClick={() => {
                        // TODO: 实现查看用户权限功能
                        console.log('查看用户权限');
                      }}
                    >
                      查看权限
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <KeyOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 8 }} />
                  <div>
                    <Text strong>密码管理</Text>
                    <br />
                    <Text type="secondary">重置用户登录密码</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <PermissionGuard permission="user:update">
                      <Button 
                        type="link"
                        onClick={() => navigate(`/users/${id}/reset-password`)}
                      >
                        重置密码
                      </Button>
                    </PermissionGuard>
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserDetail;