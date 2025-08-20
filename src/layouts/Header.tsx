import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, type MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCommonStore } from '../stores/comStore';
import { useUserStore } from '../stores/userStore';

export default function Header() {
  const navigate = useNavigate();

  const { name } = useUserStore();
  const { setOpenSide, openSide, isDark } = useCommonStore();
  const { removeAllUser } = useUserStore();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: name,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: '个人中心',
      icon: <TeamOutlined />,
      onClick: () => {
        navigate('/user');
      },
    },
    {
      key: '3',
      label: '退出登录',
      onClick: () => {
        removeAllUser();
        navigate('/login');
      },
      icon: <SettingOutlined />,
    },
  ];
  return (
    <div
      className={`flex items-center justify-between font-bold p-5 bg-[#fff] h-15 ${!isDark ? 'isDark_box_bg' : ''}`}
    >
      <div className="left">
        <Button variant="text" onClick={setOpenSide}>
          {openSide ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      <div className="right">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <UserOutlined style={isDark ? { color: '#000' } : { color: '#fff' }} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
