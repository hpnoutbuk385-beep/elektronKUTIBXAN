"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Leaderboard() {
  const { t } = useLanguage();
  const [activeScope, setActiveScope] = useState("school");
  const [leaders, setLeaders] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [leadersRes, compsRes] = await Promise.all([
          fetchApi(`/leaderboard/?scope=${activeScope}`),
          fetchApi('/competitions/')
        ]);
        
        const leadersData = await leadersRes.json();
        const compsData = await compsRes.json();
        
        setLeaders(Array.isArray(leadersData) ? leadersData : leadersData.results || []);
        setCompetitions(Array.isArray(compsData) ? compsData : compsData.results || []);
      } catch (err) {
        console.error("Leaderboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeScope]);

  const handleJoin = async (compId) => {
      try {
          const res = await fetchApi(`/competitions/${compId}/register/`, { method: 'POST' });
          if (res.ok) {
              alert(t('comp_success'));
          } else {
              const data = await res.json();
              alert(data.message || t('comp_error'));
          }
      } catch (err) {
          alert(t('server_error'));
      }
  };

  return (
    <div className="leaderboard-page animate-fade">
      <div className="page-header">
        <h1 className="gradient-text">{t('leaderboard')} {t('competitions')}</h1>
        <p className="subtitle">{t('leaderboard_subtitle')}</p>
      </div>

      <div className="main-layout">
        <div className="rankings-section">
          <div className="rankings-header glass-panel">
            <div className="scope-tabs">
              <button 
                className={`scope-btn ${activeScope === "school" ? "active" : ""}`}
                onClick={() => setActiveScope("school")}
              >
                {t('my_school')}
              </button>
              <button 
                className={`scope-btn ${activeScope === "district" ? "active" : ""}`}
                onClick={() => setActiveScope("district")}
              >
                {t('district')}
              </button>
            </div>
          </div>

          <div className="rank-table glass-panel">
            {loading ? <p className="p-20">{t('loading')}</p> : (
                leaders.length > 0 ? leaders.map((leader, index) => (
                    <div key={leader.id} className={`rank-row ${index < 3 ? 'top-rank' : ''}`}>
                        <div className="rank-num">{index + 1}</div>
                        <div className="rank-avatar">{leader.username?.[0]?.toUpperCase() || 'U'}</div>
                        <div className="rank-info">
                        <span className="rank-name">{leader.username}</span>
                        <span className="rank-school">{leader.organization_name}</span>
                        </div>
                        <div className="rank-score">🌟 {leader.points}</div>
                    </div>
                )) : <p className="p-20 text-muted">{t('no_rankings')}</p>
            )}
          </div>
        </div>

        <div className="side-section">
          <div className="active-competitions glass-panel">
            <h3 className="section-title">{t('active_comps')}</h3>
            <div className="comp-list">
              {competitions.length > 0 ? competitions.map((comp) => (
                <div key={comp.id} className="comp-card glass-card">
                  <div className="comp-badge">{comp.level}</div>
                  <h4>{comp.title}</h4>
                  <div className="comp-footer">
                    <span>⏳ {new Date(comp.end_date).toLocaleDateString()}</span>
                    <button className="btn-join" onClick={() => handleJoin(comp.id)}>{t('join')}</button>
                  </div>
                </div>
              )) : <p className="text-muted">{t('no_comps')}</p>}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-page { display: flex; flex-direction: column; gap: 30px; }
        .main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        .p-20 { padding: 20px; }
        
        .scope-tabs { display: flex; gap: 10px; padding: 10px; }
        .scope-btn { 
          padding: 8px 20px; border-radius: 8px; border: none; background: none; 
          color: var(--text-muted); cursor: pointer; transition: 0.3s;
        }
        .scope-btn.active { background: var(--glass); color: white; border: 1px solid var(--border); }

        .rank-table { padding: 10px; min-height: 300px; }
        .rank-row { 
          display: flex; align-items: center; padding: 15px 20px; gap: 20px; 
          border-bottom: 1px solid var(--border); transition: 0.3s;
        }
        .rank-row:last-child { border-bottom: none; }
        .rank-row:hover { background: var(--glass); }
        .top-rank .rank-num { color: var(--accent); font-size: 1.2rem; font-weight: 800; }

        .rank-avatar { 
          width: 40px; height: 40px; border-radius: 50%; background: var(--primary); 
          display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;
        }
        .rank-info { display: flex; flex-direction: column; flex-grow: 1; }
        .rank-name { font-weight: 600; }
        .rank-school { font-size: 0.8rem; color: var(--text-muted); }
        .rank-score { font-weight: 700; color: var(--accent); }

        .active-competitions { padding: 25px; }
        .comp-list { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
        .comp-card { padding: 15px; }
        .comp-badge { font-size: 0.65rem; color: var(--primary); font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .comp-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; font-size: 0.8rem; }
        
        .btn-join { background: var(--primary); border: none; border-radius: 6px; color: white; padding: 5px 12px; cursor: pointer; transition: 0.3s; }
        .btn-join:hover { box-shadow: 0 0 10px var(--primary-glow); transform: scale(1.05); }
        .text-muted { color: var(--text-muted); }

        @media (max-width: 1000px) {
            .main-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
