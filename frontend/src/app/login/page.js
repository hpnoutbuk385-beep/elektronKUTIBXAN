"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError("Login yoki parol xato!");
      }
    } catch (err) {
      setError("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade">
      <div className="auth-card glass-panel animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h1 className="gradient-text">Tizimga Kirish</h1>
          <p className="auth-subtitle">Sizni yana ko'rganimizdan xursandmiz!</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Login (Username)</label>
            <input 
              type="text" 
              placeholder="Username" 
              required 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Parol</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Kirish..." : "Tizimga kirish"}
          </button>
        </form>

        <p className="auth-footer">
          Hali ro'yxatdan o'tmaganmisiz? <Link href="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: #020617; }
        .auth-card { width: 100%; max-width: 420px; padding: 50px 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-logo { font-size: 3.5rem; margin-bottom: 15px; }
        .auth-subtitle { color: rgba(255,255,255,0.5); font-size: 0.95rem; }
        .auth-form { display: flex; flex-direction: column; gap: 25px; }
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        .input-group label { color: rgba(255,255,255,0.7); font-size: 0.9rem; font-weight: 500; }
        
        input { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          color: white; padding: 14px 18px; border-radius: 15px; outline: none; transition: 0.3s;
          font-size: 1rem;
        }
        input:focus { border-color: #818cf8; background: rgba(129, 140, 248, 0.05); box-shadow: 0 0 15px rgba(129, 140, 248, 0.2); }

        .btn-auth { 
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); color: white; 
          border: none; padding: 16px; border-radius: 15px; font-weight: 700; cursor: pointer; 
          transition: 0.3s; margin-top: 15px; font-size: 1.1rem;
        }
        .btn-auth:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }
        .btn-auth:disabled { opacity: 0.5; }

        .error-alert { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 15px; border-radius: 15px; text-align: center; font-size: 0.95rem; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 20px; }
        .auth-footer { text-align: center; margin-top: 35px; color: rgba(255,255,255,0.4); font-size: 0.95rem; }
        .auth-footer a { color: #818cf8; font-weight: 700; text-decoration: none; }
      `}</style>
    </div>
  );
}
