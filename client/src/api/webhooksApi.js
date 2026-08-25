import axios from 'axios';

const api = axios.create({
  baseURL: 'api/webhooks',
  headers: { 'Content-Type': 'application/json' },
});

export const getWebhooks = () => api.get('/').then((r) => r.data);
export const getWebhook = (id) => api.get(`/${id}`).then((r) => r.data);
export const createWebhook = (data) => api.post('/', data).then((r) => r.data);
export const updateWebhook = (id, data) => api.put(`/${id}`, data).then((r) => r.data);
export const deleteWebhook = (id) => api.delete(`/${id}`).then((r) => r.data);
export const fireWebhook = (id) => api.post(`/${id}/fire`).then((r) => r.data);
