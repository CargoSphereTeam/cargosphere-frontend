import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCargoDetails } from '../../api/shipmentApi.js';

const INITIAL_FORM_DATA = {
  cargoName: '',
  cargoDescription: '',
  cargoType: '',
  weightKg: '',
  volumeCbm: '',
  quantity: '',
  fragile: false,
  hazardous: false,
};

const CARGO_TYPES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'FRAGILE', label: 'Fragile' },
  { value: 'HAZARDOUS', label: 'Hazardous' },
  { value: 'PERISHABLE', label: 'Perishable' },
  { value: 'LIQUID', label: 'Liquid' },
  { value: 'HEAVY', label: 'Heavy' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'OTHER', label: 'Other' },
];

function getBackendErrorMessage(requestError) {
  const responseData = requestError.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.errors && typeof responseData.errors === 'object') {
    return Object.values(responseData.errors).join(' ');
  }

  const status = requestError.response?.status;

  if (status === 401) {
    return 'Your session is missing or invalid. Please sign in again.';
  }

  if (status === 403) {
    return 'You are not allowed to add cargo to this shipment.';
  }

  if (status === 404) {
    return 'The selected shipment could not be found.';
  }

  if (status >= 500) {
    return 'The server is currently unavailable. Please try again later.';
  }

  return 'Unable to add cargo details. Please check the values and try again.';
}

function hasMoreThanThreeDecimalPlaces(value) {
  if (!value) {
    return false;
  }

  const decimalPart = String(value).split('.')[1];
  return decimalPart?.length > 3;
}

function AddCargoDetailsPage() {
  const navigate = useNavigate();
  const { shipmentId } = useParams();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBackToDetails = () => {
    navigate(`/shipments/${shipmentId}`);
  };

  const validateForm = () => {
    const cargoName = formData.cargoName.trim();
    const cargoDescription = formData.cargoDescription.trim();

    if (!cargoName) {
      return 'Cargo name is required.';
    }

    if (cargoName.length > 100) {
      return 'Cargo name must not exceed 100 characters.';
    }

    if (cargoDescription.length > 255) {
      return 'Cargo description must not exceed 255 characters.';
    }

    if (!formData.weightKg || Number(formData.weightKg) < 0.001) {
      return 'Cargo weight must be at least 0.001 kg.';
    }

    if (hasMoreThanThreeDecimalPlaces(formData.weightKg)) {
      return 'Cargo weight can contain at most 3 decimal places.';
    }

    if (
      formData.volumeCbm &&
      Number(formData.volumeCbm) < 0.001
    ) {
      return 'Cargo volume must be at least 0.001 CBM.';
    }

    if (
      formData.volumeCbm &&
      hasMoreThanThreeDecimalPlaces(formData.volumeCbm)
    ) {
      return 'Cargo volume can contain at most 3 decimal places.';
    }

    if (
      formData.quantity &&
      (!Number.isInteger(Number(formData.quantity)) ||
        Number(formData.quantity) < 1)
    ) {
      return 'Cargo quantity must be a whole number of at least 1.';
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

    const cargoData = {
      cargoName: formData.cargoName.trim(),
      cargoDescription:
        formData.cargoDescription.trim() || null,
      cargoType: formData.cargoType || null,
      weightKg: Number(formData.weightKg),
      volumeCbm: formData.volumeCbm
        ? Number(formData.volumeCbm)
        : null,
      quantity: formData.quantity
        ? Number(formData.quantity)
        : null,
      fragile: formData.fragile,
      hazardous: formData.hazardous,
    };

    try {
      setSubmitting(true);

      await addCargoDetails(shipmentId, cargoData);

      setFormData(INITIAL_FORM_DATA);
      navigate(`/shipments/${shipmentId}`);
    } catch (requestError) {
      setError(getBackendErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-link p-0 mb-2 text-decoration-none"
          onClick={handleBackToDetails}
          disabled={submitting}
        >
          ← Back to Shipment Details
        </button>

        <h1 className="h2 mb-1">Add Cargo Details</h1>

        <p className="text-secondary">
          Add cargo information to shipment #{shipmentId}.
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
                <label htmlFor="cargoName" className="form-label">
                  Cargo Name
                </label>

                <input
                  id="cargoName"
                  name="cargoName"
                  type="text"
                  maxLength="100"
                  className="form-control"
                  placeholder="Example: Electronics Box"
                  value={formData.cargoName}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="cargoType" className="form-label">
                  Cargo Type
                </label>

                <select
                  id="cargoType"
                  name="cargoType"
                  className="form-select"
                  value={formData.cargoType}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">Not specified</option>

                  {CARGO_TYPES.map((cargoType) => (
                    <option
                      key={cargoType.value}
                      value={cargoType.value}
                    >
                      {cargoType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label
                  htmlFor="cargoDescription"
                  className="form-label"
                >
                  Cargo Description
                </label>

                <textarea
                  id="cargoDescription"
                  name="cargoDescription"
                  maxLength="255"
                  className="form-control"
                  rows="3"
                  placeholder="Enter an optional cargo description"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                  disabled={submitting}
                />

                <div className="form-text">
                  {formData.cargoDescription.length}/255 characters
                </div>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="weightKg" className="form-label">
                  Weight (kg)
                </label>

                <input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  min="0.001"
                  step="0.001"
                  className="form-control"
                  placeholder="25.500"
                  value={formData.weightKg}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="volumeCbm" className="form-label">
                  Volume (CBM)
                </label>

                <input
                  id="volumeCbm"
                  name="volumeCbm"
                  type="number"
                  min="0.001"
                  step="0.001"
                  className="form-control"
                  placeholder="1.200"
                  value={formData.volumeCbm}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="col-12">
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <div className="form-check">
                    <input
                      id="fragile"
                      name="fragile"
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.fragile}
                      onChange={handleChange}
                      disabled={submitting}
                    />

                    <label
                      htmlFor="fragile"
                      className="form-check-label"
                    >
                      Fragile cargo
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      id="hazardous"
                      name="hazardous"
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.hazardous}
                      onChange={handleChange}
                      disabled={submitting}
                    />

                    <label
                      htmlFor="hazardous"
                      className="form-check-label"
                    >
                      Hazardous cargo
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleBackToDetails}
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
                    Adding Cargo...
                  </>
                ) : (
                  'Add Cargo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default AddCargoDetailsPage;