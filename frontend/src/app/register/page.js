"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elektronkutibxan-production.up.railway.app/api';

export default function Register() {
  const { t } = useLanguage();
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/organizations/`)
      .then((res) => res.json())
      .then((data) => setOrganizations(Array.isArray(data) ? data : data.results || []))
      .catch((err) => console.error("Org fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmadi");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(Object.values(data).flat().join(", "));
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Faqat toza fon, rasm va animatsiyalar olib tashlandi */}
      <div className="auth-card glass-panel">
        <h1 className="auth-title">Ro'yxatdan O'tish</h1>
        <p className="auth-subtitle">Raqamli kutubxona dunyosiga xush kelibsiz!</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Ism</label>
              <input type="text" name="first_name" placeholder="Ismingiz" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Familya</label>
              <input type="text" name="last_name" placeholder="Familyangiz" onChange={handleChange} required />
            </div>
            <div className="input-group full">
              <label>Email</label>
              <input type="email" name="email" placeholder="Email manzilingiz" onChange={handleChange} required />
            </div>
            <div className="input-group full">
              <label>Telefon</label>
              <input type="text" name="phone" placeholder="+998 90 123 45 67" onChange={handleChange} />
            </div>
            <div className="input-group full">
              <label>Tashkilot (Maktab)</label>
              <select name="organization" onChange={handleChange} required className="auth-select">
                <option value="">Tashkilotni tanlang...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Parol</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Parolni tasdiqlash</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan O'tish"}
          </button>
        </form>

        <p className="auth-footer">
          Profilingiz bormi? <Link href="/login">Kirish</Link>
        </p>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020617; /* Oddiy to'q fon */
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 650px;
          padding: 40px;
          z-index: 10;
        }

        .auth-title { font-size: 2.2rem; text-align: center; margin-bottom: 10px; font-weight: 800; color: white; }
        .auth-subtitle { text-align: center; color: rgba(255,255,255,0.5); margin-bottom: 30px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group.full { grid-column: span 2; }
        
        .input-group label { display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); }
        .input-group input, .auth-select {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: white; outline: none; transition: all 0.3s;
        }
        .input-group input:focus, .auth-select:focus { border-color: #818cf8; background: rgba(255,255,255,0.08); }

        .auth-btn { width: 100%; margin-top: 30px; padding: 14px; font-size: 1rem; }
        .error-box { background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 12px; border-radius: 10px; margin-bottom: 20px; text-align: center; font-size: 0.9rem; }
        
        .auth-footer { text-align: center; margin-top: 25px; color: rgba(255,255,255,0.4); }
        .auth-footer a { color: #818cf8; font-weight: 600; text-decoration: none; }

        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .input-group.full { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
