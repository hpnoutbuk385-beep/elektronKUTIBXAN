"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Mening Profilim 👤</h1>
        <p className="welcome-subtitle">Shaxsiy ma'lumotlaringiz va o'qish statistikangiz.</p>
      </div>

      <div className="profile-container">
        <div className="profile-main glass-panel">
          <div className="profile-header">
            <div className="profile-avatar">{user?.first_name?.[0] || user?.username?.[0] || "U"}</div>
            <div className="profile-info">
              <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
              <p className="profile-username">@{user?.username}</p>
              <span className="profile-role-badge">{user?.role}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <span>{user?.email || "Kiritilmagan"}</span>
            </div>
            <div className="detail-item">
              <label>Telefon</label>
              <span>{user?.phone || "+998 -- --- -- --"}</span>
            </div>
            <div className="detail-item">
              <label>Tashkilot</label>
              <span>{user?.organization_name || "Mavjud emas"}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats glass-panel">
          <h3 className="section-title">Statistika</h3>
          <div className="stats-list">
            <div className="stat-box">
              <span className="stat-val">{user?.points || 0}</span>
              <span className="stat-lab">Ballar</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">12</span>
              <span className="stat-lab">O'qilgan kitoblar</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">v2.0.0</span>
              <span className="stat-lab">Versiya</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .welcome-title { font-size: 2rem; color: white; }
        .profile-container { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }

        .profile-main { padding: 40px; }
        .profile-header { display: flex; align-items: center; gap: 30px; margin-bottom: 40px; }
        .profile-avatar { 
          width: 100px; height: 100px; background: linear-gradient(135deg, #818cf8, #a855f7);
          border-radius: 30px; display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: white; font-weight: 800; border: 4px solid rgba(255,255,255,0.1);
        }
        .profile-name { font-size: 1.8rem; color: white; margin-bottom: 5px; }
        .profile-username { color: rgba(255,255,255,0.4); margin-bottom: 15px; }
        .profile-role-badge { 
          background: rgba(129, 140, 248, 0.2); color: #818cf8; 
          padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;
        }

        .profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .detail-item label { display: block; color: rgba(255,255,255,0.3); font-size: 0.85rem; margin-bottom: 5px; }
        .detail-item span { color: white; font-weight: 600; font-size: 1rem; }

        .profile-stats { padding: 30px; }
        .section-title { color: white; margin-bottom: 25px; font-size: 1.1rem; }
        .stats-list { display: flex; flex-direction: column; gap: 20px; }
        .stat-box { 
          background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px;
          text-align: center; border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-val { display: block; font-size: 1.8rem; color: #818cf8; font-weight: 800; }
        .stat-lab { color: rgba(255,255,255,0.4); font-size: 0.85rem; }

        @media (max-width: 1000px) { .profile-container { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
