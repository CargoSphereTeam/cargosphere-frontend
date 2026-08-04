import { useNavigate } from 'react-router-dom';

function AddCargoDetailsPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleBackToDetails = () => {
    navigate('..', { relative: 'path' });
  };

  return (
    <main className="container py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-link p-0 mb-2 text-decoration-none"
          onClick={handleBackToDetails}
        >
          ← Back to Shipment Details
        </button>

        <h1 className="h2 mb-1">Add Cargo Details</h1>

        <p className="text-secondary">
          Add cargo information to the selected shipment.
        </p>
      </div>

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
                  className="form-control"
                  placeholder="Example: Electronics Box"
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
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
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
                  placeholder="Enter cargo description"
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
                  className="form-control"
                  placeholder="1"
                  required
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
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Add Cargo
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default AddCargoDetailsPage;
