import httpClient from './httpClient.js';

const PAYMENT_API_PATH = '/api/payments';

async function getShipmentPaymentSummary(shipmentId) {
  const response = await httpClient.get(
    `${PAYMENT_API_PATH}/shipments/${shipmentId}/payment-summary`,
    { validateStatus: (status) => status === 200 || status === 404 },
  );

  return response.status === 404 ? null : response.data;
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

async function createRazorpayOrder(shipmentId) {
  const response = await httpClient.post(
    `${PAYMENT_API_PATH}/razorpay/shipments/${shipmentId}/orders`,
  );
  return response.data;
}

async function getRazorpayPaymentStatus(shipmentId) {
  const response = await httpClient.get(
    `${PAYMENT_API_PATH}/razorpay/shipments/${shipmentId}/status`,
    { validateStatus: (status) => status === 200 || status === 404 },
  );
  return response.status === 404 ? null : response.data;
}

async function verifyRazorpayPayment(shipmentId, paymentData) {
  const response = await httpClient.post(
    `${PAYMENT_API_PATH}/razorpay/shipments/${shipmentId}/verify`,
    paymentData,
  );
  return response.data;
}

export {
  getShipmentPaymentSummary,
  saveShipmentPaymentSummary,
  createRazorpayOrder,
  getRazorpayPaymentStatus,
  verifyRazorpayPayment,
};
