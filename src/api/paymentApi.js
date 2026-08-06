import httpClient from './httpClient.js';

const PAYMENT_API_PATH = '/api/payments';

async function getShipmentPaymentSummary(shipmentId) {
  const response = await httpClient.get(
    `${PAYMENT_API_PATH}/shipments/${shipmentId}/payment-summary`,
  );

  return response.data;
}

async function saveShipmentPaymentSummary(
  shipmentId,
  paymentSummaryData,
) {
  const response = await httpClient.post(
    `${PAYMENT_API_PATH}/shipments/${shipmentId}/payment-summary`,
    paymentSummaryData,
  );

  return response.data;
}

export {
  getShipmentPaymentSummary,
  saveShipmentPaymentSummary,
};