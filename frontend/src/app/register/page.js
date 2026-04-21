"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    organization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getOrgs() {
      try {
        const res = await fetchApi('/organizations/');
        const data = await res.json();
        setOrganizations(data.results || data);
      } catch (err) {
        console.error("Failed to load organizations", err);
      }
    }
    getOrgs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError(t('password_mismatch'));
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetchApi('/auth/register/', {
        method: "POST",
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          organization: formData.organization,
          role: "STUDENT"
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        const data = await res.json();
        setError(Object.values(data).flat().join(", ") || t('registration_failed'));
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
          <h1 className="gradient-text">{t('register')}</h1>
          <p className="auth-subtitle">Raqamli kutubxona dunyosiga xush kelibsiz!</p>
        </div>

        {error && <div className="error-message glass-card">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
              <div className="form-group">
                <label>{t('first_name')}</label>
                <input
                    type="text"
                    name="first_name"
                    placeholder="Ismingiz"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
              </div>
              <div className="form-group">
                <label>{t('last_name')}</label>
                <input
                    type="text"
                    name="last_name"
                    placeholder="Familyangiz"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
              </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('phone')}</label>
            <input
              type="text"
              name="phone"
              placeholder="+998 90 123 45 67"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('organization')}</label>
            <select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            >
              <option value="">{t('select_org')}</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
              <div className="form-group">
                <label>{t('password')}</label>
                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
              </div>
              <div className="form-group">
                <label>{t('confirm_password')}</label>
                <input
                    type="password"
                    name="confirm_password"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
              </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </button>
        </form>

        <div className="auth-footer">
          <span>Hisobingiz bormi? </span>
          <Link href="/login" className="link-text">Kirish</Link>
        </div>
      </div>
    </div>
  );
}
