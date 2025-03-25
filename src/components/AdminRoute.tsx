import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  if (!user || user.tipo !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
