function PaymentSummaryActions({
  onSaveDraft,
  onApprove,
  loading = false,
  saveDisabled = false,
  approveDisabled = false,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <div className="alert alert-info py-2 mb-3">
          Approving publishes the final amount to the client. This stage stays
          pending until the client payment is verified.
        </div>
        <div className="d-flex justify-content-end gap-2">

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onSaveDraft}
          disabled={loading || saveDisabled}
        >
          Save Draft
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onApprove}
          disabled={loading || approveDisabled}
        >
          Approve Payment Details
        </button>

        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryActions;
