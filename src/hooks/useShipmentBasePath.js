import useAuth from '../context/useAuth.js';

function useShipmentBasePath() {
  const { user } = useAuth();

  return user?.role === 'ROLE_ADMIN'
    ? '/admin/shipments'
    : '/client/shipments';
}

export default useShipmentBasePath;
