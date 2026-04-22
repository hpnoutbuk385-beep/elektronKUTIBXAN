"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ read_books: 0, points: 0, rank: "-" });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  return (
    <div className="dashboard-container animate-fade">
      {!user ? (
        /* MEHMONLAR UCHUN LANDING QISMI */
        <div className="guest-welcome glass-panel">
          <div className="welcome-content">
            <h1 className="main-title">Raqamli Kutubxonaga <br/><span className="gradient-text">Xush Kelibsiz!</span></h1>
            <p className="main-sub">
              Minglab sara kitoblar, darsliklar va badiiy asarlar endi siz uchun bitta platformada. 
              Ro'yxatdan o'tmasdan ham kitoblarni ko'rishingiz va tanishishingiz mumkin.
            </p>
            <div className="welcome-actions">
              <button className="btn-primary-large" onClick={() => router.push('/library')}>
                📚 Kutubxonani ko'rish
              </button>
              <button className="btn-outline-large" onClick={() => router.push('/register')}>
                👤 Ro'yxatdan o'tish
              </button>
            </div>
          </div>
          <div className="welcome-stats">
            <div className="mini-stat"><span>10,000+</span> <p>Kitoblar</p></div>
            <div className="mini-stat"><span>5,000+</span> <p>O'quvchilar</p></div>
            <div className="mini-stat"><span>100%</span> <p>Bepul</p></div>
          </div>
        </div>
      ) : (
        /* RO'YXATDAN O'TGANLAR UCHUN DASHBOARD */
        <div className="user-dashboard">
          <div className="header-section">
            <h1 className="welcome-text">Salom, <span className="user-name">{user.first_name || user.username}!</span> 👋</h1>
            <p className="welcome-sub">Bugun qanday yangi bilimlar olamiz?</p>
          </div>

          <div className="stats-row">
            <div className="stat-card glass-panel">
              <div className="stat-icon-box blue">📖</div>
              <div className="stat-content">
                <p className="stat-title">O'qilgan kitoblar</p>
                <h2 className="stat-num">{stats.read_books}</h2>
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
        </div>
      )}

      <style jsx>{`
        .dashboard-container { min-height: 80vh; display: flex; flex-direction: column; gap: 30px; }
        
        /* GUEST STYLE */
        .guest-welcome { 
          padding: 80px 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 40px;
          background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          border-radius: 40px; border: 1px solid rgba(255,255,255,0.1);
        }
        .main-title { font-size: 3.5rem; font-weight: 900; line-height: 1.2; color: white; }
        .main-sub { font-size: 1.2rem; color: rgba(255,255,255,0.6); max-width: 700px; line-height: 1.6; }
        .welcome-actions { display: flex; gap: 20px; }
        .btn-primary-large { background: #818cf8; color: white; border: none; padding: 18px 40px; border-radius: 15px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-outline-large { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 18px 40px; border-radius: 15px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .welcome-stats { display: flex; gap: 60px; margin-top: 20px; }
        .mini-stat span { font-size: 2rem; font-weight: 800; color: #818cf8; }
        .mini-stat p { color: rgba(255,255,255,0.4); font-size: 0.9rem; }

        /* USER STYLE */
        .user-dashboard { display: flex; flex-direction: column; gap: 30px; }
        .welcome-text { font-size: 2.2rem; font-weight: 800; color: white; }
        .user-name { color: #818cf8; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
        .stat-icon-box { width: 55px; height: 55px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-icon-box.blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-icon-box.orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

        @media (max-width: 768px) {
          .main-title { font-size: 2.2rem; }
          .welcome-actions { flex-direction: column; width: 100%; }
          .welcome-stats { gap: 20px; }
          .guest-welcome { padding: 40px 20px; }
        }
      `}</style>
    </div>
  );
}
