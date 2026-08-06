import { Navigate, Route, Routes } from 'react-router-dom';
import AddCargoDetailsPage from '../pages/shipments/AddCargoDetailsPage.jsx';
import CreateShipmentPage from '../pages/shipments/CreateShipmentPage.jsx';
import ShipmentDetailsPage from '../pages/shipments/ShipmentDetailsPage.jsx';
import ShipmentEventsPage from '../pages/shipments/ShipmentEventsPage.jsx';
import ShipmentListPage from '../pages/shipments/ShipmentListPage.jsx';
import UpdateShipmentStatusPage from '../pages/shipments/UpdateShipmentStatusPage.jsx';
import PaymentSummaryPage from '../pages/payments/PaymentSummaryPage.jsx';

function ShipmentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shipments" replace />} />

      <Route
        path="/shipments"
        element={<ShipmentListPage />}
      />

      <Route
        path="/shipments/new"
        element={<CreateShipmentPage />}
      />

      <Route
        path="/shipments/:shipmentId"
        element={<ShipmentDetailsPage />}
      />

      <Route
        path="/shipments/:shipmentId/cargo"
        element={<AddCargoDetailsPage />}
      />

      <Route
        path="/shipments/:shipmentId/events"
        element={<ShipmentEventsPage />}
      />

      <Route
        path="/shipments/:shipmentId/status"
        element={<UpdateShipmentStatusPage />}
      />

      <Route
        path="/payments/:shipmentId"
        element={<PaymentSummaryPage />}
      />
      <Route path="*" element={<Navigate to="/shipments" replace />} />
    </Routes>
  );
}

export default ShipmentRoutes;