import React from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { createPermission } from '../../store/slices/permissionSlice';
import { CreatePermissionRequest } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const PermissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { loading } = useAppSelector(state => state.permission);

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
    try {
      const createData: CreatePermissionRequest = {
        name: values.name,
        code: values.code,
        type: values.type,
        resource: values.resource || undefined,
        description: values.description || undefined,
        status: values.status ? 'active' : 'inactive',
      };

      await dispatch(createPermission(createData)).unwrap();
      message.success('权限创建成功');
      navigate('/permissions');
    } catch (error: any) {
      message.error(error.message || '创建失败');
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
    if (type === 'menu') {
      form.setFieldValue('resource', '/');
    } else if (type === 'api') {
      form.setFieldValue('resource', '/api/');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="创建权限" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: true }}
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
              创建
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

export default PermissionCreate;