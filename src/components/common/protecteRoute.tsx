// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

interface Props {
  children: React.ReactNode;
}
const ProtectedRoute = ({ children }: Props) => {
  const { name, _id } = useUserStore();
  const isAuthenticated = () => {
    // 实际项目中应该是从 token、cookie、redux、context 等判断
    return !!name && !!_id;
  };
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
