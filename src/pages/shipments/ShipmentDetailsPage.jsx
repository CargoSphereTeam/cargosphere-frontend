import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getCargoDetailsByShipmentId,
  getShipmentById,
} from '../../api/shipmentApi.js';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';
import RazorpayCheckoutButton from '../../components/payment/RazorpayCheckoutButton.jsx';
import { calculateShipmentPrice } from '../../utils/shipmentPricing.js';
import './shipmentDetailsPage.css';

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

  const paymentDetails =
    shipment && cargoDetails.length > 0
      ? calculateShipmentPrice(shipment, cargoDetails)
      : null;
  const canAddCargo = ['CREATED', 'BOOKED'].includes(shipment?.status);

  function formatCurrency(value, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  if (loading) {
    return (
      <main className="cargo-details-page cargo-details-state text-center">
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
      <main className="cargo-details-page cargo-details-state">
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
    <main className="cargo-details-page">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <Link
            to=".."
            relative="path"
            className="cargo-details-back"
          >
            ← Back to Shipments
          </Link>

          <span className="cargo-page-label d-block mt-4">SHIPMENT OVERVIEW</span>
          <h1>Shipment details</h1>

          <p className="cargo-details-number">
            {shipment.shipmentNumber}
          </p>
        </div>

        <ShipmentStatusBadge status={shipment.status} />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card cargo-detail-card mb-4">
            <div className="card-header">
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

          <div className="card cargo-detail-card cargo-table-card">
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <div>
                <h2 className="h5 mb-1">Cargo Details</h2>

                <p className="text-secondary small mb-0">
                  {cargoDetails.length} cargo item
                  {cargoDetails.length === 1 ? '' : 's'}
                </p>
              </div>

              {canAddCargo ? (
                <Link to="cargo" className="cargo-detail-action">
                  Add Cargo
                </Link>
              ) : null}
            </div>

            {cargoDetails.length === 0 ? (
              <div className="card-body text-center py-5">
                <h3 className="h6">
                  No cargo details added
                </h3>

                <p className="text-secondary mb-3">
                  {canAddCargo
                    ? 'Add cargo weight, volume and handling information for this shipment.'
                    : 'Cargo changes are locked after the shipment enters transit.'}
                </p>

                {canAddCargo ? (
                  <Link to="cargo" className="cargo-detail-action cargo-detail-action-primary">
                    Add First Cargo Item
                  </Link>
                ) : null}
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
                  <table className="table cargo-detail-table align-middle mb-0">
                    <thead>
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
          <div className="card cargo-detail-card cargo-payment-card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-0">Payment Details</h2>
            </div>

            <div className="card-body">
              {paymentDetails ? (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Base amount</span>
                    <span>{formatCurrency(paymentDetails.baseAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Charges</span>
                    <span>{formatCurrency(paymentDetails.charges)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-secondary">Tax (18%)</span>
                    <span>{formatCurrency(paymentDetails.taxes)}</span>
                  </div>
                  <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Total payout amount</span>
                    <span className="h5 text-primary mb-0">
                      {formatCurrency(paymentDetails.estimatedAmount)}
                    </span>
                  </div>
                  <p className="text-secondary small mt-3 mb-0">
                    Calculated from shipment type, weight, volume, quantity,
                    and special handling.
                  </p>
                  <RazorpayCheckoutButton
                    shipmentId={shipmentId}
                    disabled={paymentDetails.estimatedAmount <= 0}
                    onPaid={() => setReloadKey((value) => value + 1)}
                  />
                  <p className="cargo-payment-security-note mb-0">
                    Secure test payment. Your card details are handled by Razorpay.
                  </p>
                </>
              ) : (
                <p className="text-secondary mb-0">
                  Payment amount will appear after cargo details are added.
                </p>
              )}
            </div>
          </div>

          <div className="card cargo-detail-card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-0">
                Shipment Actions
              </h2>
            </div>

            <div className="card-body d-grid gap-2">
              {canAddCargo ? (
                <Link to="cargo" className="cargo-detail-action cargo-detail-action-primary">
                  Add Cargo
                </Link>
              ) : null}

              <Link
                to="events"
                className="cargo-detail-action"
              >
                View Event History
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ShipmentDetailsPage;
