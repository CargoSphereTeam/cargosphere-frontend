import { useNavigate } from 'react-router-dom';

function CreateShipmentPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h2 mb-1">Create Shipment</h1>

        <p className="text-secondary">
          Enter the shipment route, transport type, and expected dates.
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="clientUserId" className="form-label">
                  Client User ID
                </label>

                <input
                  id="clientUserId"
                  name="clientUserId"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Enter client user ID"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="shipmentType" className="form-label">
                  Shipment Type
                </label>

                <select
                  id="shipmentType"
                  name="shipmentType"
                  className="form-select"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select shipment type
                  </option>

                  <option value="ROAD">Road</option>
                  <option value="RAIL">Rail</option>
                  <option value="AIR">Air</option>
                  <option value="SEA">Sea</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="originLocation" className="form-label">
                  Origin Location
                </label>

                <input
                  id="originLocation"
                  name="originLocation"
                  type="text"
                  className="form-control"
                  placeholder="Example: Mumbai"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="destinationLocation" className="form-label">
                  Destination Location
                </label>

                <input
                  id="destinationLocation"
                  name="destinationLocation"
                  type="text"
                  className="form-control"
                  placeholder="Example: Bengaluru"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="expectedPickupDate" className="form-label">
                  Expected Pickup Date
                </label>

                <input
                  id="expectedPickupDate"
                  name="expectedPickupDate"
                  type="date"
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="expectedDeliveryDate" className="form-label">
                  Expected Delivery Date
                </label>

                <input
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  type="date"
                  className="form-control"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/shipments')}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Create Shipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateShipmentPage;