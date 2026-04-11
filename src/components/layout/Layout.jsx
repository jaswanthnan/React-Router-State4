import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { DashboardOutlined, TeamOutlined, ProfileOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const { Header, Content, Sider } = AntLayout;

const AppLayout = () => {
  const { state } = useContext(AppContext);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('candidates')) return 'Candidates Management';
    if (location.pathname.includes('jobs')) return 'Active Job Postings';
    return 'Dashboard Analytics';
  };

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
        <div className="pt-4"></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
      </Sider>
      <AntLayout>
        <Header className="bg-white px-6 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-semibold m-0 text-slate-800">{getPageTitle()}</h2>
        </Header>
        <Content className="m-6 p-6">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AppLayout;
