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
    </div>
  );
}
