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
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createUserAsync, clearError } from '../../store/slices/userSlice';
import { CreateUserRequest } from '../../types';

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
  initialPassword: Yup.string()
    .required('请输入初始密码')
    .min(8, '密码至少8个字符')
    .max(128, '密码不超过128个字符')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密码必须包含至少一个小写字母、一个大写字母和一个数字'
    ),
  confirmPassword: Yup.string()
    .required('请确认密码')
    .oneOf([Yup.ref('initialPassword')], '两次输入的密码不一致'),
  description: Yup.string().max(500, '描述不超过500个字符'),
  isEnabled: Yup.boolean().required(),
});

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.user);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 初始表单值
  const initialValues = {
    username: '',
    name: '',
    employeeId: '',
    initialPassword: '',
    confirmPassword: '',
    description: '',
    isEnabled: true,
  };

  // 提交表单
  const handleSubmit = async (values: typeof initialValues) => {
    const userData: CreateUserRequest = {
      username: values.username,
      name: values.name,
      employeeId: values.employeeId,
      initialPassword: values.initialPassword,
      description: values.description || undefined,
      isEnabled: values.isEnabled,
    };

    const result = await dispatch(createUserAsync(userData));
    if (result.meta.requestStatus === 'fulfilled') {
      message.success('用户创建成功');
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
        <Title level={3}>新增用户</Title>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="初始密码"
                    validateStatus={errors.initialPassword && touched.initialPassword ? 'error' : ''}
                    help={errors.initialPassword && touched.initialPassword ? errors.initialPassword : ''}
                    required
                  >
                    <Input.Password
                      name="initialPassword"
                      placeholder="请输入初始密码"
                      value={values.initialPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="确认密码"
                    validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                    help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                    required
                  >
                    <Input.Password
                      name="confirmPassword"
                      placeholder="请再次输入密码"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="large"
                    />
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
                    创建用户
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

export default UserCreate;