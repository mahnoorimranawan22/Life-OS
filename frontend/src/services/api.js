import axios from 'axios';

// Shared Axios instance for all API calls.
// Override the base URL with VITE_API_URL when the API is hosted elsewhere.
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});