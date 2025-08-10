import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Switch,
  Space,
  message,
  Row,
  Col,
  Spin,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchUserByIdAsync,
  updateUserAsync, 
  clearError,
  clearCurrentUser 
} from '../../store/slices/userSlice';
import { UpdateUserRequest } from '../../types';

const { Title } = Typography;

// 表单验证规则
const validationSchema = Yup.object({
  username: Yup.string()
    .required('请输入用户名')
    .min(3, '用户名至少3个字符')
    .max(50, '用户名不超过50个字符')
    .matches(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  name: Yup.string()
    .required('请输入姓名')
    .min(2, '姓名至少2个字符')
    .max(50, '姓名不超过50个字符'),
  employeeId: Yup.string()
    .required('请输入员工编号')
    .min(1, '员工编号至少1个字符')
    .max(50, '员工编号不超过50个字符'),
  description: Yup.string().max(500, '描述不超过500个字符'),
  isEnabled: Yup.boolean().required(),
});

const UserEdit: React.FC = () => {
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
      message.error(error);
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

  // 初始表单值
  const initialValues = {
    username: currentUser?.username || '',
    name: currentUser?.name || '',
    employeeId: currentUser?.employeeId || '',
    description: currentUser?.description || '',
    isEnabled: currentUser?.isEnabled ?? true,
  };

  // 提交表单
  const handleSubmit = async (values: typeof initialValues) => {
    if (!id) return;

    const userData: UpdateUserRequest = {
      id,
      username: values.username,
      name: values.name,
      employeeId: values.employeeId,
      description: values.description || undefined,
      isEnabled: values.isEnabled,
    };

    const result = await dispatch(updateUserAsync(userData));
    if (result.meta.requestStatus === 'fulfilled') {
      message.success('用户更新成功');
      navigate('/users');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>
      </div>

      <Card>
        <Title level={3}>编辑用户</Title>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ 
            values, 
            errors, 
            touched, 
            handleChange, 
            handleBlur, 
            handleSubmit,
            setFieldValue,
            isValid,
          }: FormikProps<typeof initialValues>) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="用户名"
                    validateStatus={errors.username && touched.username ? 'error' : ''}
                    help={errors.username && touched.username ? errors.username : ''}
                    required
                  >
                    <Input
                      name="username"
                      placeholder="请输入用户名"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="姓名"
                    validateStatus={errors.name && touched.name ? 'error' : ''}
                    help={errors.name && touched.name ? errors.name : ''}
                    required
                  >
                    <Input
                      name="name"
                      placeholder="请输入姓名"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="员工编号"
                    validateStatus={errors.employeeId && touched.employeeId ? 'error' : ''}
                    help={errors.employeeId && touched.employeeId ? errors.employeeId : ''}
                    required
                  >
                    <Input
                      name="employeeId"
                      placeholder="请输入员工编号"
                      value={values.employeeId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="用户状态"
                  >
                    <Switch
                      checked={values.isEnabled}
                      onChange={(checked) => setFieldValue('isEnabled', checked)}
                      checkedChildren="启用"
                      unCheckedChildren="禁用"
                    />
                    <span style={{ marginLeft: 8 }}>
                      {values.isEnabled ? '启用' : '禁用'}
                    </span>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="描述"
                validateStatus={errors.description && touched.description ? 'error' : ''}
                help={errors.description && touched.description ? errors.description : ''}
              >
                <Input.TextArea
                  name="description"
                  placeholder="请输入用户描述（可选）"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    disabled={!isValid}
                    size="large"
                  >
                    保存更改
                  </Button>
                  <Button size="large" onClick={() => navigate('/users')}>
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default UserEdit;