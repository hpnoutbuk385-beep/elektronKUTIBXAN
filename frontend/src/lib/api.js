const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && token !== "undefined") {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // AGAR TOKEN XATO BO'LSA (401), FAQAT TOKENNI TOZALAYMIZ
  // LEKIN FOYDALANUVCHINI HECH QAYERGA REDIRECT QILMAYMIZ
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  return response;
};

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/library';
};
