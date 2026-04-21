"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchApi('/auth/profile/');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="profile-page animate-fade">
      <div className="profile-header glass-panel">
          <div className="profile-main">
              <div className="profile-avatar-large">
                  {user?.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div className="profile-info">
                  <h1 className="gradient-text">{user?.username}</h1>
                  <p className="role-tag">{user?.role}</p>
                  <p className="org-name">🏫 {user?.organization_name || t('unknown_school')}</p>
              </div>
          </div>
          <div className="profile-stats">
              <div className="p-stat">
                  <span className="p-stat-val">{user?.points || 0}</span>
                  <span className="p-stat-label">🌟 {t('stat_points')}</span>
              </div>
          </div>
      </div>

      <div className="profile-content-grid mt-30">
          <div className="qr-section glass-panel">
              <h3 className="section-title">👤 {t('personal_qr')}</h3>
              <p className="text-muted mb-20">{t('qr_hint')}</p>
              <div className="qr-image-wrapper">
                  {user?.qr_code_image ? (
                      <img src={`http://localhost:8000${user.qr_code_image}`} alt="My QR Code" className="qr-img" />
                  ) : (
                      <div className="qr-placeholder flex-center">🔳</div>
                  )}
              </div>
              <div className="qr-code-string mt-10">{user?.qr_code}</div>
          </div>

          <div className="details-section glass-panel">
              <h3 className="section-title">⚙️ {t('account_details')}</h3>
              <div className="details-list">
                  <div className="detail-item">
                      <span>Email:</span>
                      <span>{user?.email || t('not_provided')}</span>
                  </div>
                  <div className="detail-item">
                      <span>{t('phone')}:</span>
                      <span>{user?.phone || t('not_provided')}</span>
                  </div>
                  <div className="detail-item">
                      <span>ID:</span>
                      <span>#{user?.id}</span>
                  </div>
              </div>
              <button className="btn-secondary w-full mt-30" onClick={() => alert(t('edit_profile') + ' funksiyasi yaqin kunlarda qo\'shiladi.')}>
                  {t('edit_profile')}
              </button>
          </div>
      </div>

      <style jsx>{`
        .profile-page { padding: 10px; }
        .profile-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; border-radius: 24px; }
        .profile-main { display: flex; align-items: center; gap: 30px; }
        .profile-avatar-large { 
            width: 100px; height: 100px; border-radius: 50%; 
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex; align-items: center; justify-content: center;
            font-size: 3rem; font-weight: 800; color: white;
            box-shadow: 0 10px 30px var(--primary-glow);
        }
        .role-tag { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); font-weight: 700; margin: 5px 0; }
        .org-name { color: var(--text-muted); font-size: 0.95rem; }
        .p-stat { text-align: right; }
        .p-stat-val { display: block; font-size: 2.5rem; font-weight: 800; color: var(--accent); }
        .p-stat-label { color: var(--text-muted); font-size: 0.9rem; }
        
        .profile-content-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
        .section-title { margin-bottom: 15px; }
        .qr-section { padding: 30px; text-align: center; }
        .qr-image-wrapper { 
            background: white; padding: 20px; border-radius: 20px; 
            width: 240px; height: 240px; margin: 0 auto;
            display: flex; align-items: center; justify-content: center;
        }
        .qr-img { width: 100%; height: 100%; object-fit: contain; }
        .qr-placeholder { font-size: 100px; color: #eee; }
        .qr-code-string { font-family: monospace; font-size: 0.8rem; color: var(--text-muted); }
        
        .details-section { padding: 30px; }
        .details-list { display: flex; flex-direction: column; gap: 20px; margin-top: 25px; }
        .detail-item { display: flex; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
        .detail-item span:first-child { color: var(--text-muted); }
        
        .mt-30 { margin-top: 30px; }
        .mb-20 { margin-bottom: 20px; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}
