import httpClient from './httpClient.js';

const CONTAINER_TYPE_API_PATH = '/api/container-types';
const CONTAINER_ALLOCATION_API_PATH =
  '/api/container-allocations';

async function getContainerTypes() {
  const response = await httpClient.get(
    CONTAINER_TYPE_API_PATH,
  );

  return response.data;
}

async function getAllocationsByShipmentId(shipmentId) {
  const response = await httpClient.get(
    `${CONTAINER_ALLOCATION_API_PATH}/shipment/${shipmentId}`,
  );

  return response.data;
}

async function createAllocation(allocationData) {
  const response = await httpClient.post(
    CONTAINER_ALLOCATION_API_PATH,
    allocationData,
  );

  return response.data;
}

export {
  getContainerTypes,
  getAllocationsByShipmentId,
  createAllocation,
};