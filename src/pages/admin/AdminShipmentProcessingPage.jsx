import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  continueShipmentProcessing,
  downloadEbillPdf,
  generateEbill,
  getEbillPreview,
  getProcessingReadiness,
  startShipmentProcessing,
} from '../../api/adminShipmentApi.js';
import {
  formatProcessingStage,
} from '../../constants/processingStages.js';
import { getApiErrorDetails } from '../../utils/apiError.js';
import EbillPreviewPanel from './EbillPreviewPanel.jsx';

function ReadinessItem({ label, ready }) {
  return (
    <div className="d-flex justify-content-between align-items-center border rounded p-3">
      <span className="fw-semibold">{label}</span>

      <span
        className={`badge ${
          ready ? 'text-bg-success' : 'text-bg-warning'
        }`}
      >
        {ready ? 'Ready' : 'Pending'}
      </span>
    </div>
  );
}

function getCurrentRequirementReady(readiness) {
  const requirementByStage = {
    CONTAINER_ALLOCATION: readiness.containerReady,
    CARGO_VERIFICATION: readiness.cargoReady,
    DOCUMENT_VERIFICATION: readiness.documentsReady,
    PAYMENT_CONFIRMATION: readiness.paymentReady,
  };

  return requirementByStage[readiness.processingStage] ?? false;
}

function AdminShipmentProcessingPage() {
  const { shipmentId } = useParams();

  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ebillPreview, setEbillPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadReadiness() {
      setLoading(true);
      setError('');

      try {
        const response = await getProcessingReadiness(shipmentId);

        if (isActive) {
          setReadiness(response);
        }
      } catch (requestError) {
        if (isActive) {
          const apiError = getApiErrorDetails(
            requestError,
            'Unable to load shipment-processing readiness.',
          );

          setError(apiError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadReadiness();

    return () => {
      isActive = false;
    };
  }, [shipmentId]);

  async function refreshReadiness() {
    const response = await getProcessingReadiness(shipmentId);
    setReadiness(response);
  }

  async function runProcessingAction(action, message) {
    setActionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await action();
      setEbillPreview(null);
      await refreshReadiness();
      setSuccessMessage(message);
    } catch (requestError) {
      const apiError = getApiErrorDetails(
        requestError,
        'Unable to complete the processing action.',
      );

      setError(apiError.message);
    } finally {
      setActionLoading(false);
    }
  }

  function handleStartProcessing() {
    runProcessingAction(
      () => startShipmentProcessing(shipmentId),
      'Shipment processing started successfully.',
    );
  }

  function handleContinueProcessing() {
    runProcessingAction(
      () => continueShipmentProcessing(shipmentId),
      'Shipment advanced to the next processing stage.',
    );
  }

  async function handlePreviewEbill() {
    setPreviewLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await getEbillPreview(shipmentId);
      setEbillPreview(response);
      setSuccessMessage(
        'Live eBill preview loaded successfully.',
      );
    } catch (requestError) {
      const apiError = getApiErrorDetails(
        requestError,
        'Unable to load the eBill preview.',
      );

      setError(apiError.message);
    } finally {
      setPreviewLoading(false);
    }
  }

  function handleGenerateEbill() {
    runProcessingAction(
      () => generateEbill(shipmentId),
      'eBill generated successfully.',
    );
  }

  async function handleDownloadEbill() {
    setActionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { blob, fileName } =
        await downloadEbillPdf(shipmentId);

      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = objectUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(objectUrl);

      setSuccessMessage('eBill PDF downloaded successfully.');
    } catch (requestError) {
      const apiError = getApiErrorDetails(
        requestError,
        'Unable to download the eBill PDF.',
      );

      setError(apiError.message);
    } finally {
      setActionLoading(false);
    }
  }

  const processingStage = readiness?.processingStage;

  const canContinue =
    readiness &&
    [
      'CONTAINER_ALLOCATION',
      'CARGO_VERIFICATION',
      'DOCUMENT_VERIFICATION',
      'PAYMENT_CONFIRMATION',
    ].includes(processingStage);

  const currentRequirementReady =
    readiness && getCurrentRequirementReady(readiness);

  return (
    <main className="container py-4">
      <Link
        to="/admin/shipments"
        className="btn btn-link p-0 mb-3 text-decoration-none"
      >
        ← Back to shipments
      </Link>

      <div className="mb-4">
        <h1 className="h2 mb-1">Shipment Processing</h1>

        <p className="text-secondary mb-0">
          Review and advance shipment {shipmentId} through the
          administrator workflow.
        </p>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading processing readiness...
            </span>
          </div>
        </div>
      ) : null}

      {!loading && readiness ? (
        <>
          <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h2 className="h5 mb-1">
                      {readiness.shipmentNumber}
                    </h2>

                    <p className="text-secondary mb-0">
                      Current stage
                    </p>
                  </div>

                  <span className="badge text-bg-primary">
                    {formatProcessingStage(processingStage)}
                  </span>
                </div>

                <div className="d-grid gap-3">
                  <ReadinessItem
                    label="Container allocation"
                    ready={readiness.containerReady}
                  />

                  <ReadinessItem
                    label="Cargo verification"
                    ready={readiness.cargoReady}
                  />

                  <ReadinessItem
                    label="Document verification"
                    ready={readiness.documentsReady}
                  />

                  <ReadinessItem
                    label="Payment confirmation"
                    ready={readiness.paymentReady}
                  />

                  <ReadinessItem
                    label="eBill generation"
                    ready={readiness.ebillReady}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h2 className="h5">Processing actions</h2>

                <div className="d-grid gap-2 mt-3">
                  {processingStage ===
                  'PENDING_ADMIN_REVIEW' ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={actionLoading}
                      onClick={handleStartProcessing}
                    >
                      Start Processing
                    </button>
                  ) : null}

                  {canContinue ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        actionLoading ||
                        !currentRequirementReady
                      }
                      onClick={handleContinueProcessing}
                    >
                      Continue Processing
                    </button>
                  ) : null}

                  {processingStage === 'READY_FOR_EBILL' ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        disabled={
                          actionLoading || previewLoading
                        }
                        onClick={handlePreviewEbill}
                      >
                        {previewLoading
                          ? 'Loading Preview...'
                          : 'Preview eBill'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={
                          actionLoading ||
                          previewLoading ||
                          !readiness.ebillReady
                        }
                        onClick={handleGenerateEbill}
                      >
                        Generate eBill
                      </button>
                    </>
                  ) : null}

                  {processingStage === 'EBILL_GENERATED' ? (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      disabled={actionLoading}
                      onClick={handleDownloadEbill}
                    >
                      Download eBill PDF
                    </button>
                  ) : null}

                  {actionLoading ? (
                    <div className="text-center text-secondary mt-2">
                      Processing request...
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5">Blocking reasons</h2>

                {readiness.blockingReasons?.length ? (
                  <ul className="mb-0 ps-3">
                    {readiness.blockingReasons.map((reason) => (
                      <li key={reason} className="mb-2">
                        {reason}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-success mb-0">
                    No processing requirements are currently
                    blocked.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {ebillPreview ? (
          <EbillPreviewPanel
            preview={ebillPreview}
            onClose={() => setEbillPreview(null)}
          />
        ) : null}
        </>
      ) : null}
    </main>
  );
}

export default AdminShipmentProcessingPage;
