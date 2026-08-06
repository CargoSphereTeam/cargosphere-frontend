import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getCargoDetailsByShipmentId,
  getShipmentById,
} from '../../api/shipmentApi.js';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

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

function formatEnumLabel(value) {
  if (!value) {
    return 'Not specified';
  }

  return value
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}

function getRequestErrorMessage(requestError) {
  const responseData = requestError.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (
    responseData?.errors &&
    typeof responseData.errors === 'object'
  ) {
    return Object.values(responseData.errors).join(' ');
  }

  const status = requestError.response?.status;

  if (status === 401) {
    return 'Your session is missing or invalid. Please sign in again.';
  }

  if (status === 403) {
    return 'You are not allowed to view this shipment.';
  }

  if (status === 404) {
    return 'The requested shipment could not be found.';
  }

  if (status >= 500) {
    return 'The shipment service is currently unavailable. Please try again later.';
  }

  return 'Unable to load shipment details. Please try again.';
}

function ShipmentDetailsPage() {
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [cargoDetails, setCargoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadShipmentDetails() {
      try {
        setLoading(true);
        setError('');

        const [shipmentData, cargoData] = await Promise.all([
          getShipmentById(shipmentId),
          getCargoDetailsByShipmentId(shipmentId),
        ]);

        if (!isActive) {
          return;
        }

        setShipment(shipmentData);
        setCargoDetails(
          Array.isArray(cargoData) ? cargoData : [],
        );
      } catch (requestError) {
        if (isActive) {
          setError(getRequestErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadShipmentDetails();

    return () => {
      isActive = false;
    };
  }, [shipmentId, reloadKey]);

  const totalWeightKg = cargoDetails.reduce(
    (total, cargo) =>
      total + (Number(cargo.weightKg) || 0),
    0,
  );

  const totalVolumeCbm = cargoDetails.reduce(
    (total, cargo) =>
      total + (Number(cargo.volumeCbm) || 0),
    0,
  );

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading shipment details...
          </span>
        </div>

        <p className="text-secondary mt-3 mb-0">
          Loading shipment details...
        </p>
      </main>
    );
  }

  if (error || !shipment) {
    return (
      <main className="container py-4">
        <Link
          to=".."
          relative="path"
          className="btn btn-link p-0 mb-3 text-decoration-none"
        >
          ← Back to Shipments
        </Link>

        <div className="alert alert-danger" role="alert">
          <h1 className="h5 alert-heading">
            Unable to load shipment
          </h1>

          <p>{error || 'Shipment data is unavailable.'}</p>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() =>
              setReloadKey((currentKey) => currentKey + 1)
            }
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <Link
            to=".."
            relative="path"
            className="btn btn-link p-0 mb-2 text-decoration-none"
          >
            ← Back to Shipments
          </Link>

          <h1 className="h2 mb-1">Shipment Details</h1>

          <p className="text-secondary mb-0">
            {shipment.shipmentNumber}
          </p>
        </div>

        <ShipmentStatusBadge status={shipment.status} />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-body">
              <h2 className="h5 mb-0">
                Shipment Information
              </h2>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Shipment Number
                  </p>

                  <p className="fw-semibold mb-0">
                    {shipment.shipmentNumber}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Client User ID
                  </p>

                  <p className="fw-semibold mb-0">
                    {shipment.clientUserId}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Origin
                  </p>

                  <p className="fw-semibold mb-0">
                    {shipment.originLocation}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Destination
                  </p>

                  <p className="fw-semibold mb-0">
                    {shipment.destinationLocation}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Shipment Type
                  </p>

                  <p className="fw-semibold mb-0">
                    {formatEnumLabel(
                      shipment.shipmentType,
                    )}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Current Status
                  </p>

                  <ShipmentStatusBadge
                    status={shipment.status}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Expected Pickup
                  </p>

                  <p className="fw-semibold mb-0">
                    {formatDate(
                      shipment.expectedPickupDate,
                    )}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Expected Delivery
                  </p>

                  <p className="fw-semibold mb-0">
                    {formatDate(
                      shipment.expectedDeliveryDate,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-body d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <div>
                <h2 className="h5 mb-1">Cargo Details</h2>

                <p className="text-secondary small mb-0">
                  {cargoDetails.length} cargo item
                  {cargoDetails.length === 1 ? '' : 's'}
                </p>
              </div>

              <Link
                to="cargo"
                className="btn btn-sm btn-outline-primary"
              >
                Add Cargo
              </Link>
            </div>

            {cargoDetails.length === 0 ? (
              <div className="card-body text-center py-5">
                <h3 className="h6">
                  No cargo details added
                </h3>

                <p className="text-secondary mb-3">
                  Add cargo weight, volume and handling
                  information for this shipment.
                </p>

                <Link
                  to="cargo"
                  className="btn btn-primary"
                >
                  Add First Cargo Item
                </Link>
              </div>
            ) : (
              <>
                <div className="card-body border-bottom">
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <p className="text-secondary small mb-1">
                        Total Weight
                      </p>

                      <p className="fw-semibold mb-0">
                        {totalWeightKg.toFixed(3)} kg
                      </p>
                    </div>

                    <div className="col-12 col-sm-6">
                      <p className="text-secondary small mb-1">
                        Total Volume
                      </p>

                      <p className="fw-semibold mb-0">
                        {totalVolumeCbm.toFixed(3)} CBM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Cargo</th>
                        <th>Type</th>
                        <th>Weight</th>
                        <th>Volume</th>
                        <th>Quantity</th>
                        <th>Handling</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cargoDetails.map((cargo) => (
                        <tr key={cargo.id}>
                          <td>
                            <div className="fw-semibold">
                              {cargo.cargoName}
                            </div>

                            {cargo.cargoDescription && (
                              <div className="text-secondary small">
                                {cargo.cargoDescription}
                              </div>
                            )}
                          </td>

                          <td>
                            {formatEnumLabel(cargo.cargoType)}
                          </td>

                          <td>
                            {Number(cargo.weightKg).toFixed(3)}
                            {' kg'}
                          </td>

                          <td>
                            {cargo.volumeCbm == null
                              ? 'Not specified'
                              : `${Number(
                                  cargo.volumeCbm,
                                ).toFixed(3)} CBM`}
                          </td>

                          <td>
                            {cargo.quantity ??
                              'Not specified'}
                          </td>

                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {cargo.fragile && (
                                <span className="badge text-bg-warning">
                                  Fragile
                                </span>
                              )}

                              {cargo.hazardous && (
                                <span className="badge text-bg-danger">
                                  Hazardous
                                </span>
                              )}

                              {!cargo.fragile &&
                                !cargo.hazardous && (
                                  <span className="text-secondary">
                                    Standard
                                  </span>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-body">
              <h2 className="h5 mb-0">
                Shipment Actions
              </h2>
            </div>

            <div className="card-body d-grid gap-2">
              <Link
                to="cargo"
                className="btn btn-primary"
              >
                Add Cargo
              </Link>

              <Link
                to="events"
                className="btn btn-outline-secondary"
              >
                View Event History
              </Link>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-body">
              <h2 className="h5 mb-0">Timestamps</h2>
            </div>

            <div className="card-body">
              <p className="text-secondary small mb-1">
                Created At
              </p>

              <p className="mb-3">
                {formatDateTime(shipment.createdAt)}
              </p>

              <p className="text-secondary small mb-1">
                Last Updated
              </p>

              <p className="mb-0">
                {formatDateTime(shipment.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShipmentDetailsPage;