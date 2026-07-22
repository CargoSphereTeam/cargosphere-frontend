import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getShipmentById,
  updateShipmentStatus,
} from '../../api/shipmentApi.js';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

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
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadShipment() {
      try {
        setLoading(true);
        setError('');

        const shipmentData = await getShipmentById(shipmentId);

        if (isActive) {
          setShipment(shipmentData);
        }
      } catch (requestError) {
        if (isActive) {
          const errorMessage =
            requestError.response?.data?.message ??
            'Unable to load the shipment. Please try again.';

          setError(errorMessage);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadShipment();

    return () => {
      isActive = false;
    };
  }, [shipmentId]);

  const handleBackToDetails = () => {
    navigate(`/shipments/${shipmentId}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!selectedStatus) {
      setError('Please select a new shipment status.');
      return;
    }

    try {
      setSubmitting(true);

      await updateShipmentStatus(shipmentId, {
        status: selectedStatus,
      });

      navigate(`/shipments/${shipmentId}`);
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.message ??
        'Unable to update shipment status. Please try again.';

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading shipment...
          </span>
        </div>

        <p className="text-secondary mt-3 mb-0">
          Loading shipment...
        </p>
      </main>
    );
  }

  if (!shipment) {
    return (
      <main className="container py-4">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none"
          onClick={handleBackToDetails}
        >
          ← Back to Shipment Details
        </button>

        <div className="alert alert-danger" role="alert">
          {error || 'Shipment information is unavailable.'}
        </div>
      </main>
    );
  }

  const availableStatuses =
    ALLOWED_TRANSITIONS[shipment.status] ?? [];

  return (
    <main className="container py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-link p-0 mb-2 text-decoration-none"
          onClick={handleBackToDetails}
          disabled={submitting}
        >
          ← Back to Shipment Details
        </button>

        <h1 className="h2 mb-1">
          Update Shipment Status
        </h1>

        <p className="text-secondary">
          {shipment.shipmentNumber}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="mb-4">
            <p className="text-secondary small mb-2">
              Current Status
            </p>

            <ShipmentStatusBadge status={shipment.status} />
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
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value)
                  }
                  disabled={submitting}
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
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
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