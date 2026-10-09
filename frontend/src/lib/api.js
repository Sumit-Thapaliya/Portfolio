import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const httpClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function sendContactMessage({ name, email, message }) {
  const response = await httpClient.post('/contact', { name, email, message });
  return response.data;
}

export default httpClient;