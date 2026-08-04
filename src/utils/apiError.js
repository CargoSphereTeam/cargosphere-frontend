function getApiErrorDetails(
  error,
  fallbackMessage = 'Unable to complete the request.',
) {
  const responseData = error?.response?.data;
  const responseStatus = error?.response?.status ?? null;

  let message =
    responseData?.message ||
    responseData?.error ||
    error?.message ||
    fallbackMessage;

  if (!error?.response && error?.request) {
    message =
      'Unable to connect to CargoSphere. Check that the API Gateway is running.';
  }

  const validationErrors =
    responseData?.validationErrors &&
    typeof responseData.validationErrors === 'object'
      ? responseData.validationErrors
      : {};

  return {
    status: responseStatus,
    message,
    validationErrors,
  };
}

export { getApiErrorDetails };
