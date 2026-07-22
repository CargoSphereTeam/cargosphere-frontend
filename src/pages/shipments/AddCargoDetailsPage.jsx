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

function AddCargoDetailsPage() {
  const navigate = useNavigate();
  const { shipmentId } = useParams();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleBackToDetails = () => {
    navigate(`/shipments/${shipmentId}`);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

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

      navigate(`/shipments/${shipmentId}`);
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.message ??
        'Unable to add cargo details. Please check the information and try again.';

      setError(errorMessage);
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
          Add cargo information to the selected shipment.
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
                >
                  <option value="">
                    Select cargo type
                  </option>

                  <option value="GENERAL">General</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="FOOD">Food</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="MACHINERY">Machinery</option>
                  <option value="CHEMICAL">Chemical</option>
                  <option value="OTHER">Other</option>
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
                  className="form-control"
                  rows="3"
                  maxLength="255"
                  placeholder="Enter cargo description"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                />
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
                  placeholder="25.567"
                  value={formData.weightKg}
                  onChange={handleChange}
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
                  placeholder="1.257"
                  value={formData.volumeCbm}
                  onChange={handleChange}
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