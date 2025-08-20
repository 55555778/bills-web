import { PlusCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';
import Create from '../components/common/create';
import { useCommonStore } from '../stores/comStore';
import { useFlowStore } from '../stores/flowStore';
import Header from './Header';
import Menu from './Sidebar';
export default function MainLayout() {
  const { isDark } = useCommonStore();
  const { isOpen, setOpenSide } = useFlowStore();

  return (
    <div className={`flex min-h-screen  bg-[#f3f3f3] ${!isDark ? 'isDark_bg isMain_text' : ''}`}>
      <Menu></Menu>

      <div className="content w-full  flex flex-col gap-5  min-h-screen">
        <Header></Header>
        <div className="p-4 flex-1">
          <div
            className={`main h-full max-h-210! min-h-200  overflow-auto  bg-[#fff]  p-4 rounded-sm ${!isDark ? 'isDark_box_bg' : ''}`}
          >
            <Outlet /> {/* 渲染子路由页面 */}
          </div>
        </div>
        {/* <Footer></Footer> */}

        <FloatButton
          onClick={() => setOpenSide(true)}
          icon={<PlusCircleOutlined />}
          type="primary"
          className="w-15! h-15! "
        />

        <Create drawerOpen={isOpen} onClose={() => setOpenSide(false)}></Create>
      </div>
    </div>
  );
}
