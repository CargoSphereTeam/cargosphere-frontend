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

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split('T')[0];
}

function getBackendErrorMessage(requestError) {
  const responseData = requestError.response?.data;

  if (
    responseData?.validationErrors &&
    typeof responseData.validationErrors === 'object'
  ) {
    const messages = Object.values(
      responseData.validationErrors,
    ).filter(Boolean);

    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  if (
    responseData?.errors &&
    typeof responseData.errors === 'object'
  ) {
    const messages = Object.values(
      responseData.errors,
    ).filter(Boolean);

    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  const status = requestError.response?.status;

  if (status === 400) {
    return 'The shipment details are invalid. Please check the form.';
  }

  if (status === 401) {
    return 'Your session is missing or invalid. Please sign in again.';
  }

  if (status === 403) {
    return 'You are not allowed to create a shipment for this client.';
  }

  if (status >= 500) {
    return 'The shipment service is currently unavailable. Please try again later.';
  }

  return 'Unable to create the shipment. Please check the details and try again.';
}

function CreateShipmentPage({ clientUserId }) {
  const navigate = useNavigate();

  const hasAuthenticatedClientId = Number(clientUserId) > 0;

  const authenticatedClientUserId = hasAuthenticatedClientId
    ? String(clientUserId)
    : '';

  const [formData, setFormData] = useState(
    INITIAL_FORM_DATA,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = getTodayDate();

  const effectiveClientUserId = hasAuthenticatedClientId
    ? authenticatedClientUserId
    : formData.clientUserId;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !effectiveClientUserId ||
      Number(effectiveClientUserId) < 1
    ) {
      return 'Client user ID must be greater than zero.';
    }

    if (!formData.shipmentType) {
      return 'Shipment type is required.';
    }

    if (!formData.originLocation.trim()) {
      return 'Origin location is required.';
    }

    if (formData.originLocation.trim().length > 150) {
      return 'Origin location must not exceed 150 characters.';
    }

    if (!formData.destinationLocation.trim()) {
      return 'Destination location is required.';
    }

    if (formData.destinationLocation.trim().length > 150) {
      return 'Destination location must not exceed 150 characters.';
    }

    if (
      formData.expectedPickupDate &&
      formData.expectedPickupDate < today
    ) {
      return 'Expected pickup date cannot be in the past.';
    }

    if (
      formData.expectedDeliveryDate &&
      formData.expectedDeliveryDate < today
    ) {
      return 'Expected delivery date cannot be in the past.';
    }

    if (
      formData.expectedPickupDate &&
      formData.expectedDeliveryDate &&
      formData.expectedDeliveryDate <
        formData.expectedPickupDate
    ) {
      return 'Expected delivery date cannot be before the pickup date.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const shipmentData = {
      clientUserId: Number(effectiveClientUserId),
      originLocation: formData.originLocation.trim(),
      destinationLocation:
        formData.destinationLocation.trim(),
      shipmentType: formData.shipmentType,
      expectedPickupDate:
        formData.expectedPickupDate || null,
      expectedDeliveryDate:
        formData.expectedDeliveryDate || null,
    };

    try {
      setSubmitting(true);

      const createdShipment =
        await createShipment(shipmentData);

      setFormData(INITIAL_FORM_DATA);

      navigate(`../${createdShipment.id}`, { relative: 'path' });
    } catch (requestError) {
      setError(getBackendErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h2 mb-1">Create Shipment</h1>

        <p className="text-secondary">
          Enter the shipment route, transport type, and expected
          dates.
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
                <label
                  htmlFor="clientUserId"
                  className="form-label"
                >
                  Client User ID
                </label>

                {hasAuthenticatedClientId ? (
                  <>
                    <input
                      id="clientUserId"
                      name="clientUserId"
                      type="number"
                      className="form-control"
                      value={authenticatedClientUserId}
                      disabled
                    />

                    <div className="form-text">
                      This value comes from the authenticated
                      account.
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      id="clientUserId"
                      name="clientUserId"
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter client user ID"
                      value={formData.clientUserId}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />

                    <div className="form-text">
                      Temporary fallback until authentication is
                      integrated.
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="shipmentType"
                  className="form-label"
                >
                  Shipment Type
                </label>

                <select
                  id="shipmentType"
                  name="shipmentType"
                  className="form-select"
                  value={formData.shipmentType}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                >
                  <option value="" disabled>
                    Select shipment type
                  </option>

                  <option value="ROAD">Road</option>
                  <option value="RAIL">Rail</option>
                  <option value="SEA">Sea</option>
                  <option value="AIR">Air</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="originLocation"
                  className="form-label"
                >
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  min={
                    formData.expectedPickupDate || today
                  }
                  className="form-control"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('..', { relative: 'path' })}
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
