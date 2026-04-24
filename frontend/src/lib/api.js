// Dinamik API manzili: Environment variable'dan oladi, bo'lmasa nisbiy yo'l ishlatadi
// Agarda domen localhost bo'lmasa va env bo'sh bo'lsa, aniq production manziliga ulanadi
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Mahalliy server uchun (localhost, 127.0.0.1 yoki LAN IP)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'http://localhost:8000/api';
    }
    return `${window.location.origin}/api`;
  }
  return 'https://elektronkutibxan-production.up.railway.app/api';
};

const PRODUCTION_API_URL = getBaseUrl();

export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const baseUrl = PRODUCTION_API_URL.replace('/api', '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && token !== "undefined") {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // To'g'ridan-to'g'ri ishlab turgan PRODUCTION manziliga murojaat qilamiz
  const baseUrl = PRODUCTION_API_URL.endsWith('/') ? PRODUCTION_API_URL.slice(0, -1) : PRODUCTION_API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  
  console.log(`Fetching from: ${url}`);

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Auth-siz qayta urinish
    const newHeaders = { ...headers };
    delete newHeaders['Authorization'];
    response = await fetch(url, { ...options, headers: newHeaders });
  }

  return response;
};

export const login = async (username, password) => {
  const baseUrl = PRODUCTION_API_URL.endsWith('/') ? PRODUCTION_API_URL.slice(0, -1) : PRODUCTION_API_URL;
  return await fetch(`${baseUrl}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/';
};
