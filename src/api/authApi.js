import httpClient from './httpClient.js';

const AUTH_API_PATH = '/api/auth';

async function login(credentials) {
  const response = await httpClient.post(
    `${AUTH_API_PATH}/login`,
    credentials,
  );

  return response.data;
}

async function register(userDetails) {
  const response = await httpClient.post(
    `${AUTH_API_PATH}/register`,
    userDetails,
  );

  return response.data;
}

async function getProfile() {
  const response = await httpClient.get(`${AUTH_API_PATH}/profile`);
  return response.data;
}

async function updateProfile(profileData) {
  const response = await httpClient.patch(
    `${AUTH_API_PATH}/profile`,
    profileData,
  );
  return response.data;
}

export { getProfile, login, register, updateProfile };
