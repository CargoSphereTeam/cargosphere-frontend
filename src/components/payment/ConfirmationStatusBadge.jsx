const STATUS_CLASSES = {
  PENDING: 'bg-warning text-dark',
  DRAFT: 'bg-secondary',
  APPROVED: 'bg-info text-dark',
  CONFIRMED: 'bg-success',
  REJECTED: 'bg-danger',
};

function ConfirmationStatusBadge({ status }) {
  const badgeClass =
    STATUS_CLASSES[status] ?? 'bg-secondary';

  return (
    <span className={`badge ${badgeClass}`}>
      {status ?? 'UNKNOWN'}
    </span>
  );
}

export default ConfirmationStatusBadge;
