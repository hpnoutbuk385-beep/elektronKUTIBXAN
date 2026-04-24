"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function RegisterPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "", password: "", first_name: "", last_name: "", 
    email: "", phone: "", organization: "", role: "STUDENT", 
    school_class: "", subject: ""
  });
  const [organizations, setOrganizations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadInitialData() {
      try {
        const orgRes = await fetchApi('/organizations/');
        if (orgRes.ok) {
          const data = await orgRes.json();
          // Support both paginated object and direct array
          setOrganizations(data.results ? data.results : (Array.isArray(data) ? data : []));
        }
        
        // Load classes if organization is selected
        if (formData.organization) {
          const classRes = await fetchApi(`/classes/?organization=${formData.organization}`);
          if (classRes.ok) {
            const data = await classRes.json();
            setClasses(data.results ? data.results : (Array.isArray(data) ? data : []));
          }
        }
      } catch (err) { console.error("API Error", err); }
    }
    loadInitialData();
  }, [formData.organization]);

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
        setError(Object.values(data).flat().join(", ") || "Xatolik yuz berdi");
      }
    } catch (err) { setError("Server bilan aloqa yo'q"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container animate-fade">
      <div className="auth-card glass-panel animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo">📖</div>
          <div className="auth-ornament">
            <span>━━ ✦ ━━</span>
          </div>
          <h1 className="gradient-text">{t('register_title')}</h1>
          <p className="auth-subtitle">{t('register_subtitle')}</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="input-group">
              <label>{t('first_name')}</label>
              <input type="text" placeholder={t('first_name')} required onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>{t('last_name')}</label>
              <input type="text" placeholder={t('last_name')} required onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label>{t('username')}</label>
            <input type="text" placeholder={t('username')} required onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>{t('select_role')}</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="STUDENT">{t('student')}</option>
                <option value="TEACHER">{t('teacher')}</option>
              </select>
            </div>
            <div className="input-group">
              <label>{t('phone')}</label>
              <input type="text" placeholder="+998..." onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label>{t('organization')}</label>
            <select required onChange={(e) => setFormData({...formData, organization: e.target.value})}>
              <option value="">{t('select_org')}</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          {formData.role === 'STUDENT' && (
            <div className="input-group animate-slide-up">
              <label>{t('school_class')}</label>
              <select required onChange={(e) => setFormData({...formData, school_class: e.target.value})}>
                <option value="">{t('select')}</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name} ({cls.language_display})</option>
                ))}
              </select>
            </div>
          )}

          {formData.role === 'TEACHER' && (
            <div className="input-group animate-slide-up">
              <label>{t('subject')}</label>
              <input type="text" placeholder="Masalan: Matematika" required onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </div>
          )}

          <div className="input-group">
            <label>{t('password')}</label>
            <input type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? t('registering') : `📖 ${t('register_btn')}`}
          </button>
        </form>

        <p className="auth-footer">
          {t('has_account')} <Link href="/login">{t('login_link')}</Link>
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
          width: 100%; max-width: 500px; padding: 40px; border-radius: 28px;
          border: 1px solid rgba(218, 165, 32, 0.12) !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(218, 165, 32, 0.1);
        }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo { font-size: 3rem; margin-bottom: 8px; }
        .auth-ornament { color: rgba(218, 165, 32, 0.3); font-size: 0.75rem; margin-bottom: 10px; letter-spacing: 3px; }
        .auth-subtitle { color: rgba(196, 168, 130, 0.5); font-size: 0.9rem; font-family: 'Lora', serif; }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-group { display: flex; flex-direction: column; gap: 7px; }
        .input-group label { color: rgba(196, 168, 130, 0.6); font-size: 0.83rem; font-weight: 500; font-family: 'Lora', serif; }
        
        input, select { 
          background: rgba(193, 154, 107, 0.05); border: 1px solid rgba(218, 165, 32, 0.12); 
          color: #f5e6c8; padding: 12px 15px; border-radius: 12px; outline: none; transition: 0.3s;
          font-size: 0.95rem; font-family: 'Lora', serif;
        }
        input:focus, select:focus {
          border-color: #DAA520; background: rgba(218, 165, 32, 0.06);
          box-shadow: 0 0 15px rgba(218, 165, 32, 0.12);
        }
        input::placeholder { color: rgba(196, 168, 130, 0.3); }
        select option { background: #2a1f14; color: #f5e6c8; }

        .btn-auth { 
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #DAA520 100%);
          color: #f5e6c8; border: none; padding: 14px; border-radius: 14px;
          font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 8px;
          font-size: 1rem; font-family: 'Lora', serif;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
        }
        .btn-auth:hover { transform: scale(1.02); box-shadow: 0 10px 25px rgba(139, 69, 19, 0.4); }
        .btn-auth:disabled { opacity: 0.5; }

        .error-alert {
          background: rgba(229, 115, 115, 0.08); color: #e57373; padding: 12px;
          border-radius: 12px; text-align: center; font-size: 0.9rem;
          border: 1px solid rgba(229, 115, 115, 0.15); font-family: 'Lora', serif;
        }
        .auth-footer { text-align: center; margin-top: 25px; color: rgba(196, 168, 130, 0.4); font-size: 0.9rem; font-family: 'Lora', serif; }
        .auth-footer a { color: #DAA520; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
        
        @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr; } .auth-card { padding: 30px 20px; } }
      `}</style>
    </div>
  );
}
