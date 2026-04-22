"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "", password: "", first_name: "", last_name: "", 
    email: "", phone: "", organization: ""
  });
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadOrgs() {
      try {
        const res = await fetchApi('/organizations/');
        if (res.ok) setOrganizations(await res.json());
      } catch (err) { console.error(err); }
    }
    loadOrgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi('/auth/register/', {
        method: "POST",
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.detail || "Xatolik yuz berdi");
      }
    } catch (err) { setError("Server bilan aloqa yo'q"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container animate-fade">
      <div className="auth-card glass-panel animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo">📖</div>
          <h1 className="gradient-text">Ro'yxatdan O'tish</h1>
          <p className="auth-subtitle">Raqamli kutubxona dunyosiga xush kelibsiz!</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Ism</label>
              <input type="text" placeholder="Ismingiz" required onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Familiya</label>
              <input type="text" placeholder="Familiyangiz" required onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label>Login (Username)</label>
            <input type="text" placeholder="Username tanlang" required onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="example@mail.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Tashkilot (Maktab / Universitet)</label>
            <select required onChange={(e) => setFormData({...formData, organization: e.target.value})}>
              <option value="">Tashkilotni tanlang...</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Parol</label>
            <input type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="auth-footer">
          Profilingiz bormi? <Link href="/login">Kirish</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: #020617; }
        .auth-card { width: 100%; max-width: 500px; padding: 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .auth-logo { font-size: 3rem; margin-bottom: 10px; }
        .auth-subtitle { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; }
        
        input, select { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          color: white; padding: 12px 15px; border-radius: 12px; outline: none; transition: 0.3s;
          font-size: 0.95rem;
        }
        input:focus, select:focus { border-color: #818cf8; background: rgba(129, 140, 248, 0.05); box-shadow: 0 0 15px rgba(129, 140, 248, 0.2); }
        select option { background: #0f172a; color: white; }

        .btn-auth { 
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); color: white; 
          border: none; padding: 14px; border-radius: 15px; font-weight: 700; cursor: pointer; 
          transition: 0.3s; margin-top: 10px; font-size: 1rem;
        }
        .btn-auth:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4); }
        .btn-auth:disabled { opacity: 0.5; }

        .error-alert { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 12px; text-align: center; font-size: 0.9rem; border: 1px solid rgba(239, 68, 68, 0.2); }
        .auth-footer { text-align: center; margin-top: 25px; color: rgba(255,255,255,0.4); font-size: 0.9rem; }
        .auth-footer a { color: #818cf8; font-weight: 600; text-decoration: none; }
        
        @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr; } .auth-card { padding: 30px 20px; } }
      `}</style>
    </div>
  );
}
