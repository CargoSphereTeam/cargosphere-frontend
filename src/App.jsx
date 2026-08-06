import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import AccessDeniedPage from './pages/common/AccessDeniedPage.jsx';
import NotFoundPage from './pages/common/NotFoundPage.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleHomeRedirect from './routes/RoleHomeRedirect.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import ShipmentRoutes from './routes/ShipmentRoutes.jsx';


function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/403" element={<AccessDeniedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<RoleHomeRedirect />} />

        <Route
          element={
            <RoleRoute allowedRoles={['ROLE_ADMIN']} />
          }
        >
          <Route
            path="/admin/dashboard"
            element={
              <Navigate to="/admin/shipments" replace />
            }
          />

          <Route
            path="/admin/shipments/*"
            element={<ShipmentRoutes />}
          />
        </Route>

        <Route
          element={
            <RoleRoute allowedRoles={['ROLE_CLIENT']} />
          }
        >
          <Route
            path="/client/shipments/*"
            element={<ShipmentRoutes />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
