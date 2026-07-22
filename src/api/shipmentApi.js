import httpClient from './httpClient.js';

const SHIPMENT_API_PATH = '/api/shipments';

async function getAllShipments() {
  const response = await httpClient.get(SHIPMENT_API_PATH);
  return response.data;
}

async function getShipmentById(shipmentId) {
  const response = await httpClient.get(
    `${SHIPMENT_API_PATH}/${shipmentId}`,
  );

  return response.data;
}

async function getShipmentByNumber(shipmentNumber) {
  const response = await httpClient.get(
    `${SHIPMENT_API_PATH}/number/${encodeURIComponent(shipmentNumber)}`,
  );

  return response.data;
}

async function getShipmentsByClientUserId(clientUserId) {
  const response = await httpClient.get(
    `${SHIPMENT_API_PATH}/client/${clientUserId}`,
  );

  return response.data;
}

async function createShipment(shipmentData) {
  const response = await httpClient.post(
    SHIPMENT_API_PATH,
    shipmentData,
  );

  return response.data;
}

async function addCargoDetails(shipmentId, cargoData) {
  const response = await httpClient.post(
    `${SHIPMENT_API_PATH}/${shipmentId}/cargo-details`,
    cargoData,
  );

  return response.data;
}

async function getCargoDetailsByShipmentId(shipmentId) {
  const response = await httpClient.get(
    `${SHIPMENT_API_PATH}/${shipmentId}/cargo-details`,
  );

  return response.data;
}

async function updateShipmentStatus(shipmentId, statusData) {
  const response = await httpClient.patch(
    `${SHIPMENT_API_PATH}/${shipmentId}/status`,
    statusData,
  );

  return response.data;
}

async function getShipmentEventsByShipmentId(shipmentId) {
  const response = await httpClient.get(
    `${SHIPMENT_API_PATH}/${shipmentId}/events`,
  );

  return response.data;
}

export {
  getAllShipments,
  getShipmentById,
  getShipmentByNumber,
  getShipmentsByClientUserId,
  createShipment,
  addCargoDetails,
  getCargoDetailsByShipmentId,
  updateShipmentStatus,
  getShipmentEventsByShipmentId,
};