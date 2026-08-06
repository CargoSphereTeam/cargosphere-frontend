function PaymentSummaryActions({
  onSaveDraft,
  onConfirm,
  loading = false,
  disabled = false,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body d-flex justify-content-end gap-2">

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onSaveDraft}
          disabled={loading || disabled}
        >
          Save Draft
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={loading || disabled}
        >
          Confirm & Continue
        </button>

      </div>
    </div>
  );
}

export default PaymentSummaryActions;