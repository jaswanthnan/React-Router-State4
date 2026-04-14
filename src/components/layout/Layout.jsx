import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, ConfigProvider, theme } from 'antd';
import { DashboardOutlined, TeamOutlined, ProfileOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const { Header, Content, Sider } = AntLayout;

const AppLayout = () => {
  const { state } = useContext(AppContext);
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-900', 'text-slate-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-900', 'text-slate-100');
    }
  }, [isDarkMode]);

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
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <AntLayout style={{ minHeight: '100vh' }}>
        <Sider 
          breakpoint="lg" 
          collapsedWidth="0" 
          width={250} 
          theme={isDarkMode ? 'dark' : 'light'} 
          className="border-r border-gray-200 dark:border-gray-800"
          style={{ zIndex: 1000 }}
        >
          <div className="pt-4"></div>
          <Menu theme={isDarkMode ? 'dark' : 'light'} mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
        </Sider>
        <AntLayout>
          <Header className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'} px-4 md:px-6 flex justify-between items-center shadow-sm w-full`}>
            <h2 className={`text-lg md:text-xl font-semibold m-0 truncate pr-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{getPageTitle()}</h2>
            <Button
              type="text"
              icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ color: isDarkMode ? '#fff' : '#000' }}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Header>
          <Content className="m-2 md:m-6 p-2 md:p-6 overflow-x-hidden">
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </ConfigProvider>
  );
};

export default AppLayout;
