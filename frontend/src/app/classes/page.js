"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ClassesPage() {
  const { t } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    async function loadClasses() {
      try {
        const res = await fetchApi('/classes/');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadClasses();
  }, []);

  return (
    <>
    <div className="page-container animate-fade">
      <div className="page-header">
            <h1 className="page-title">{t('classes')}</h1>
            <p className="page-subtitle">O'quv maskanidagi barcha sinflar va ta'lim tillari</p>
          </div>

          {loading ? (
            <div className="loading-state">{t('loading')}</div>
          ) : (
            <div className="classes-grid">
              {classes.length > 0 ? classes.map(cls => (
                <div key={cls.id} className="class-card glass-panel">
                  <div className="class-icon">🏫</div>
                  <div className="class-info">
                    <h3 className="class-name">{cls.name}</h3>
                    <p className="class-lang">
                      <span className="lang-tag">{cls.language_display}</span>
                    </p>
                  </div>
                  <div className="class-stats">
                    <div className="stat">
                      <span className="stat-label">O'quvchilar:</span>
                      <span className="stat-value">0</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-data-card glass-panel">
                  <p>Hozircha sinflar kiritilmagan.</p>
                </div>
              )}
            </div>
          )}
    </div>

    <style jsx>{`
        .app-layout { display: flex; background: #1a120b; min-height: 100vh; }
        .main-content { flex-grow: 1; padding: 0 20px 20px 0; display: flex; flex-direction: column; }
        .page-container { padding: 20px; }
        .page-header { margin-bottom: 35px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #f5e6c8; margin-bottom: 8px; }
        .page-subtitle { color: rgba(196, 168, 130, 0.6); font-family: 'Lora', serif; font-size: 1.1rem; }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .class-card {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: 0.3s;
          border: 1px solid rgba(218, 165, 32, 0.1) !important;
        }
        .class-card:hover {
          transform: translateY(-5px);
          border-color: rgba(218, 165, 32, 0.3) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }

        .class-icon {
          font-size: 2rem;
          background: rgba(218, 165, 32, 0.1);
          width: 60px; height: 60px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 16px;
        }

        .class-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #DAA520;
          margin-bottom: 5px;
        }

        .lang-tag {
          background: rgba(218, 165, 32, 0.15);
          color: #f5e6c8;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .class-stats {
          margin-top: 10px;
          padding-top: 15px;
          border-top: 1px solid rgba(218, 165, 32, 0.1);
        }

        .stat { display: flex; justify-content: space-between; font-size: 0.9rem; }
        .stat-label { color: rgba(196, 168, 130, 0.5); }
        .stat-value { color: #f5e6c8; font-weight: 700; }

        .loading-state { text-align: center; color: #DAA520; padding: 50px; font-size: 1.2rem; }
        
        @media (max-width: 1024px) {
          .main-content { padding: 0 15px 15px 15px; }
        }
      `}</style>
    </>
  );
}
