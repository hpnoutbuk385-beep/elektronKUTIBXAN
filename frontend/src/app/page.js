"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchApi } from "@/lib/api";

export default function Dashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ read_books: 24, points: 0, rank: 3 });
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "Azizbek R.", points: 1540 },
    { id: 2, name: "Madina S.", points: 1320 },
    { id: 3, name: "Sardor M.", points: 1100 }
  ]);

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
    
    // Haqiqiy statistikani yuklashga harakat qilamiz
    async function loadStats() {
      try {
        const res = await fetchApi('/transactions/my-loans/');
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({ ...prev, read_books: data.length }));
        }
      } catch (err) {
        console.warn("Stats load failed, using mocks", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="dashboard-grid animate-fade">
      <div className="header-section">
        <h1 className="welcome-text">Salom, <span className="user-name">{user?.first_name || user?.username || 'Foydalanuvchi'}!</span> 👋</h1>
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
            <h2 className="stat-num">{user?.points || stats.points}</h2>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon-box purple">🏆</div>
          <div className="stat-content">
            <p className="stat-title">Sinfdagi o'rni</p>
            <h2 className="stat-num">{stats.rank}</h2>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="reading-now glass-panel">
          <h3 className="card-title">Hozir o'qilmoqda</h3>
          <div className="empty-state">
            <p>Hozircha hech qanday kitob o'qimayapsiz.</p>
          </div>
        </div>

        <div className="right-col">
          <div className="scanner-card glass-panel">
            <div className="scanner-box">
              <div className="scan-icon-bg">🔲</div>
              <h4 className="scan-title">Kitob olish / qaytarish</h4>
              <p className="scan-sub">QR kodni skanerlang</p>
              <button className="scan-link" onClick={() => window.location.href='/library'}>Skanerlashni boshlash</button>
            </div>
          </div>

          <div className="leader-card glass-panel">
            <h3 className="card-title">Eng yaxshi kitobxonlar</h3>
            <div className="leader-list">
              {leaderboard.map((item, idx) => (
                <div key={item.id} className="leader-item">
                  <span className="leader-rank">{idx + 1}</span>
                  <span className="leader-name">{item.name}</span>
                  <span className="leader-pts">{item.points.toLocaleString()} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-grid { display: flex; flex-direction: column; gap: 30px; width: 100%; }
        .welcome-text { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 5px; }
        .user-name { color: #818cf8; }
        .welcome-sub { color: rgba(255, 255, 255, 0.5); font-size: 0.95rem; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
        .stat-icon-box { width: 55px; height: 55px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-icon-box.blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-icon-box.orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .stat-icon-box.purple { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
        .stat-title { color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
        .stat-num { font-size: 1.8rem; font-weight: 700; color: white; }
        .main-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
        .reading-now { padding: 30px; min-height: 350px; }
        .card-title { font-size: 1.1rem; color: white; margin-bottom: 25px; font-weight: 600; }
        .empty-state { height: 200px; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.3); }
        .right-col { display: flex; flex-direction: column; gap: 20px; }
        .scanner-card { padding: 30px; text-align: center; }
        .scan-icon-bg { width: 50px; height: 50px; background: rgba(255,255,255,0.05); margin: 0 auto 15px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; border: 1px solid rgba(255,255,255,0.1); }
        .scan-title { font-size: 1rem; color: white; margin-bottom: 5px; }
        .scan-sub { color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-bottom: 10px; }
        .scan-link { background: none; border: none; color: #818cf8; font-weight: 600; text-decoration: underline; cursor: pointer; font-size: 0.85rem; }
        .leader-card { padding: 25px; }
        .leader-list { display: flex; flex-direction: column; gap: 15px; }
        .leader-item { display: flex; align-items: center; gap: 15px; }
        .leader-rank { color: #818cf8; font-weight: 700; width: 20px; }
        .leader-name { color: white; flex-grow: 1; font-size: 0.9rem; }
        .leader-pts { color: #fbbf24; font-weight: 700; font-size: 0.85rem; }
        @media (max-width: 1200px) { .main-grid { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
