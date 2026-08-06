import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShipmentsByClientUserId } from '../../api/shipmentApi.js';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

function formatDateTime(value) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(date);
}

function getErrorMessage(requestError) {
  const responseData = requestError.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  const status = requestError.response?.status;

  if (status === 401) {
    return 'Your session is missing or invalid. Please sign in again.';
  }

  if (status === 403) {
    return 'You are not allowed to view shipments for this client.';
  }

  if (status >= 500) {
    return 'The shipment service is currently unavailable. Please try again later.';
  }

  return 'Unable to load your shipments. Please try again.';
}

function ClientShipmentListPage({ clientUserId }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadClientShipments() {
      if (!clientUserId || Number(clientUserId) < 1) {
        setError(
          'Authenticated client information is not available.',
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const shipmentData =
          await getShipmentsByClientUserId(clientUserId);

        if (isActive) {
          setShipments(
            Array.isArray(shipmentData) ? shipmentData : [],
          );
        }
      } catch (requestError) {
        if (isActive) {
          setError(getErrorMessage(requestError));
          setShipments([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadClientShipments();

    return () => {
      isActive = false;
    };
  }, [clientUserId, reloadKey]);

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">My Shipments</h1>

          <p className="text-secondary mb-0">
            View and manage shipments created for your account.
          </p>
        </div>

        <Link to="/shipments/new" className="btn btn-primary">
          Create Shipment
        </Link>
      </div>

      {loading ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading shipments...
              </span>
            </div>

            <p className="text-secondary mt-3 mb-0">
              Loading your shipments...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <h2 className="h5 alert-heading">
            Unable to load shipments
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      ) : shipments.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h2 className="h5">No shipments found</h2>

            <p className="text-secondary mb-3">
              Create your first shipment to begin managing cargo.
            </p>

            <Link
              to="/shipments/new"
              className="btn btn-primary"
            >
              Create Shipment
            </Link>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Shipment Number</th>
                    <th>Route</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Expected Delivery</th>
                    <th>Created At</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="fw-semibold">
                        {shipment.shipmentNumber}
                      </td>

                      <td>
                        {shipment.originLocation}
                        {' → '}
                        {shipment.destinationLocation}
                      </td>

                      <td>{shipment.shipmentType}</td>

                      <td>
                        <ShipmentStatusBadge
                          status={shipment.status}
                        />
                      </td>

                      <td>
                        {formatDate(
                          shipment.expectedDeliveryDate,
                        )}
                      </td>

                      <td>
                        {formatDateTime(shipment.createdAt)}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/shipments/${shipment.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ClientShipmentListPage;