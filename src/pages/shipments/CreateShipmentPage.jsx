import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShipment } from '../../api/shipmentApi.js';

const INITIAL_FORM_DATA = {
  clientUserId: '',
  shipmentType: '',
  originLocation: '',
  destinationLocation: '',
  expectedPickupDate: '',
  expectedDeliveryDate: '',
};

function CreateShipmentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (
      formData.expectedPickupDate &&
      formData.expectedDeliveryDate &&
      formData.expectedDeliveryDate < formData.expectedPickupDate
    ) {
      setError(
        'Expected delivery date cannot be before the pickup date.',
      );
      return;
    }

    const shipmentData = {
      clientUserId: Number(formData.clientUserId),
      originLocation: formData.originLocation.trim(),
      destinationLocation: formData.destinationLocation.trim(),
      shipmentType: formData.shipmentType,
      expectedPickupDate: formData.expectedPickupDate || null,
      expectedDeliveryDate: formData.expectedDeliveryDate || null,
    };

    try {
      setSubmitting(true);

      const createdShipment = await createShipment(shipmentData);

      navigate(`/shipments/${createdShipment.id}`);
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.message ??
        'Unable to create the shipment. Please check the details and try again.';

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h2 mb-1">Create Shipment</h1>

        <p className="text-secondary">
          Enter the shipment route, transport type, and expected dates.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
                  value={formData.clientUserId}
                  onChange={handleChange}
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
                  value={formData.shipmentType}
                  onChange={handleChange}
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
                  maxLength="150"
                  className="form-control"
                  placeholder="Example: Mumbai"
                  value={formData.originLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="destinationLocation"
                  className="form-label"
                >
                  Destination Location
                </label>

                <input
                  id="destinationLocation"
                  name="destinationLocation"
                  type="text"
                  maxLength="150"
                  className="form-control"
                  placeholder="Example: Bengaluru"
                  value={formData.destinationLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="expectedPickupDate"
                  className="form-label"
                >
                  Expected Pickup Date
                </label>

                <input
                  id="expectedPickupDate"
                  name="expectedPickupDate"
                  type="date"
                  min={today}
                  className="form-control"
                  value={formData.expectedPickupDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="expectedDeliveryDate"
                  className="form-label"
                >
                  Expected Delivery Date
                </label>

                <input
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  type="date"
                  min={formData.expectedPickupDate || today}
                  className="form-control"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/shipments')}
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
                    Creating...
                  </>
                ) : (
                  'Create Shipment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateShipmentPage;