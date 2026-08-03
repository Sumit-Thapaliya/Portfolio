import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function sendContactMessage({ name, email, message }) {
  const response = await httpClient.post('/contact', { name, email, message });
  return response.data;
}

export default httpClient;
