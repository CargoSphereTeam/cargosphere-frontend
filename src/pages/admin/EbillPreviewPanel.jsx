function formatLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase())
    .replace(/\bEbill\b/i, 'eBill')
    .replace(/\bId\b/g, 'ID');
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  const looksLikeDate =
    typeof value === 'string' &&
    /(At|Date|Time)$/.test(key);

  if (looksLikeDate) {
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString();
    }
  }

  return String(value);
}

function DetailGrid({ data }) {
  const entries = Object.entries(data ?? {}).filter(
    ([, value]) =>
      !Array.isArray(value) &&
      (value === null || typeof value !== 'object'),
  );

  if (!entries.length) {
    return (
      <p className="text-secondary mb-0">
        No information available.
      </p>
    );
  }

  return (
    <div className="row g-3">
      {entries.map(([key, value]) => (
        <div className="col-md-6 col-xl-4" key={key}>
          <div className="border rounded p-3 h-100">
            <div className="small text-secondary mb-1">
              {formatLabel(key)}
            </div>

            <div className="fw-semibold text-break">
              {formatValue(key, value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionSection({
  title,
  items,
  emptyMessage,
}) {
  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h5 mb-0">{title}</h3>

          <span className="badge text-bg-secondary">
            {items?.length ?? 0}
          </span>
        </div>

        {items?.length ? (
          <div className="d-grid gap-3">
            {items.map((item, index) => (
              <div
                className="border rounded p-3 bg-body-tertiary"
                key={
                  item.documentId ??
                  item.paymentId ??
                  item.eventId ??
                  item.cargoDetailId ??
                  item.verificationId ??
                  item.allocationId ??
                  index
                }
              >
                <DetailGrid data={item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary mb-0">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}

function ReadinessSummary({ readiness }) {
  const readinessItems = [
    ['Container allocation', readiness?.containerReady],
    ['Cargo verification', readiness?.cargoReady],
    ['Document verification', readiness?.documentsReady],
    ['Payment confirmation', readiness?.paymentReady],
    ['eBill generation', readiness?.ebillReady],
  ];

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h3 className="h5 mb-3">Generation readiness</h3>

        <div className="row g-3">
          {readinessItems.map(([label, ready]) => (
            <div className="col-md-6 col-xl" key={label}>
              <div className="border rounded p-3 h-100">
                <div className="small text-secondary mb-2">
                  {label}
                </div>

                <span
                  className={`badge ${
                    ready
                      ? 'text-bg-success'
                      : 'text-bg-warning'
                  }`}
                >
                  {ready ? 'Ready' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {readiness?.blockingReasons?.length ? (
          <div className="alert alert-warning mt-3 mb-0">
            <div className="fw-semibold mb-2">
              Blocking reasons
            </div>

            <ul className="mb-0 ps-3">
              {readiness.blockingReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EbillPreviewPanel({ preview, onClose }) {
  const shipmentNumber =
    preview?.shipment?.shipmentNumber ?? 'Shipment';

  return (
    <section className="mt-4">
      <div className="card shadow-sm border-primary">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
            <div>
              <div className="text-primary fw-semibold mb-1">
                Live eBill Preview
              </div>

              <h2 className="h4 mb-1">{shipmentNumber}</h2>

              <p className="text-secondary mb-0">
                Review the live shipment information before
                generating the immutable eBill.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary align-self-start"
              onClick={onClose}
            >
              Close Preview
            </button>
          </div>

          <div className="d-grid gap-4">
            <section>
              <h3 className="h5 mb-3">
                Shipment information
              </h3>

              <DetailGrid data={preview?.shipment} />
            </section>

            <hr className="my-0" />

            <section>
              <h3 className="h5 mb-3">
                Client information
              </h3>

              <DetailGrid data={preview?.client} />
            </section>
          </div>
        </div>
      </div>

      <div className="d-grid gap-4 mt-4">
        <ReadinessSummary readiness={preview?.readiness} />

        <CollectionSection
          title="Original cargo"
          items={preview?.originalCargo}
          emptyMessage="No original cargo details are available."
        />

        <CollectionSection
          title="Confirmed cargo"
          items={preview?.confirmedCargo}
          emptyMessage="No confirmed cargo details are available."
        />

        <CollectionSection
          title="Container allocations"
          items={preview?.containerAllocations}
          emptyMessage="No containers have been allocated."
        />

        <CollectionSection
          title="Documents"
          items={preview?.documents}
          emptyMessage="No shipment documents are available."
        />

        <CollectionSection
          title="Payments"
          items={preview?.payments}
          emptyMessage="No shipment payments are available."
        />

        <CollectionSection
          title="Shipment events"
          items={preview?.shipmentEvents}
          emptyMessage="No shipment events are available."
        />
      </div>
    </section>
  );
}

export default EbillPreviewPanel;
