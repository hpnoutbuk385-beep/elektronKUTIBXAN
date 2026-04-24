const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    // Mahalliy server uchun (localhost, 127.0.0.1 yoki LAN IP)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'http://localhost:8000/api';
    }
    
    // Avtomatik ravishda hozirgi turgan manzilingizni API uchun ishlatamiz
    return `${origin}/api`;
  }
  return 'https://elektronkutibxan-production.up.railway.app/api';
};

export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const baseUrl = getBaseUrl().replace('/api', '');
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
  const currentBaseUrl = getBaseUrl();
  const baseUrl = currentBaseUrl.endsWith('/') ? currentBaseUrl.slice(0, -1) : currentBaseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  
  console.log(`Fetching from: ${url}`);

  let response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store', // Keshni o'chirish: har doim yangi ma'lumot olish uchun
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Auth xatoligi bo'lsa darhol tizimdan chiqarib, login sahifasiga yo'naltirish
    window.location.href = '/login';
    return response;
  }

  return response;
};

export const login = async (username, password) => {
  const currentBaseUrl = getBaseUrl();
  const baseUrl = currentBaseUrl.endsWith('/') ? currentBaseUrl.slice(0, -1) : currentBaseUrl;
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
