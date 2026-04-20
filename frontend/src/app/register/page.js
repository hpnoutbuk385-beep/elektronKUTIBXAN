"use client";
import { useState, useEffect } from 'react';
import { register, fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      .then(data => {
          // If using DRF pagination, it's in data.results
          const results = data.results || data;
          setOrganizations(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
          console.error("Org fetch error", err);
          setError("Tashkilotlarni yuklab bo'lmadi.");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation: Passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwords_dont_match') || "Parollar mos kelmadi!");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Exclude confirmPassword from API request
      const { confirmPassword, ...submitData } = formData;
      const { ok, data } = await register(submitData);
      
      if (ok) {
        router.push('/');
      } else {
        // Handle backend errors
        let errorMsg = t('register_error') || 'Ro\'yxatdan o\'tishda xatolik.';
        if (data && typeof data === 'object') {
            const firstErrorField = Object.keys(data)[0];
            const firstError = data[firstErrorField];
            errorMsg = Array.isArray(firstError) ? `${firstErrorField}: ${firstError[0]}` : JSON.stringify(data);
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError(t('server_error') || 'Server bilan bog\'lanib bo\'lmadi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container flex-center">
      <div className="register-card glass-panel animate-fade">
        <div className="register-header">
            <div className="brand-logo">📚</div>
            <h1 className="gradient-text">{t('register_title')}</h1>
            <p className="subtitle">{t('register_subtitle')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-alert animate-shake">{error}</div>}
          
          <div className="form-row">
            <div className="input-group">
              <label>{t('username')}</label>
              <input 
                name="username" 
                type="text" 
                placeholder="davron88" 
                onChange={handleChange} 
                required 
                autoComplete="username"
              />
            </div>
            <div className="input-group">
              <label>{t('email')}</label>
              <input 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                onChange={handleChange} 
                required 
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>{t('password')}</label>
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
                autoComplete="new-password"
              />
            </div>
            <div className="input-group">
              <label>{t('confirm_password') || 'Parolni tasdiqlash'}</label>
              <input 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>{t('phone')}</label>
              <input 
                name="phone" 
                type="text" 
                placeholder="+998 90 123 45 67" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group">
              <label>{t('organization')}</label>
              <div className="select-wrapper">
                <select name="organization" onChange={handleChange} required className="modern-select">
                    <option value="">{t('select')}</option>
                    {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full mt-10" disabled={loading}>
            {loading ? t('registering') : t('register_btn')}
          </button>
        </form>
        
        <div className="register-footer">
          <p>{t('has_account')} <Link href="/login" className="link">{t('login_link')}</Link></p>
        </div>
      </div>

      <style jsx>{`
        .register-container { 
            min-height: 100vh; 
            background: radial-gradient(circle at 0% 0%, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            padding: 40px 20px; 
            overflow-y: auto;
        }
        .register-card { 
            width: 100%; 
            max-width: 600px; 
            padding: 40px; 
            border-radius: 30px; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .brand-logo { font-size: 40px; margin-bottom: 15px; }
        .register-header { text-align: center; margin-bottom: 30px; }
        .register-form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); padding-left: 5px; }
        
        input, .modern-select { 
            padding: 14px 18px; 
            background: rgba(255, 255, 255, 0.03); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            border-radius: 14px; 
            color: white; 
            outline: none; 
            font-size: 0.95rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        input:focus, .modern-select:focus { 
            background: rgba(255, 255, 255, 0.07); 
            border-color: var(--primary);
            box-shadow: 0 0 15px var(--primary-glow);
        }
        
        .select-wrapper { position: relative; width: 100%; }
        .modern-select { width: 100%; appearance: none; cursor: pointer; }
        .modern-select option { background: #16213e; color: white; }
        .select-arrow { 
            position: absolute; right: 15px; top: 50%; transform: translateY(-50%); 
            pointer-events: none; font-size: 10px; opacity: 0.5; color: white;
        }

        .error-alert { 
            padding: 12px 20px; 
            background: rgba(239, 68, 68, 0.15); 
            color: #ff8b8b; 
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px; 
            font-size: 0.85rem; 
            font-weight: 500;
        }

        .register-footer { margin-top: 30px; text-align: center; font-size: 0.95rem; }
        .link { color: var(--primary); font-weight: 700; text-decoration: none; transition: 0.3s; }
        .link:hover { color: var(--secondary); text-shadow: 0 0 10px var(--secondary-glow); }
        
        .w-full { width: 100%; }
        .mt-10 { margin-top: 10px; }

        @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr; gap: 20px; }
            .register-card { padding: 30px 20px; }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
