// router/index.tsx
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/protecteRoute';
import MainLayout from '../layouts/MainLayout';
import Chart from '../pages/chart/index';
import Group from '../pages/group';
import Home from '../pages/home/index';
import List from '../pages/list/index';
import Login from '../pages/login/index';
import Setting from '../pages/setting/index';
import User from '../pages/user/index';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* 带布局的页面 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />}></Route>
        <Route path="/chart" element={<Chart />}></Route>
        <Route path="/group" element={<Group />}></Route>
        <Route path="/user" element={<User />}></Route>
        <Route path="/setting" element={<Setting />}></Route>

        {/* 其他页面 */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
