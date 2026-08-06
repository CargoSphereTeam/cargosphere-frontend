import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createShipment } from '../../api/shipmentApi.js';
import useAuth from '../../context/useAuth.js';
import './createShipmentPage.css';

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

function CreateShipmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasAuthenticatedClientId =
    user.role === 'ROLE_CLIENT' && Number(user.id) > 0;

  const authenticatedClientUserId = hasAuthenticatedClientId
    ? String(user.id)
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

      toast.success('Shipment created successfully.');

      setFormData(INITIAL_FORM_DATA);

      navigate(`../${createdShipment.id}`, { relative: 'path' });
    } catch (requestError) {
      setError(getBackendErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="cargo-create-page">
      <div className="container cargo-create-container">
      <div className="cargo-create-heading">
        <div>
          <span className="cargo-page-label">NEW BOOKING</span>
          <h1>Create shipment</h1>

          <p>
            Define the route, transport mode, and delivery timeline.
          </p>
        </div>
        <div className="cargo-create-progress">
          <span className="active">01</span><i /><span>02</span><i /><span>03</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="cargo-create-layout">
        <aside className="cargo-create-aside">
          <span className="cargo-create-aside-label">SHIPMENT SETUP</span>
          <h2>Start with the route.</h2>
          <p>Your shipment number is generated automatically after this booking is saved.</p>
          <div className="cargo-create-steps">
            <div className="active"><span>1</span><div><strong>Shipment details</strong><small>Route, mode and dates</small></div></div>
            <div><span>2</span><div><strong>Cargo details</strong><small>Weight, volume and handling</small></div></div>
            <div><span>3</span><div><strong>Admin processing</strong><small>Verification and payment</small></div></div>
          </div>
        </aside>

      <div className="card cargo-create-card">
        <div className="card-body">
          <div className="cargo-form-section-heading">
            <span>BOOKING INFORMATION</span>
            <small>Fields marked required must be completed</small>
          </div>
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
                      className="form-control cargo-readonly-field"
                      value={authenticatedClientUserId}
                      disabled
                    />

                    <div className="form-text">
                      Automatically assigned from your signed-in account.
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
                      Enter the client account ID for this shipment.
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
                className="cargo-create-cancel"
                onClick={() => navigate('..', { relative: 'path' })}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cargo-create-submit"
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
      </div>
      </div>
    </main>
  );
}

export default CreateShipmentPage;
