import { useNavigate } from 'react-router-dom';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

const CURRENT_STATUS = 'BOOKED';

const ALLOWED_TRANSITIONS = {
  CREATED: ['BOOKED', 'CANCELLED'],
  BOOKED: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

function formatStatus(status) {
  return status.replaceAll('_', ' ');
}

function UpdateShipmentStatusPage() {
  const navigate = useNavigate();

  const availableStatuses =
    ALLOWED_TRANSITIONS[CURRENT_STATUS] ?? [];

  const handleBackToDetails = () => {
    navigate('..', { relative: 'path' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-link p-0 mb-2 text-decoration-none"
          onClick={handleBackToDetails}
        >
          ← Back to Shipment Details
        </button>

        <h1 className="h2 mb-1">Update Shipment Status</h1>

        <p className="text-secondary">
          CS-20260721-31B016FE
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="mb-4">
            <p className="text-secondary small mb-2">
              Current Status
            </p>

            <ShipmentStatusBadge status={CURRENT_STATUS} />
          </div>

          {availableStatuses.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="form-label"
                >
                  New Status
                </label>

                <select
                  id="status"
                  name="status"
                  className="form-select"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select new status
                  </option>

                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>

                <div className="form-text">
                  Only valid transitions from the current status are shown.
                </div>
              </div>

              <div className="alert alert-warning" role="alert">
                Confirm the new status carefully. Some shipment status
                changes cannot be reversed.
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleBackToDetails}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Status
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-secondary mb-0" role="alert">
              This shipment is in a terminal status and cannot be updated.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default UpdateShipmentStatusPage;
