function DocumentReadinessPanel() {
  return (
    <section className="alert alert-warning mb-0" role="status">
      <h2 className="h6 alert-heading">Document readiness unavailable</h2>
      <p className="mb-0">
        The current backend does not expose a document-readiness endpoint or
        response DTO. Readiness is intentionally not calculated in the frontend.
      </p>
    </section>
  );
}

export default DocumentReadinessPanel;
