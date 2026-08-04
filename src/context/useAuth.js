import { useContext } from 'react';
import AuthContext from './AuthContext.js';

function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return authContext;
}

export default useAuth;
