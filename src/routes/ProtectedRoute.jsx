import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import useAuth from '../context/useAuth.js';

function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <header className="navbar navbar-expand cargo-app-header">
        <div className="container">
          <Link className="navbar-brand cargo-app-brand" to="/">
            <span>C</span> CargoSphere
          </Link>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {user.role === 'ROLE_CLIENT' ? (
              <Link className="cargo-app-profile-link" to="/client/profile">
                Profile
              </Link>
            ) : null}
            <div className="text-end d-none d-sm-block">
              <div className="fw-semibold small">{user.fullName}</div>
              <div className="text-secondary small">{user.email}</div>
            </div>

            <button
              type="button"
              className="cargo-app-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
}

export default ProtectedRoute;
