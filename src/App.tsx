import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard'; // 假设这是仪表板页面组件

const { Header, Sider, Content } = Layout;

const items: MenuProps['items'] = [
  {
    key: 'dashboard',
    label: '仪表板',
    icon: <DashboardOutlined />,
  },
  {
    key: 'users',
    label: '用户管理',
    icon: <UserOutlined />,
  },
  {
    key: 'groups',
    label: '组管理',
    icon: <TeamOutlined />,
  },
  {
    key: 'permissions',
    label: '权限管理',
    icon: <SafetyCertificateOutlined />,
  },
];

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ height: '100vh' }}>
        {/* 修改 Sider 的宽度为自适应 */}
        <Sider style={{ background: '#001529', flex: '0 0 auto', width: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff' }}>
            {/* 可以在这里添加顶部导航或其他元素 */}
          </Header>
          {/* 修改 Content 样式，确保其占据剩余空间 */}
          <Content style={{ margin: '24px', background: '#fff', padding: 24, flex: 1, overflowY: 'auto', width: '100%' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* 其他路由配置 */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;