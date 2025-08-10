import React from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginAsync, clearError } from '../../store/slices/authSlice';
import type { LoginRequest } from '../../types';

const { Title, Text } = Typography;

const validationSchema = Yup.object({
  username: Yup.string()
    .required('请输入用户名')
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不超过20个字符'),
  password: Yup.string()
    .required('请输入密码')
    .min(6, '密码至少6个字符')
    .max(50, '密码不超过50个字符'),
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector(state => state.auth);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values: LoginRequest) => {
    try {
      await dispatch(loginAsync(values)).unwrap();
      navigate(from, { replace: true });
    } catch (error) {
      // 错误由 Redux 状态处理
    }
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: '80%', // Adjusted to fit different screen sizes
          maxWidth: 400, // Maximum width for larger screens
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>权限管理系统</Title>
          <Text type="secondary">请登录您的账户</Text>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(clearError())}
            style={{ marginBottom: 16 }}
          />
        )}

        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formikProps;
            return (
              <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="用户名"
                  validateStatus={errors.username && touched.username ? 'error' : ''}
                  help={errors.username && touched.username ? errors.username : ''}
                >
                  <Input
                    name="username"
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>

                <Form.Item
                  label="密码"
                  validateStatus={errors.password && touched.password ? 'error' : ''}
                  help={errors.password && touched.password ? errors.password : ''}
                >
                  <Input.Password
                    name="password"
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    block
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form.Item>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};

export default LoginPage;