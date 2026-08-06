function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

function formatCargoType(cargoType) {
  if (!cargoType) {
    return '-';
  }

  return cargoType
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export { formatCargoType, getApiErrorMessage };
