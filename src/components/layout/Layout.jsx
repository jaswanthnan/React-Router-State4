import { Outlet, NavLink } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { DashboardOutlined, TeamOutlined, ProfileOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const { Header, Content, Sider } = AntLayout;

const AppLayout = () => {
  const { state } = useContext(AppContext);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <NavLink to="/dashboard">Dashboard</NavLink>,
    },
    {
      key: 'candidates',
      icon: <TeamOutlined />,
      label: <NavLink to="/candidates">Candidates</NavLink>,
    },
    {
      key: 'jobs',
      icon: <ProfileOutlined />,
      label: <NavLink to="/jobs">Jobs</NavLink>,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark" className="border-r border-gray-800">
        <div className="h-16 flex items-center justify-center m-4 bg-gray-800 rounded-lg">
          <h1 className="text-white text-xl font-bold truncate px-4">HR Portal</h1>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
      </Sider>
      <AntLayout>
        <Header className="bg-white px-6 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-semibold m-0 text-slate-800">Welcome, {state.user.name}</h2>
          <div className="flex gap-4 items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">{state.user.role}</span>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AppLayout;
