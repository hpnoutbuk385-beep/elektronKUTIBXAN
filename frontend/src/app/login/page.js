"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetchApi('/auth/login/', {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || t('login_failed'));
      }
    } catch (err) {
      setError(t('server_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-pixel-bg">
        <div className="particles">
            {[...Array(30)].map((_, i) => {
                const r1 = (i * 13) % 100;
                const r2 = (i * 29) % 100;
                const r3 = ((i * 7) % 40) / 100;
                const dur = 10 + ((i * 2) % 15);
                const del = (i * 3) % 15;
                return (
                    <div 
                        key={i} 
                        className="particle" 
                        style={{
                            left: `${r1}%`,
                            top: `${r2}%`,
                            opacity: r3,
                            animationDuration: `${dur}s`,
                            animationDelay: `-${del}s`
                        }}
                    />
                );
            })}
        </div>
        <div className="lamp-glow"></div>
      </div>
      <div className="auth-overlay"></div>
      
      {/* Background Animation Elements */}
      <div className="floating-elements">
        <div className="float-item">📚</div>
        <div className="float-item">📖</div>
        <div className="float-item">📜</div>
        <div className="float-item">📝</div>
        <div className="float-item">📓</div>
        <div className="float-item">📕</div>
      </div>

      <div className="auth-card glass-panel animate-slide-up">
        <div className="auth-header">
          <h1 className="gradient-text">{t('login')}</h1>
          <p className="auth-subtitle">Kutubxonaga ism-familiyangiz orqali kiring</p>
        </div>

        {error && <div className="error-message glass-card">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('first_name')}</label>
            <input
              type="text"
              placeholder="Ali"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('last_name')}</label>
            <input
              type="text"
              placeholder="Valiyev"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <div className="auth-footer">
          <span>Hisobingiz yo'qmi? </span>
          <Link href="/register" className="link-text">Ro'yxatdan o'tish</Link>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .auth-pixel-bg {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          background: url('/images/cinematic_bg.png') center/cover no-repeat;
          filter: brightness(0.7) saturate(1.2);
          animation: ken-burns 120s infinite alternate linear;
          z-index: 1;
        }

        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            filter: blur(1px);
            animation: float-particle 15s infinite linear;
        }



        .lamp-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 60% 40%, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
            animation: lamp-pulse 10s infinite alternate ease-in-out;
            z-index: 1;
        }

        .auth-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 0%, #000 90%);
            z-index: 2;
        }

        @keyframes float-particle {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(50px) rotate(360deg); opacity: 0; }
        }

        @keyframes lamp-pulse {
            from { opacity: 0.3; filter: blur(0px); }
            to { opacity: 0.8; filter: blur(2px); }
        }

        @keyframes ken-burns {
            0% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.05) translate(-1%, 1%); }
            100% { transform: scale(1.1) translate(1%, -1%); }
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 50px;
          position: relative;
          z-index: 10;
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .auth-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-top: 10px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: #eee;
          font-size: 0.85rem;
          font-weight: 500;
          margin-left: 4px;
        }

        input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 20px;
          border-radius: 14px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
          box-shadow: 0 0 20px var(--primary-glow);
          transform: translateY(-2px);
        }

        .auth-submit {
          margin-top: 15px;
          padding: 16px;
          font-size: 1rem;
          font-weight: 700;
        }

        .auth-footer {
          text-align: center;
          margin-top: 35px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .link-text {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
        }

        .link-text:hover {
          color: var(--secondary);
          text-underline-offset: 4px;
          text-decoration: underline;
        }

        .error-message {
          padding: 15px;
          margin-bottom: 25px;
          color: #ef4444;
          font-size: 0.9rem;
          text-align: center;
          border-color: #ef444444;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Background Animation Styles */
        .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }

        .float-item {
            position: absolute;
            font-size: 2.5rem;
            opacity: 0.08;
            filter: blur(1px);
            animation: float 15s infinite ease-in-out;
        }

        .float-item:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
        .float-item:nth-child(2) { top: 25%; right: 15%; animation-delay: -3s; }
        .float-item:nth-child(3) { bottom: 20%; left: 20%; animation-delay: -6s; }
        .float-item:nth-child(4) { bottom: 30%; right: 10%; animation-delay: -9s; }
        .float-item:nth-child(5) { top: 50%; left: 5%; animation-delay: -12s; }
        .float-item:nth-child(6) { top: 70%; right: 25%; animation-delay: -5s; }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -50px) rotate(10deg); }
            66% { transform: translate(-20px, 20px) rotate(-10deg); }
        }
      `}</style>
    </div>
  );
}
