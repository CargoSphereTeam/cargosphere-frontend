import { formatCargoType } from '../utils/cargoUtils.js';

function ReadOnlyField({ label, value }) {
  return (
    <div className="col-12 col-md-6">
      <div className="border rounded p-3 h-100 bg-body-tertiary">
        <div className="small text-secondary mb-1">{label}</div>
        <div className="fw-medium">{value ?? '-'}</div>
      </div>
    </div>
  );
}

function OriginalCargoDetails({ cargoDetails = [] }) {
  if (cargoDetails.length === 0) {
    return (
      <div className="alert alert-info mb-0">
        No client-submitted cargo details are available.
      </div>
    );
  }

  return (
    <div className="vstack gap-3">
      {cargoDetails.map((cargo, index) => (
        <article className="border rounded p-3" key={cargo.id ?? index}>
          <h3 className="h6 mb-3">Cargo item {index + 1}</h3>
          <div className="row g-3">
            <ReadOnlyField label="Cargo name" value={cargo.cargoName} />
            <ReadOnlyField
              label="Cargo type"
              value={formatCargoType(cargo.cargoType)}
            />
            <ReadOnlyField label="Weight (kg)" value={cargo.weightKg} />
            <ReadOnlyField label="Volume (CBM)" value={cargo.volumeCbm} />
            <ReadOnlyField label="Quantity" value={cargo.quantity} />
            <ReadOnlyField
              label="Fragile"
              value={cargo.fragile ? 'Yes' : 'No'}
            />
            <ReadOnlyField
              label="Hazardous"
              value={cargo.hazardous ? 'Yes' : 'No'}
            />
            <ReadOnlyField
              label="Description"
              value={cargo.cargoDescription}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

export default OriginalCargoDetails;
