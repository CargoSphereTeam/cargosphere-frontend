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

  const [year, month, day] = value.split('-').map(Number);

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(year, month - 1, day));
}

function formatDateTime(value) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatCargoType(cargoType) {
  if (!cargoType) {
    return 'Not specified';
  }

  return cargoType.replaceAll('_', ' ');
}

function ShipmentDetailsPage() {
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [cargoDetails, setCargoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        if (isActive) {
          setShipment(shipmentData);
          setCargoDetails(
            Array.isArray(cargoData) ? cargoData : [],
          );
        }
      } catch (requestError) {
        if (isActive) {
          const errorMessage =
            requestError.response?.data?.message ??
            'Unable to load shipment details. Please try again.';

          setError(errorMessage);
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
  }, [shipmentId]);

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
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
          to="/shipments"
          className="btn btn-link p-0 mb-3 text-decoration-none"
        >
          ← Back to Shipments
        </Link>

        <div className="alert alert-danger" role="alert">
          {error || 'Shipment details are unavailable.'}
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <Link
            to="/shipments"
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
              <h2 className="h5 mb-0">Shipment Information</h2>
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
                    {shipment.shipmentType}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Current Status
                  </p>

                  <ShipmentStatusBadge status={shipment.status} />
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Expected Pickup
                  </p>

                  <p className="fw-semibold mb-0">
                    {formatDate(shipment.expectedPickupDate)}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Expected Delivery
                  </p>

                  <p className="fw-semibold mb-0">
                    {formatDate(shipment.expectedDeliveryDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-body d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Cargo Details</h2>

              <Link
                to={`/shipments/${shipmentId}/cargo`}
                className="btn btn-sm btn-outline-primary"
              >
                Add Cargo
              </Link>
            </div>

            {cargoDetails.length === 0 ? (
              <div className="card-body text-center py-5">
                <p className="text-secondary mb-3">
                  No cargo details have been added to this shipment.
                </p>

                <Link
                  to={`/shipments/${shipmentId}/cargo`}
                  className="btn btn-primary"
                >
                  Add Cargo Details
                </Link>
              </div>
            ) : (
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  {cargoDetails.map((cargo) => (
                    <div
                      key={cargo.id}
                      className="border rounded p-3"
                    >
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                        <div>
                          <h3 className="h6 mb-1">
                            {cargo.cargoName}
                          </h3>

                          <p className="text-secondary small mb-0">
                            {formatCargoType(cargo.cargoType)}
                          </p>
                        </div>

                        <span className="badge text-bg-light align-self-start">
                          Quantity: {cargo.quantity}
                        </span>
                      </div>

                      {cargo.cargoDescription && (
                        <p className="mb-3">
                          {cargo.cargoDescription}
                        </p>
                      )}

                      <div className="row g-3">
                        <div className="col-6 col-md-3">
                          <p className="text-secondary small mb-1">
                            Weight
                          </p>

                          <p className="fw-semibold mb-0">
                            {cargo.weightKg} kg
                          </p>
                        </div>

                        <div className="col-6 col-md-3">
                          <p className="text-secondary small mb-1">
                            Volume
                          </p>

                          <p className="fw-semibold mb-0">
                            {cargo.volumeCbm
                              ? `${cargo.volumeCbm} CBM`
                              : 'Not set'}
                          </p>
                        </div>

                        <div className="col-6 col-md-3">
                          <p className="text-secondary small mb-1">
                            Fragile
                          </p>

                          <p className="fw-semibold mb-0">
                            {cargo.fragile ? 'Yes' : 'No'}
                          </p>
                        </div>

                        <div className="col-6 col-md-3">
                          <p className="text-secondary small mb-1">
                            Hazardous
                          </p>

                          <p className="fw-semibold mb-0">
                            {cargo.hazardous ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-body">
              <h2 className="h5 mb-0">Shipment Actions</h2>
            </div>

            <div className="card-body d-grid gap-2">
              <Link
                to={`/shipments/${shipmentId}/status`}
                className="btn btn-primary"
              >
                Update Status
              </Link>

              <Link
                to={`/shipments/${shipmentId}/events`}
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