import { Link, useParams } from 'react-router-dom';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

const SAMPLE_SHIPMENT = {
  id: 8,
  shipmentNumber: 'CS-20260721-31B016FE',
  clientUserId: 1,
  originLocation: 'Delhi',
  destinationLocation: 'Hyderabad',
  shipmentType: 'ROAD',
  status: 'IN_TRANSIT',
  expectedPickupDate: '2026-08-20',
  expectedDeliveryDate: '2026-08-25',
  createdAt: '2026-07-21T10:02:52Z',
  updatedAt: '2026-07-21T10:14:26Z',
};

function ShipmentDetailsPage() {
  const { shipmentId } = useParams();
  const shipment = SAMPLE_SHIPMENT;

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

          <p className="text-secondary">
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

                  <p className="fw-semibold">
                    {shipment.shipmentNumber}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Client User ID
                  </p>

                  <p className="fw-semibold">
                    {shipment.clientUserId}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Origin
                  </p>

                  <p className="fw-semibold">
                    {shipment.originLocation}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Destination
                  </p>

                  <p className="fw-semibold">
                    {shipment.destinationLocation}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Shipment Type
                  </p>

                  <p className="fw-semibold">
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

                  <p className="fw-semibold">
                    {shipment.expectedPickupDate}
                  </p>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-secondary small mb-1">
                    Expected Delivery
                  </p>

                  <p className="fw-semibold">
                    {shipment.expectedDeliveryDate}
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

            <div className="card-body text-center py-5">
              <p className="text-secondary mb-0">
                Cargo details will appear here.
              </p>
            </div>
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

              <p className="mb-3">{shipment.createdAt}</p>

              <p className="text-secondary small mb-1">
                Last Updated
              </p>

              <p className="mb-0">{shipment.updatedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShipmentDetailsPage;