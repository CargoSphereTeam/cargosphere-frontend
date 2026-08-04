import { useState } from 'react';
import useDocuments from '../hooks/useDocuments.js';
import {
  formatDateTime,
  formatDocumentType,
} from '../utils/documentUtils.js';
import DocumentStatusBadge from './DocumentStatusBadge.jsx';

function DocumentVerificationStep({ shipmentId, onCompleted }) {
  const {
    documents,
    error,
    loading,
    updatingDocumentId,
    loadDocuments,
    updateVerification,
  } = useDocuments(shipmentId);
  const [remarksByDocument, setRemarksByDocument] = useState({});
  const [successMessage, setSuccessMessage] = useState('');


  async function handleVerification(document, verificationStatus) {
    if (updatingDocumentId !== null) {
      return;
    }

    const updatedDocument = await updateVerification(
      document.id,
      verificationStatus,
      remarksByDocument[document.id] ?? document.remarks ?? '',
    );

    if (updatedDocument) {
      setSuccessMessage(
        `${formatDocumentType(document.documentType)} marked as ${verificationStatus}.`,
      );
      onCompleted?.(updatedDocument);
    }
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">Document Verification</h2>
            <p className="text-secondary mb-0">
              Verify or reject the documents for shipment #{shipmentId}.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadDocuments}
            disabled={loading || updatingDocumentId !== null}
          >
            Refresh
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" aria-label="Loading" />
            <p className="mt-3 mb-0">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="alert alert-info mb-0">
            No document records are available for this shipment.
          </div>
        ) : (
          <div className="vstack gap-3">
            {documents.map((document) => {
              const isUpdating = updatingDocumentId === document.id;

              return (
                <article className="border rounded p-3" key={document.id}>
                  <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                    <div>
                      <h3 className="h6 mb-2">
                        {formatDocumentType(document.documentType)}
                      </h3>
                      <div className="d-flex flex-wrap gap-2">
                        <span
                          className={`badge ${
                            document.required
                              ? 'bg-danger-subtle text-danger-emphasis'
                              : 'bg-secondary-subtle text-secondary-emphasis'
                          }`}
                        >
                          {document.required ? 'Required' : 'Optional'}
                        </span>
                        <DocumentStatusBadge
                          status={document.verificationStatus}
                        />
                      </div>
                    </div>

                    <div className="small text-secondary text-md-end">
                      <div>Verified by: {document.verifiedBy ?? '-'}</div>
                      <div>Verified at: {formatDateTime(document.verifiedAt)}</div>
                    </div>
                  </div>

                  <label
                    className="form-label"
                    htmlFor={`document-remarks-${document.id}`}
                  >
                    Remarks
                  </label>
                  <textarea
                    id={`document-remarks-${document.id}`}
                    className="form-control"
                    rows="2"
                    maxLength="500"
                    value={
                      remarksByDocument[document.id] ?? document.remarks ?? ''
                    }
                    disabled={isUpdating}
                    onChange={(event) =>
                      setRemarksByDocument((currentRemarks) => ({
                        ...currentRemarks,
                        [document.id]: event.target.value,
                      }))
                    }
                  />
                  <div className="form-text">
                    Maximum 500 characters.
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={updatingDocumentId !== null}
                      onClick={() => handleVerification(document, 'VERIFIED')}
                    >
                      {isUpdating ? 'Saving...' : 'Verify'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={updatingDocumentId !== null}
                      onClick={() => handleVerification(document, 'REJECTED')}
                    >
                      {isUpdating ? 'Saving...' : 'Reject'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentVerificationStep;
