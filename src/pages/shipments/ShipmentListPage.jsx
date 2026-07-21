import { Link } from 'react-router-dom';
import ShipmentStatusBadge from '../../components/shipment/ShipmentStatusBadge.jsx';

const SAMPLE_SHIPMENTS = [
  {
    id: 1,
    shipmentNumber: 'CS-20260721-DEMO0001',
    originLocation: 'Mumbai',
    destinationLocation: 'Bengaluru',
    shipmentType: 'ROAD',
    status: 'CREATED',
    expectedDeliveryDate: '2026-08-15',
  },
  {
    id: 2,
    shipmentNumber: 'CS-20260721-DEMO0002',
    originLocation: 'Delhi',
    destinationLocation: 'Hyderabad',
    shipmentType: 'ROAD',
    status: 'IN_TRANSIT',
    expectedDeliveryDate: '2026-08-25',
  },
];

function ShipmentListPage() {
  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Shipments</h1>

          <p className="text-secondary">
            View and manage CargoSphere shipments.
          </p>
        </div>

        <Link to="/shipments/new" className="btn btn-primary">
          Create Shipment
        </Link>
      </div>

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
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {SAMPLE_SHIPMENTS.map((shipment) => (
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
                      <ShipmentStatusBadge status={shipment.status} />
                    </td>

                    <td>{shipment.expectedDeliveryDate}</td>

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
    </main>
  );
}

export default ShipmentListPage;