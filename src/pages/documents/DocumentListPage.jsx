import { useState } from 'react';
import DocumentVerificationStep from '../../features/documents/components/DocumentVerificationStep.jsx';

function DocumentListPage() {
  const [shipmentIdInput, setShipmentIdInput] = useState('');
  const [activeShipmentId, setActiveShipmentId] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    const parsedShipmentId = Number(shipmentIdInput);
    setActiveShipmentId(
      Number.isInteger(parsedShipmentId) && parsedShipmentId > 0
        ? parsedShipmentId
        : null,
    );
  }

  return (
    <main className="container py-4">
      <form className="card shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="card-body p-4">
          <label className="form-label" htmlFor="document-shipment-id">
            Shipment ID
          </label>
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              id="document-shipment-id"
              type="number"
              min="1"
              className="form-control"
              value={shipmentIdInput}
              onChange={(event) => setShipmentIdInput(event.target.value)}
              placeholder="Enter shipment ID"
              required
            />
            <button type="submit" className="btn btn-primary">
              Load Documents
            </button>
          </div>
        </div>
      </form>

      {activeShipmentId ? (
        <DocumentVerificationStep shipmentId={activeShipmentId} />
      ) : (
        <div className="alert alert-info">
          Enter a valid shipment ID to open document verification.
        </div>
      )}
    </main>
  );
}

export default DocumentListPage;
