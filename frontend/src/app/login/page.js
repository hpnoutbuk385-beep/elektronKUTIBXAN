"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
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
      let res;
      // Smart Login: Agar foydalanuvchi ism-familiya kiritgan bo'lsa (probel bilan)
      const parts = username.trim().split(/\s+/);
      if (parts.length >= 2) {
        // Ism Familiya orqali kirish
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            first_name: parts[0], 
            last_name: parts.slice(1).join(" "),
            password 
          }),
        });
      } else {
        // Oddiy username orqali kirish
        res = await login(username, password);
      }

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
          <div className="auth-ornament">
            <span className="orn-l">━━ ✦ ━━</span>
          </div>
          <h1 className="gradient-text">Tizimga Kirish</h1>
          <p className="auth-subtitle">Sizni yana ko'rganimizdan xursandmiz!</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Login yoki Ism Familiya</label>
            <input 
              type="text" 
              placeholder="Username yoki Ism Familiya" 
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
            {loading ? "Tasdiqlanmoqda..." : "📖 Tasdiqlash"}
          </button>
        </form>

        <p className="auth-footer">
          Muammo yuzaga kelsa, maktab ma'muriyatiga murojaat qiling.
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 20px; background: #1a120b;
          background-image:
            radial-gradient(ellipse at 30% 30%, rgba(218, 165, 32, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(139, 69, 19, 0.08) 0%, transparent 50%);
        }
        .auth-card {
          width: 100%; max-width: 440px; padding: 50px 40px; border-radius: 28px;
          border: 1px solid rgba(218, 165, 32, 0.12) !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(218, 165, 32, 0.1);
        }
        .auth-header { text-align: center; margin-bottom: 35px; }
        .auth-logo { font-size: 3.5rem; margin-bottom: 10px; }
        .auth-ornament { color: rgba(218, 165, 32, 0.3); font-size: 0.75rem; margin-bottom: 12px; letter-spacing: 3px; }
        .auth-subtitle { color: rgba(196, 168, 130, 0.5); font-size: 0.95rem; font-family: 'Lora', serif; }
        .auth-form { display: flex; flex-direction: column; gap: 22px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: rgba(196, 168, 130, 0.6); font-size: 0.85rem; font-weight: 500; font-family: 'Lora', serif; }
        
        input { 
          background: rgba(193, 154, 107, 0.05); border: 1px solid rgba(218, 165, 32, 0.12); 
          color: #f5e6c8; padding: 14px 18px; border-radius: 14px; outline: none; transition: 0.3s;
          font-size: 1rem; font-family: 'Lora', serif;
        }
        input:focus {
          border-color: #DAA520; background: rgba(218, 165, 32, 0.06);
          box-shadow: 0 0 20px rgba(218, 165, 32, 0.15);
        }
        input::placeholder { color: rgba(196, 168, 130, 0.3); }

        .btn-auth { 
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #DAA520 100%);
          color: #f5e6c8; border: none; padding: 16px; border-radius: 14px;
          font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 10px;
          font-size: 1.05rem; font-family: 'Lora', serif;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
          letter-spacing: 0.03em;
        }
        .btn-auth:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 69, 19, 0.4); }
        .btn-auth:disabled { opacity: 0.5; }

        .error-alert {
          background: rgba(229, 115, 115, 0.08); color: #e57373; padding: 14px;
          border-radius: 12px; text-align: center; font-size: 0.9rem;
          border: 1px solid rgba(229, 115, 115, 0.15); margin-bottom: 15px;
          font-family: 'Lora', serif;
        }
        .auth-footer { text-align: center; margin-top: 30px; color: rgba(196, 168, 130, 0.4); font-size: 0.95rem; font-family: 'Lora', serif; }
        .auth-footer a { color: #DAA520; font-weight: 700; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
