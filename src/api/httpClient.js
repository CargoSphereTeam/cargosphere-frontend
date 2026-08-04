import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig.js';
import {
  clearAuthSession,
  getAuthorizationHeader,
  getAuthSession,
} from '../utils/authStorage.js';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && getAuthSession()) {
      clearAuthSession();

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    if (
      status === 403 &&
      window.location.pathname !== '/403'
    ) {
      window.location.assign('/403');
    }

    return Promise.reject(error);
  },
);

export default httpClient;
