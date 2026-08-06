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
import './shipmentListPage.css';

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

  const activeShipments = shipments.filter(
    (shipment) => !['DELIVERED', 'CANCELLED'].includes(shipment.status),
  ).length;
  const deliveredShipments = shipments.filter(
    (shipment) => shipment.status === 'DELIVERED',
  ).length;
  const nextDelivery = shipments
    .map((shipment) => shipment.expectedDeliveryDate)
    .filter(Boolean)
    .sort()[0];

  return (
    <main className="cargo-shipments-page">
      <div className="container cargo-shipments-container">
        <div className="cargo-shipments-heading">
          <div>
            <span className="cargo-page-label">
              {user.role === 'ROLE_ADMIN' ? 'OPERATIONS CONTROL' : 'CLIENT WORKSPACE'}
            </span>
            <h1>Shipments</h1>

            <p>
              {user.role === 'ROLE_ADMIN'
                ? 'Monitor and manage every shipment across the network.'
                : `Welcome back, ${user.fullName}. Track every movement in one place.`}
            </p>
          </div>

          <Link to={`${shipmentBasePath}/new`} className="cargo-create-button">
            <span>+</span> Create shipment
          </Link>
        </div>

        <section className="cargo-shipment-stats" aria-label="Shipment summary">
          <article><span>Total shipments</span><strong>{shipments.length}</strong><small>All recorded freight</small></article>
          <article><span>Active movement</span><strong>{activeShipments}</strong><small>Requiring attention</small></article>
          <article><span>Delivered</span><strong>{deliveredShipments}</strong><small>Completed successfully</small></article>
          <article><span>Next delivery</span><strong className="cargo-stat-date">{nextDelivery ? formatDate(nextDelivery) : 'Not scheduled'}</strong><small>Closest expected date</small></article>
        </section>

        {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <div className="cargo-shipment-panel">
        <div className="cargo-panel-heading">
          <div><span className="cargo-live-dot" /> LIVE OVERVIEW</div>
          <span>{shipments.length} records</span>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading shipments...
              </span>
            </div>

            <p className="cargo-panel-muted mt-3 mb-0">
              Loading shipments...
            </p>
          </div>
        ) : shipments.length === 0 && !error ? (
          <div className="text-center py-5">
            <h2 className="h5">No shipments found</h2>

            <p className="cargo-panel-muted mb-3">
              Create the first shipment to begin tracking cargo.
            </p>

            <Link
              to={`${shipmentBasePath}/new`}
              className="cargo-create-button"
            >
              Create Shipment
            </Link>
          </div>
        ) : (
          <div>
            <div className="table-responsive">
              <table className="table cargo-shipments-table align-middle mb-0">
                <thead>
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
                      <td>
                        <div className="cargo-shipment-number">{shipment.shipmentNumber}</div>
                        <small>#{shipment.id}</small>
                      </td>

                      <td>
                        <div className="cargo-route-cell">
                          <span>{shipment.originLocation}</span>
                          <i>→</i>
                          <span>{shipment.destinationLocation}</span>
                        </div>
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
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`${shipmentBasePath}/${shipment.id}`}
                            className="cargo-table-action"
                          >
                            View Details
                          </Link>

                          {user.role === 'ROLE_ADMIN' ? (
                            <Link
                              to={`${shipmentBasePath}/${shipment.id}/process`}
                              className="cargo-table-action cargo-table-action-primary"
                            >
                              Process Shipment
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}

export default ShipmentListPage;
