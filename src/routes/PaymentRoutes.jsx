import { Navigate, Route, Routes } from 'react-router-dom';
import PaymentSummaryPage from '../pages/payments/PaymentSummaryPage.jsx';

function PaymentRoutes() {
  return (
    <Routes>
      <Route
        path="/payments/:shipmentId"
        element={<PaymentSummaryPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/payments/1" replace />}
      />
    </Routes>
  );
}

export default PaymentRoutes;