import httpClient from './httpClient.js';

const AUTH_API_PATH = '/api/auth';

async function login(credentials) {
  const response = await httpClient.post(
    `${AUTH_API_PATH}/login`,
    credentials,
  );

  return response.data;
}

export { login };
