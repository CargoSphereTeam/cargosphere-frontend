import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

function RoleRoute({ allowedRoles = [] }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
