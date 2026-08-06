import httpClient from "../../../api/httpClient.js";

const DOCUMENT_API_PATH = "/api/documents";

export async function getDocumentsByShipmentId(shipmentId) {
  const response = await httpClient.get(
    `${DOCUMENT_API_PATH}/shipment/${shipmentId}`
  );

  return response.data;
}

export async function updateDocumentVerification(
  documentId,
  verificationData
) {
  const response = await httpClient.put(
    `${DOCUMENT_API_PATH}/${documentId}/verification`,
    verificationData
  );

  return response.data;
}
