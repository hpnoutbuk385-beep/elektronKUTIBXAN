"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(formData.username, formData.password);
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.detail || "Login yoki parol xato");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Faqat toza fon */}
      <div className="auth-card glass-panel">
        <h1 className="auth-title">Xush Kelibsiz!</h1>
        <p className="auth-subtitle">Profilingizga kiring va o'qishda davom eting</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Foydalanuvchi nomi" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Parol</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Tizimga Kirish"}
          </button>
        </form>

        <p className="auth-footer">
          Profilingiz yo'qmi? <Link href="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020617;
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 40px;
          z-index: 10;
        }

        .auth-title { font-size: 2rem; text-align: center; margin-bottom: 10px; font-weight: 800; color: white; }
        .auth-subtitle { text-align: center; color: rgba(255,255,255,0.5); margin-bottom: 30px; font-size: 0.9rem; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group label { display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); }
        .input-group input {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: white; outline: none; transition: all 0.3s;
        }
        .input-group input:focus { border-color: #818cf8; background: rgba(255,255,255,0.08); }

        .auth-btn { margin-top: 10px; padding: 14px; font-size: 1rem; }
        .error-box { background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 12px; border-radius: 10px; margin-bottom: 20px; text-align: center; font-size: 0.9rem; }
        
        .auth-footer { text-align: center; margin-top: 25px; color: rgba(255,255,255,0.4); font-size: 0.9rem; }
        .auth-footer a { color: #818cf8; font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}
