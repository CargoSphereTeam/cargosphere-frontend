import {
  formatDateTime,
  formatDocumentType,
} from '../utils/documentUtils.js';
import DocumentStatusBadge from './DocumentStatusBadge.jsx';

function ClientDocumentChecklist({ documents = [], loading = false, error = '' }) {
  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Document Checklist</h2>
        <p className="text-secondary mb-4">
          Read-only verification status for your shipment documents.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status" aria-label="Loading" />
          </div>
        ) : documents.length === 0 ? (
          <div className="alert alert-info mb-0">
            No document checklist is available.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Requirement</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{formatDocumentType(document.documentType)}</td>
                    <td>{document.required ? 'Required' : 'Optional'}</td>
                    <td>
                      <DocumentStatusBadge
                        status={document.verificationStatus}
                      />
                    </td>
                    <td>{document.remarks || '-'}</td>
                    <td>{formatDateTime(document.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientDocumentChecklist;
