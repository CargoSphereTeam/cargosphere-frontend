import ConfirmationStatusBadge from './ConfirmationStatusBadge.jsx';

function PaymentSummaryCard({
  summary,
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="mb-0">Loading payment summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="alert alert-danger mb-0">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="text-secondary mb-0">
            No payment summary available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-body">
        <h2 className="h5 mb-0">
          Payment Summary
        </h2>
      </div>

      <div className="card-body">
        <div className="row g-3">

          <div className="col-md-6">
            <strong>Estimated Amount</strong>
            <p>{summary.estimatedAmount}</p>
          </div>

          <div className="col-md-6">
            <strong>Base Amount</strong>
            <p>{summary.baseAmount}</p>
          </div>

          <div className="col-md-6">
            <strong>Charges</strong>
            <p>{summary.charges}</p>
          </div>

          <div className="col-md-6">
            <strong>Taxes</strong>
            <p>{summary.taxes}</p>
          </div>

          <div className="col-md-6">
            <strong>Discount</strong>
            <p>{summary.discount}</p>
          </div>

          <div className="col-md-6">
            <strong>Final Amount</strong>
            <p>{summary.finalAmount}</p>
          </div>

          <div className="col-md-6">
            <strong>Paid Amount</strong>
            <p>{summary.paidAmount}</p>
          </div>

          <div className="col-md-6">
            <strong>Balance Amount</strong>
            <p>{summary.balanceAmount}</p>
          </div>

          <div className="col-md-6">
            <strong>Currency</strong>
            <p>{summary.currency}</p>
          </div>

          <div className="col-md-6">
            <strong>Payment Method</strong>
            <p>{summary.paymentMethod}</p>
          </div>

          <div className="col-md-6">
            <strong>Confirmation Status</strong>
            <ConfirmationStatusBadge
              status={summary.confirmationStatus}
            />
          </div>

          <div className="col-md-6">
            <strong>Payment Confirmed</strong>
            <p>{summary.paymentConfirmed ? 'Yes' : 'No'}</p>
          </div>

          <div className="col-md-6">
            <strong>Confirmed By</strong>
            <p>{summary.confirmedBy ?? '-'}</p>
          </div>

          <div className="col-md-6">
            <strong>Confirmed At</strong>
            <p>{summary.confirmedAt ?? '-'}</p>
          </div>

          <div className="col-12">
            <strong>Remarks</strong>
            <p>{summary.remarks || '-'}</p>
          </div>

          <div className="col-12">
            <strong>Last Updated</strong>
            <p>{summary.updatedAt ?? '-'}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryCard;