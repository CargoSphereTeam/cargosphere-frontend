import useCargoVerification from '../hooks/useCargoVerification.js';
import OriginalCargoDetails from './OriginalCargoDetails.jsx';

function CargoVerificationStep({ shipmentId }) {
  const {
    cargoDetails,
    error,
    loading,
    loadCargoDetails,
  } = useCargoVerification(shipmentId);

  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">Cargo Verification</h2>
            <p className="text-secondary mb-0">
              Original client cargo details for shipment #{shipmentId}.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadCargoDetails}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        <div className="alert alert-warning">
          The current shipment backend exposes cargo creation and read APIs only.
          It does not expose an admin-confirmed cargo DTO, save-draft endpoint, or
          confirm endpoint, so this component keeps the original values read-only
          and does not submit invented data.
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" aria-label="Loading" />
            <p className="mt-3 mb-0">Loading cargo details...</p>
          </div>
        ) : (
          <OriginalCargoDetails cargoDetails={cargoDetails} />
        )}
      </div>
    </section>
  );
}

export default CargoVerificationStep;
