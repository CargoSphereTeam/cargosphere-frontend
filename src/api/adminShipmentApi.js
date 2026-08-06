import httpClient from './httpClient.js';

const ADMIN_SHIPMENT_API_PATH = '/api/admin/shipments';

async function getProcessingQueue({
  stage,
  page = 0,
  size = 20,
} = {}) {
  const response = await httpClient.get(
    `${ADMIN_SHIPMENT_API_PATH}/processing/queue`,
    {
      params: {
        ...(stage ? { stage } : {}),
        page,
        size,
      },
    },
  );

  return response.data;
}

async function startShipmentProcessing(shipmentId) {
  const response = await httpClient.post(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/processing/start`,
  );

  return response.data;
}

async function continueShipmentProcessing(shipmentId) {
  const response = await httpClient.post(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/processing/continue`,
  );

  return response.data;
}

async function getProcessingReadiness(shipmentId) {
  const response = await httpClient.get(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/processing/readiness`,
  );

  return response.data;
}

async function saveCargoVerification(shipmentId, verificationData) {
  const response = await httpClient.put(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/cargo-verification`,
    verificationData,
  );

  return response.data;
}

async function getEbillPreview(shipmentId) {
  const response = await httpClient.get(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/ebill-preview`,
  );

  return response.data;
}

async function generateEbill(shipmentId) {
  const response = await httpClient.post(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/ebill`,
  );

  return response.data;
}

function getPdfFileName(contentDisposition, shipmentId) {
  const fileNameMatch = contentDisposition?.match(
    /filename="?([^";]+)"?/i,
  );

  return fileNameMatch?.[1] || `shipment-${shipmentId}-ebill.pdf`;
}

async function downloadEbillPdf(shipmentId) {
  const response = await httpClient.get(
    `${ADMIN_SHIPMENT_API_PATH}/${shipmentId}/ebill/pdf`,
    { responseType: 'blob' },
  );

  return {
    blob: response.data,
    fileName: getPdfFileName(
      response.headers['content-disposition'],
      shipmentId,
    ),
  };
}

export {
  continueShipmentProcessing,
  downloadEbillPdf,
  generateEbill,
  getEbillPreview,
  getProcessingQueue,
  getProcessingReadiness,
  saveCargoVerification,
  startShipmentProcessing,
};
