// Dinamik API manzili: Environment variable'dan oladi, bo'lmasa nisbiy yo'l ishlatadi
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const PRODUCTION_API_URL = API_URL;

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
  // Agar API_URL bo'sh bo'lsa, /api/{endpoint} nisbiy yo'li ishlatiladi
  const baseUrl = PRODUCTION_API_URL || '/api';
  const url = `${baseUrl}${endpoint}`;
  
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
  const baseUrl = PRODUCTION_API_URL || '/api';
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
