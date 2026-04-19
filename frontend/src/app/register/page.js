"use client";
import { useState, useEffect } from 'react';
import { register, fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    organization: '',
    role: 'STUDENT'
  });
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchApi('/organizations/')
      .then(res => res.json())
      .then(data => setOrganizations(data.results || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { ok, data } = await register(formData);
      if (ok) {
        router.push('/');
      } else {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Ro\'yxatdan o\'tishda xatolik.');
      }
    } catch (err) {
      setError('Server bilan bog\'lanib bo\'lmadi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex-center">
      <div className="login-card glass-panel animate-fade">
        <div className="login-header">
          <h1 className="gradient-text">Ro'yxatdan O'tish</h1>
          <p className="subtitle">Bilimlar olamiga qo'shiling</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Foydalanuvchi nomi</label>
              <input name="username" type="text" placeholder="davronbek" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="example@mail.uz" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Parol</label>
            <input name="password" type="password" placeholder="********" onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefon</label>
              <input name="phone" type="text" placeholder="+998 90..." onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tashkilot (Maktab)</label>
              <select name="organization" onChange={handleChange} required className="custom-select">
                <option value="">Tanlang...</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Hisobingiz bormi? <Link href="/login" className="link">Kirish</Link></p>
        </div>
      </div>

      <style jsx>{`
        .login-container { min-height: 100vh; background: radial-gradient(circle at top right, rgba(var(--primary-rgb), 0.15), transparent); padding: 40px 20px; }
        .login-card { width: 100%; max-width: 500px; padding: 40px; border-radius: 24px; }
        .login-header { text-align: center; margin-bottom: 25px; }
        .login-form { display: flex; flex-direction: column; gap: 15px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 0.85rem; color: var(--text-muted); }
        input, .custom-select { 
          padding: 10px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 10px; color: white; outline: none; font-size: 0.95rem;
        }
        .custom-select { appearance: none; }
        .custom-select option { background: #1a1a2e; color: white; }
        .error-message { padding: 10px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 8px; font-size: 0.8rem; }
        .login-footer { margin-top: 20px; text-align: center; font-size: 0.9rem; }
        .link { color: var(--primary); font-weight: 600; text-decoration: none; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}
