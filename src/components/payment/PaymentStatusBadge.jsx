const STATUS_CLASSES = {
  PENDING: 'bg-warning text-dark',
  PARTIAL: 'bg-info',
  PAID: 'bg-success',
  FAILED: 'bg-danger',
};

function PaymentStatusBadge({ status }) {
  const badgeClass =
    STATUS_CLASSES[status] ?? 'bg-secondary';

  return (
    <span className={`badge ${badgeClass}`}>
      {status ?? 'UNKNOWN'}
    </span>
  );
}

export default PaymentStatusBadge;