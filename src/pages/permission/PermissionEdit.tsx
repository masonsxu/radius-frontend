import React from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col, Switch, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updatePermission, fetchPermissionById } from '../../store/slices/permissionSlice';
import { UpdatePermissionRequest } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const PermissionEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { currentPermission, loading } = useAppSelector(state => state.permission);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const initializePage = async () => {
      if (!id) {
        message.error('缺少权限ID');
        navigate('/permissions');
        return;
      }

      try {
        await dispatch(fetchPermissionById(parseInt(id))).unwrap();
      } catch (error: any) {
        message.error(error.message || '获取权限信息失败');
        navigate('/permissions');
      } finally {
        setInitializing(false);
      }
    };

    initializePage();
  }, [dispatch, id, navigate]);

  React.useEffect(() => {
    if (currentPermission && !initializing) {
      form.setFieldsValue({
        name: currentPermission.name,
        code: currentPermission.code,
        type: currentPermission.type,
        resource: currentPermission.resource,
        description: currentPermission.description,
        status: currentPermission.status === 'active',
      });
    }
  }, [currentPermission, form, initializing]);

  const permissionTypes = [
    { value: 'menu', label: '菜单权限', description: '控制菜单显示' },
    { value: 'action', label: '操作权限', description: '控制按钮、功能操作' },
    { value: 'data', label: '数据权限', description: '控制数据访问范围' },
    { value: 'api', label: 'API权限', description: '控制接口调用' },
  ];

  const commonPermissionCodes = [
    { category: '用户管理', permissions: [
      'user:list', 'user:create', 'user:update', 'user:delete', 'user:view'
    ]},
    { category: '组织管理', permissions: [
      'group:list', 'group:create', 'group:update', 'group:delete', 'group:view'
    ]},
    { category: '权限管理', permissions: [
      'permission:list', 'permission:create', 'permission:update', 'permission:delete', 'permission:view'
    ]},
    { category: '角色管理', permissions: [
      'role:list', 'role:create', 'role:update', 'role:delete', 'role:view'
    ]},
  ];

  const handleSubmit = async (values: any) => {
    if (!id || !currentPermission) return;

    try {
      const updateData: UpdatePermissionRequest = {
        name: values.name,
        code: values.code,
        type: values.type,
        resource: values.resource || undefined,
        description: values.description || undefined,
        status: values.status ? 'active' : 'inactive',
      };

      await dispatch(updatePermission({ id: parseInt(id), data: updateData })).unwrap();
      message.success('权限更新成功');
      navigate('/permissions');
    } catch (error: any) {
      message.error(error.message || '更新失败');
    }
  };

  const handleCancel = () => {
    navigate('/permissions');
  };

  const handleCodeSuggestion = (code: string) => {
    form.setFieldValue('code', code);
  };

  const handleTypeChange = (type: string) => {
    // 根据权限类型自动设置一些默认值
    if (type === 'menu' && !form.getFieldValue('resource')) {
      form.setFieldValue('resource', '/');
    } else if (type === 'api' && !form.getFieldValue('resource')) {
      form.setFieldValue('resource', '/api/');
    }
  };

  if (initializing) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentPermission) {
    return (
      <div style={{ padding: '24px' }}>
        <Card title="错误" bordered={false}>
          权限不存在或已被删除
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="编辑权限" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="权限名称"
                name="name"
                rules={[
                  { required: true, message: '请输入权限名称' },
                  { min: 2, max: 50, message: '权限名称长度应在2-50个字符之间' },
                ]}
              >
                <Input placeholder="请输入权限名称，如：用户列表" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="权限代码"
                name="code"
                rules={[
                  { required: true, message: '请输入权限代码' },
                  { pattern: /^[a-zA-Z0-9_:.-]+$/, message: '权限代码只能包含字母、数字、下划线、冒号、点和连字符' },
                ]}
              >
                <Input placeholder="请输入权限代码，如：user:list" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="权限类型"
                name="type"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型" onChange={handleTypeChange}>
                  {permissionTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <div>
                        <div>{type.label}</div>
                        <small style={{ color: '#666' }}>{type.description}</small>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="状态"
                name="status"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="资源路径"
            name="resource"
            tooltip="权限关联的资源路径，如菜单路径、API路径等"
          >
            <Input placeholder="请输入资源路径，如：/users 或 /api/users" />
          </Form.Item>

          <Form.Item
            label="权限描述"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="请输入权限描述（可选）"
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* 常用权限代码建议 */}
          <Card 
            title="常用权限代码建议" 
            size="small" 
            style={{ marginBottom: 16, backgroundColor: '#fafafa' }}
          >
            {commonPermissionCodes.map(category => (
              <div key={category.category} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{category.category}：</div>
                <div>
                  {category.permissions.map(code => (
                    <Button
                      key={code}
                      type="link"
                      size="small"
                      onClick={() => handleCodeSuggestion(code)}
                      style={{ padding: '0 8px', margin: '0 4px 4px 0' }}
                    >
                      {code}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 16 }}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PermissionEdit;