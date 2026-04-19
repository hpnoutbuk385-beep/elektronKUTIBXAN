"use client";
import { useState } from 'react';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { ok, data } = await login(username, password);
      if (ok) {
        router.push('/');
      } else {
        setError(data.detail || t('buy_error'));
      }
    } catch (err) {
      setError(t('buy_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex-center">
      <div className="login-card glass-panel animate-fade">
        <div className="login-header">
          <h1 className="gradient-text">{t('login_title')}</h1>
          <p className="subtitle">{t('login_subtitle')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>{t('username')}</label>
            <input 
              type="text" 
              placeholder={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>{t('password')}</label>
            <input 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? t('logging_in') : t('login_btn')}
          </button>
        </form>
        
        <div className="login-footer">
          <p>{t('no_account')} <Link href="/register" className="link">{t('register_link')}</Link></p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: radial-gradient(circle at top right, rgba(var(--primary-rgb), 0.15), transparent),
                      radial-gradient(circle at bottom left, rgba(var(--secondary-rgb), 0.1), transparent);
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 24px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .login-header h1 {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .subtitle {
          color: var(--text-muted);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-size: 0.9rem;
          font-weight: 500;
        }
        input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          outline: none;
          transition: 0.3s;
        }
        input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
        }
        .error-message {
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 8px;
          font-size: 0.85rem;
          text-align: center;
        }
        .login-footer {
          margin-top: 25px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}
