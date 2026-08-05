import { useCallback, useEffect, useState } from 'react';
import { getCargoDetailsByShipmentId } from '../api/cargoVerificationApi.js';
import { getApiErrorMessage } from '../utils/cargoUtils.js';

function useCargoVerification(shipmentId) {
  const [cargoDetails, setCargoDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCargoDetails = useCallback(async () => {
    if (!shipmentId) {
      setCargoDetails([]);
      setError('Shipment ID is required to load cargo details.');
      return [];
    }

    try {
      setLoading(true);
      setError('');

      const response = await getCargoDetailsByShipmentId(shipmentId);
      const nextCargoDetails = Array.isArray(response) ? response : [];
      setCargoDetails(nextCargoDetails);
      return nextCargoDetails;
    } catch (requestError) {
      setCargoDetails([]);
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to load original cargo details.',
        ),
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadCargoDetails();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadCargoDetails]);

  return {
    cargoDetails,
    error,
    loading,
    loadCargoDetails,
  };
}

export default useCargoVerification;
