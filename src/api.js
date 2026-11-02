// URL base del backend.
// En desarrollo queda vacía y Vite redirige /api a http://localhost:3001 (ver vite.config.js).
// En producción se toma de VITE_API_URL (archivo .env.production).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'sadya_token';

export const api = (path) => `${API_URL}${path}`;

const readToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const clearSession = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* sin almacenamiento */ }
};

// fetch con la sesión: envía el token guardado y guarda el que devuelva
// el servidor al iniciar sesión o registrarse.
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = readToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(api(path), { ...options, headers });

  res.clone().json().then((body) => {
    const newToken = body?.data?.token;
    if (newToken) {
      try { localStorage.setItem(TOKEN_KEY, newToken); } catch { /* sin almacenamiento */ }
    }
  }).catch(() => {});

  return res;
}
