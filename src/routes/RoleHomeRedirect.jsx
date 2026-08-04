import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

function RoleHomeRedirect() {
  const { user } = useAuth();

  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === 'ROLE_CLIENT') {
    return <Navigate to="/client/shipments" replace />;
  }

  return <Navigate to="/403" replace />;
}

export default RoleHomeRedirect;
