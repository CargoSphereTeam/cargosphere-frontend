const DOCUMENT_VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'];

function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.validationErrors) {
    const validationMessage = Object.values(responseData.validationErrors)
      .filter(Boolean)
      .join(' ');

    if (validationMessage) {
      return validationMessage;
    }
  }

  return responseData?.message || fallbackMessage;
}

function formatDocumentType(documentType) {
  if (!documentType) {
    return '-';
  }

  return documentType
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export {
  DOCUMENT_VERIFICATION_STATUSES,
  formatDateTime,
  formatDocumentType,
  getApiErrorMessage,
};
