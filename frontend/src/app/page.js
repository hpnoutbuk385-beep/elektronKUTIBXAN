"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LibraryPage from "./library/page";
import { fetchApi, getMediaUrl } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

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

  const loadQrData = async () => {
    try {
      const res = await fetchApi('/auth/profile/');
      if (res.ok) {
        const data = await res.json();
        setQrData(data);
        setTimeLeft(120);
      }
    } catch (err) {
      console.error("Failed to load QR data", err);
    }
  };

  useEffect(() => {
    let interval;
    if (user && user.role === 'STUDENT') {
      loadQrData();
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            loadQrData();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="dashboard-container animate-fade">
      
      <div className="hero-section-grid">
        <div className="hero-main-area">
          <div className="bento-widget-wrapper">
            <div className="main-glass-card">
              <div className="center-app-icon">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
              </div>
              <h1 className="hero-title">Raqamli Kutubxona</h1>
              <p className="hero-subtitle">Barcha kitoblar, ijaralar va statistika bir joyda</p>
            </div>

            <button className="floating-badge qr-badge" onClick={() => router.push(user?.role === 'ADMIN' ? '/admin/scan' : '/profile')}>
              <span className="badge-icon">{user?.role === 'ADMIN' ? '📷' : '📱'}</span>
              {user?.role === 'ADMIN' ? 'Skanerlash' : 'Profilim'}
            </button>
            
            <button className="floating-badge analytics-badge" onClick={() => router.push('/library')}>
              <span className="badge-icon">📚</span>
              Kitob qidirish
            </button>
            
            <button className="floating-badge comp-badge" onClick={() => router.push('/leaderboard')}>
              <span className="badge-icon">🏅</span>
              Reyting
            </button>
          </div>
        </div>

        {user?.role === 'STUDENT' && (
          <div className="hero-side-panel glass-panel animate-slide-right">
            <div className="side-qr-header">
               <h4>Mening QR-kodim 📱</h4>
               <p>Kutubxonachiga ko'rsating</p>
            </div>
            
            <div className="side-qr-body">
              {qrData ? (
                <>
                  <div className="side-qr-box">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData.dynamic_qr}`} 
                      alt="Dynamic QR" 
                    />
                  </div>
                  <div className="side-timer-wrap">
                    <div className="side-timer-bar" style={{ width: `${(timeLeft / 120) * 100}%` }}></div>
                    <span className="side-timer-val">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="side-static-qr">
                    <span>Doimiy ID:</span>
                    <img src={getMediaUrl(qrData.qr_code_image)} alt="Static" />
                  </div>
                </>
              ) : (
                <div className="side-loader">Yuklanmoqda...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="user-stats-section">
          <div className="header-section">
            <h2 className="welcome-text">Salom, <span className="user-name">{user.first_name || user.username}!</span> 👋</h2>
          </div>
          <div className="stats-row">
            <div className="stat-card glass-panel">
              <div className="stat-icon-box books">📖</div>
              <div className="stat-content">
                <p className="stat-title">O'qilgan kitoblar</p>
                <h2 className="stat-num">12</h2>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-icon-box points">🌟</div>
              <div className="stat-content">
                <p className="stat-title">Bilim ballari</p>
                <h2 className="stat-num">{user.points || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="quick-access-library">
        <h3 className="section-heading">
          <span className="heading-icon">📚</span>
          Kitoblarni ko'rish
        </h3>
        <LibraryPage />
      </div>

      <style jsx>{`
        .dashboard-container { 
          display: flex; flex-direction: column; gap: 20px; 
          position: relative; z-index: 2;
        }

        .hero-section-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 25px;
          margin-top: 10px;
          align-items: stretch;
        }

        .hero-main-area {
          display: flex; justify-content: center; align-items: center;
        }

        .bento-widget-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
          display: flex; justify-content: center; align-items: center;
        }

        .main-glass-card {
          width: 100%;
          background: rgba(42, 31, 20, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 40px 30px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 
            0 20px 40px -10px rgba(0, 0, 0, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          z-index: 2;
        }

        .hero-side-panel {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: rgba(42, 31, 20, 0.6) !important;
          border: 1px solid rgba(218, 165, 32, 0.15) !important;
          border-radius: 28px;
        }

        .side-qr-header h4 { color: #f5e6c8; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
        .side-qr-header p { color: rgba(196, 168, 130, 0.5); font-size: 0.85rem; }

        .side-qr-body { display: flex; flex-direction: column; align-items: center; gap: 15px; flex-grow: 1; justify-content: center; }
        .side-qr-box { 
          background: white; padding: 10px; border-radius: 16px; 
          width: 160px; height: 160px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .side-qr-box img { width: 100%; height: 100%; }

        .side-timer-wrap { width: 100%; position: relative; height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; }
        .side-timer-bar { height: 100%; background: #DAA520; border-radius: 10px; transition: width 1s linear; }
        .side-timer-val { position: absolute; right: 0; top: 8px; font-size: 0.75rem; color: #DAA520; font-family: monospace; }

        .side-static-qr { 
          margin-top: 10px; display: flex; align-items: center; gap: 12px; 
          width: 100%; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .side-static-qr span { font-size: 0.75rem; color: rgba(255,255,255,0.3); }
        .side-static-qr img { width: 50px; height: 50px; border-radius: 6px; opacity: 0.7; }

        .center-app-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #FFB74D, #F57C00);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          color: white; margin-bottom: 15px;
          box-shadow: 0 10px 20px rgba(245, 124, 0, 0.4);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 800; color: #ffffff;
          margin-bottom: 8px; letter-spacing: -0.01em;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .floating-badge {
          position: absolute;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: white; border: none; cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 3;
        }
        .floating-badge:hover { transform: scale(1.05) translateY(-5px); }
        .badge-icon { font-weight: bold; font-size: 1.1rem; }

        .qr-badge { top: -15px; left: -10px; background: linear-gradient(135deg, #10B981, #059669); }
        .analytics-badge { top: 40%; right: -25px; background: linear-gradient(135deg, #3B82F6, #2563EB); }
        .comp-badge { bottom: -20px; right: 20px; background: linear-gradient(135deg, #F59E0B, #D97706); }

        .user-stats-section { margin-top: 20px; }
        .welcome-text { font-size: 1.8rem; font-weight: 800; color: #f5e6c8; font-family: 'Playfair Display', serif; margin-bottom: 20px; }
        .user-name { color: #DAA520; }
        
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .stat-card { padding: 20px; display: flex; align-items: center; gap: 15px; }
        .stat-icon-box {
          width: 45px; height: 45px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .stat-icon-box.books { background: rgba(139, 69, 19, 0.15); }
        .stat-icon-box.points { background: rgba(218, 165, 32, 0.12); }
        .stat-title { color: rgba(196, 168, 130, 0.6); font-size: 0.9rem; font-family: 'Lora', serif; }
        .stat-num { font-size: 1.5rem; font-weight: 700; color: #f5e6c8; font-family: 'Playfair Display', serif; }

        .section-heading {
          color: #f5e6c8; margin: 30px 0 20px; font-family: 'Playfair Display', serif;
          display: flex; align-items: center; gap: 10px; font-size: 1.4rem;
        }
        .heading-icon { font-size: 1.1rem; }

        @media (max-width: 900px) {
          .hero-section-grid { grid-template-columns: 1fr; }
          .hero-side-panel { order: -1; }
          .analytics-badge { right: 0; }
        }

        .animate-slide-right { animation: slideRight 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes slideRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
