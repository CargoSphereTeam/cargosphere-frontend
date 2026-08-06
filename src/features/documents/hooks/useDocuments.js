import { useCallback, useEffect, useState } from 'react';
import {
  createDocument,
  getDocumentsByShipmentId,
  updateDocumentVerification,
} from '../api/documentApi.js';
import { getApiErrorMessage } from '../utils/documentUtils.js';

function useDocuments(shipmentId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingDocumentId, setUpdatingDocumentId] = useState(null);
  const [creatingDocuments, setCreatingDocuments] = useState(false);

  const loadDocuments = useCallback(async () => {
    if (!shipmentId) {
      setDocuments([]);
      setError('Shipment ID is required to load documents.');
      return [];
    }

    try {
      setLoading(true);
      setError('');

      const response = await getDocumentsByShipmentId(shipmentId);
      const nextDocuments = Array.isArray(response) ? response : [];
      setDocuments(nextDocuments);
      return nextDocuments;
    } catch (requestError) {
      setDocuments([]);
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to load shipment documents.',
        ),
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadDocuments();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadDocuments]);

  const updateVerification = useCallback(
    async (documentId, verificationStatus, remarks) => {
      try {
        setUpdatingDocumentId(documentId);
        setError('');

        const updatedDocument = await updateDocumentVerification(documentId, {
          verificationStatus,
          remarks: remarks?.trim() || null,
        });

        setDocuments((currentDocuments) =>
          currentDocuments.map((document) =>
            document.id === documentId ? updatedDocument : document,
          ),
        );

        return updatedDocument;
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            'Unable to update document verification.',
          ),
        );
        return null;
      } finally {
        setUpdatingDocumentId(null);
      }
    },
    [],
  );

  const addRequiredDocuments = useCallback(
    async (documentTypes) => {
      try {
        setCreatingDocuments(true);
        setError('');

        await Promise.all(
          documentTypes.map((documentType) =>
            createDocument({
              shipmentId: Number(shipmentId),
              documentType,
              required: true,
              remarks: null,
            }),
          ),
        );

        return await loadDocuments();
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            'Unable to add shipment documents.',
          ),
        );
        return null;
      } finally {
        setCreatingDocuments(false);
      }
    },
    [loadDocuments, shipmentId],
  );

  return {
    documents,
    error,
    loading,
    updatingDocumentId,
    creatingDocuments,
    addRequiredDocuments,
    loadDocuments,
    updateVerification,
  };
}

export default useDocuments;
