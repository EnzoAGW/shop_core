import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('sc_auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch {}
  }
  return config;
});

export default api;
