"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LibraryPage from "./library/page"; // Kutubxonani to'g'ridan-to'g'ri chaqiramiz

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  // AGAR FOYDALANUVCHI KIRMAGAN BO'LSA, UNGA TO'G'RIDAN-TO'G'RI KUTUBXONANI KO'RSATAMIZ
  if (!user) {
    return (
      <div className="guest-view animate-fade">
        <div className="welcome-banner glass-panel">
          <h1 className="main-title">Raqamli Kutubxonaga <span className="gradient-text">Xush Kelibsiz!</span></h1>
          <p>Minglab kitoblar olami sizni kutmoqda. Ro'yxatdan o'tmasdan mutolaani boshlang.</p>
        </div>
        <LibraryPage />
        <style jsx>{`
          .guest-view { display: flex; flex-direction: column; gap: 30px; }
          .welcome-banner { padding: 40px; text-align: center; border-radius: 30px; margin-bottom: 10px; }
          .main-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; color: white; }
          .welcome-banner p { color: rgba(255,255,255,0.6); font-size: 1.1rem; }
          @media (max-width: 768px) { .main-title { font-size: 1.8rem; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-dashboard animate-fade">
      <div className="header-section">
        <h1 className="welcome-text">Salom, <span className="user-name">{user.first_name || user.username}!</span> 👋</h1>
        <p className="welcome-sub">Xush kelibsiz! Bugun qaysi kitobdan yangi bilimlar olamiz?</p>
      </div>
      
      <div className="stats-row">
        <div className="stat-card glass-panel">
          <div className="stat-icon-box blue">📖</div>
          <div className="stat-content">
            <p className="stat-title">O'qilgan kitoblar</p>
            <h2 className="stat-num">12</h2>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon-box orange">🌟</div>
          <div className="stat-content">
            <p className="stat-title">Bilim ballari</p>
            <h2 className="stat-num">{user.points || 0}</h2>
          </div>
        </div>
      </div>

      <div className="quick-access-library" style={{ marginTop: '40px' }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Kitoblarni ko'rish</h3>
        <LibraryPage />
      </div>

      <style jsx>{`
        .user-dashboard { display: flex; flex-direction: column; gap: 30px; }
        .welcome-text { font-size: 2.2rem; font-weight: 800; color: white; }
        .user-name { color: #818cf8; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
        .stat-icon-box { width: 55px; height: 55px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-icon-box.blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-icon-box.orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .stat-title { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .stat-num { font-size: 1.8rem; font-weight: 700; color: white; }
      `}</style>
    </div>
  );
}
