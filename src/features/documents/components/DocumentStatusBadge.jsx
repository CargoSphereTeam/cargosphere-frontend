function DocumentStatusBadge({ status = 'PENDING' }) {
  const badgeClasses = {
    PENDING: 'bg-warning text-dark',
    VERIFIED: 'bg-success',
    REJECTED: 'bg-danger',
  };

  return (
    <span className={`badge ${badgeClasses[status] || 'bg-secondary'}`}>
      {status}
    </span>
  );
}

export default DocumentStatusBadge;
