// URL base del backend.
// En desarrollo queda vacía y Vite redirige /api a http://localhost:3001 (ver vite.config.js).
// En producción se toma de VITE_API_URL (archivo .env.production).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const api = (path) => `${API_URL}${path}`;
