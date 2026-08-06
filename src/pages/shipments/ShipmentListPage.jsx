import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllShipments,
  getShipmentsByClientUserId,
} from '../../api/shipmentApi.js';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';
import useAuth from '../../context/useAuth.js';
import useShipmentBasePath from '../../hooks/useShipmentBasePath.js';
import { getApiErrorDetails } from '../../utils/apiError.js';

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const [year, month, day] = value.split('-').map(Number);

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(year, month - 1, day));
}

function ShipmentListPage() {
  const { user } = useAuth();
  const shipmentBasePath = useShipmentBasePath();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadShipments() {
      setLoading(true);
      setError('');

      try {
        const shipmentData =
          user.role === 'ROLE_ADMIN'
            ? await getAllShipments()
            : await getShipmentsByClientUserId(user.id);

        if (isActive) {
          setShipments(
            Array.isArray(shipmentData) ? shipmentData : [],
          );
        }
      } catch (requestError) {
        if (isActive) {
          const apiError = getApiErrorDetails(
            requestError,
            'Unable to load shipments. Please try again.',
          );

          setError(apiError.message);
          setShipments([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadShipments();

    return () => {
      isActive = false;
    };
  }, [user.id, user.role]);

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Shipments</h1>

          <p className="text-secondary mb-0">
            {user.role === 'ROLE_ADMIN'
              ? 'View and manage all CargoSphere shipments.'
              : 'View and manage your CargoSphere shipments.'}
          </p>
        </div>

        <Link to={`${shipmentBasePath}/new`} className="btn btn-primary">
          Create Shipment
        </Link>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <div className="card shadow-sm">
        {loading ? (
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
              Loading shipments...
            </p>
          </div>
        ) : shipments.length === 0 && !error ? (
          <div className="card-body text-center py-5">
            <h2 className="h5">No shipments found</h2>

            <p className="text-secondary mb-3">
              Create the first shipment to begin tracking cargo.
            </p>

            <Link
              to={`${shipmentBasePath}/new`}
              className="btn btn-primary"
            >
              Create Shipment
            </Link>
          </div>
        ) : (
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
                        {' \u2192 '}
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

                      <td className="text-end">
                        <Link
                          to={`${shipmentBasePath}/${shipment.id}`}
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
        )}
      </div>
    </main>
  );
}

export default ShipmentListPage;
