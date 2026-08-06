import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useDocuments from '../hooks/useDocuments.js';
import { formatDocumentType } from '../utils/documentUtils.js';
import DocumentStatusBadge from './DocumentStatusBadge.jsx';

const REQUIRED_DOCUMENT_TYPES = [
  'COMMERCIAL_INVOICE',
  'PACKING_LIST',
  'SHIPPING_INSTRUCTIONS',
  'INSURANCE_DOCUMENT',
  'CUSTOMS_DECLARATION',
];

function DocumentVerificationStep({ shipmentId, onCompleted }) {
  const {
    documents,
    error,
    loading,
    updatingDocumentId,
    creatingDocuments,
    addRequiredDocuments,
    loadDocuments,
    updateVerification,
  } = useDocuments(shipmentId);
  const [reviewedDocumentIds, setReviewedDocumentIds] = useState(() => new Set());
  const autoCreateAttemptedRef = useRef(false);

  const existingDocumentTypes = new Set(
    documents.map((document) => document.documentType),
  );
  const missingDocumentTypes = REQUIRED_DOCUMENT_TYPES.filter(
    (documentType) => !existingDocumentTypes.has(documentType),
  );
  const orderedDocuments = REQUIRED_DOCUMENT_TYPES.map((documentType) =>
    documents.find((document) => document.documentType === documentType),
  ).filter(Boolean);
  const resolvedStatuses = new Set(['VERIFIED', 'NOT_APPLICABLE']);
  const currentDocument = orderedDocuments.find(
    (document) =>
      !resolvedStatuses.has(document.verificationStatus) &&
      !reviewedDocumentIds.has(document.id),
  );
  const completedCount = orderedDocuments.filter(
    (document) =>
      resolvedStatuses.has(document.verificationStatus) ||
      reviewedDocumentIds.has(document.id),
  ).length;
  const rejectedDocuments = orderedDocuments.filter(
    (document) => document.verificationStatus === 'REJECTED',
  );

  useEffect(() => {
    if (
      loading ||
      creatingDocuments ||
      missingDocumentTypes.length === 0 ||
      autoCreateAttemptedRef.current
    ) return;

    autoCreateAttemptedRef.current = true;
    void addRequiredDocuments(missingDocumentTypes).then((updatedDocuments) => {
      if (updatedDocuments) onCompleted?.(updatedDocuments);
    });
  }, [
    addRequiredDocuments,
    creatingDocuments,
    loading,
    missingDocumentTypes,
    onCompleted,
  ]);


  async function handleVerification(document, verificationStatus) {
    if (updatingDocumentId !== null) {
      return;
    }

    const updatedDocument = await updateVerification(
      document.id,
      verificationStatus,
      null,
    );

    if (updatedDocument) {
      setReviewedDocumentIds((current) => {
        const next = new Set(current);
        next.add(document.id);
        return next;
      });
      toast.success(
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
        {loading || creatingDocuments ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" aria-label="Loading" />
            <p className="mt-3 mb-0">
              {creatingDocuments ? 'Preparing required documents...' : 'Loading documents...'}
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="alert alert-info mb-0">
            No document records are available for this shipment.
          </div>
        ) : currentDocument ? (
          <article className="border rounded p-4">
            <div className="small text-secondary mb-1">
              Document {completedCount + 1} of {REQUIRED_DOCUMENT_TYPES.length}
            </div>
            <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
              <h3 className="h5 mb-0">
                {formatDocumentType(currentDocument.documentType)}
              </h3>
              <DocumentStatusBadge status={currentDocument.verificationStatus} />
            </div>
            <p className="text-secondary">
              Review this document and approve it to open the next document.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-success"
                disabled={updatingDocumentId !== null}
                onClick={() => handleVerification(currentDocument, 'VERIFIED')}
              >
                {updatingDocumentId === currentDocument.id
                  ? 'Approving...'
                  : 'Approve Document'}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                disabled={updatingDocumentId !== null}
                onClick={() => handleVerification(currentDocument, 'REJECTED')}
              >
                Reject Document
              </button>
            </div>
          </article>
        ) : rejectedDocuments.length > 0 ? (
          <div className="alert alert-warning mb-0">
            <p className="mb-2">
              Review complete. {rejectedDocuments.length} document
              {rejectedDocuments.length === 1 ? '' : 's'} rejected.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setReviewedDocumentIds(new Set())}
            >
              Review Rejected Documents
            </button>
          </div>
        ) : (
          <div className="alert alert-success mb-0">
            All required documents have been approved.
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentVerificationStep;
