import { Route, Routes } from 'react-router-dom';
import NotFoundPage from '../pages/common/NotFoundPage.jsx';
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
      <Route index element={<ShipmentListPage />} />

      <Route
        path="new"
        element={<CreateShipmentPage />}
      />

      <Route
        path=":shipmentId"
        element={<ShipmentDetailsPage />}
      />

      <Route
        path=":shipmentId/cargo"
        element={<AddCargoDetailsPage />}
      />

      <Route
        path=":shipmentId/events"
        element={<ShipmentEventsPage />}
      />

      <Route
        path=":shipmentId/status"
        element={<UpdateShipmentStatusPage />}
      />

      <Route
        path="/payments/:shipmentId"
        element={<PaymentSummaryPage />}
      />
     
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default ShipmentRoutes;
