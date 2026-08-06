import { Outlet } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import RoleHomeRedirect from './RoleHomeRedirect.jsx';

function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <RoleHomeRedirect />;
  }

  return <Outlet />;
}

export default GuestRoute;
