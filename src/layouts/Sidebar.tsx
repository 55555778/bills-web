import {
  HomeOutlined,
  PieChartOutlined,
  ProfileOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCommonStore } from '../stores/comStore';
const items = [
  { key: '/', icon: <HomeOutlined />, label: '主页' },
  { key: '/list', icon: <UnorderedListOutlined />, label: '记账列表' },
  { key: '/setting', icon: <TagsOutlined />, label: '分类管理' },
  { key: '/chart', icon: <PieChartOutlined />, label: '报表展示' },
  { key: '/group', icon: <ProfileOutlined />, label: '账单管理' },
  { key: '/user', icon: <UserOutlined />, label: '用户信息' },
];
export default function Sidebar() {
  const location = useLocation(); // 使用 useLocation 监听路由变化

  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const { openSide, isDark } = useCommonStore();
  const navigate = useNavigate();

  const handleClick = (e: { key: string }) => {
    navigate(e.key);
    setSelectedKey(e.key);
  };
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  return (
    <Menu
      className={`max-w-64 ${!isDark ? 'isDark_box_bg' : ''}`}
      selectedKeys={[selectedKey]}
      mode="inline"
      theme={!isDark ? 'dark' : 'light'}
      inlineCollapsed={openSide}
      items={items}
      onClick={handleClick}
    />
  );
}
