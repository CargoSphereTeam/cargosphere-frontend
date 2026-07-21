const STATUS_BADGE_CLASSES = {
  CREATED: 'text-bg-secondary',
  BOOKED: 'text-bg-primary',
  IN_TRANSIT: 'text-bg-warning',
  DELIVERED: 'text-bg-success',
  CANCELLED: 'text-bg-danger',
};

function ShipmentStatusBadge({ status }) {
  const badgeClass =
    STATUS_BADGE_CLASSES[status] ?? 'text-bg-secondary';

  const displayStatus = status
    ? status.replaceAll('_', ' ')
    : 'UNKNOWN';

  return (
    <span className={`badge rounded-pill ${badgeClass}`}>
      {displayStatus}
    </span>
  );
}

export default ShipmentStatusBadge;