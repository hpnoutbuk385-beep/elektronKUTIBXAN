"use client";
import { useState } from "react";

export default function Leaderboard() {
  const [activeScope, setActiveScope] = useState("school");

  const leaders = [
    { rank: 1, name: "Azizbek Rahmonov", school: "235-IDUM", points: 1540, avatar: "A" },
    { rank: 2, name: "Madina Sobirova", school: "235-IDUM", points: 1320, avatar: "M" },
    { rank: 3, name: "Davronbek Polatov", school: "235-IDUM", points: 1250, avatar: "D" },
    { rank: 4, name: "Jasur Komilov", school: "235-IDUM", points: 1100, avatar: "J" },
    { rank: 5, name: "Nozima G'ulomova", school: "235-IDUM", points: 980, avatar: "N" },
  ];

  const competitions = [
    { id: 1, title: "Yil kitobxoni 2026", status: "Active", level: "Regional", deadline: "May 20" },
    { id: 2, title: "Alisher Navoiy asarlari bilimdoni", status: "Upcoming", level: "National", deadline: "June 05" },
  ];

  return (
    <div className="leaderboard-page animate-fade">
      <div className="page-header">
        <h1 className="gradient-text">Reyting va Musobaqalar</h1>
        <p className="subtitle">Eng kuchli kitobxonlar safida bo'ling</p>
      </div>

      <div className="main-layout">
        <div className="rankings-section">
          <div className="rankings-header glass-panel">
            <div className="scope-tabs">
              <button 
                className={`scope-btn ${activeScope === "school" ? "active" : ""}`}
                onClick={() => setActiveScope("school")}
              >
                Mening Maktabim
              </button>
              <button 
                className={`scope-btn ${activeScope === "district" ? "active" : ""}`}
                onClick={() => setActiveScope("district")}
              >
                Tuman
              </button>
              <button 
                className={`scope-btn ${activeScope === "national" ? "active" : ""}`}
                onClick={() => setActiveScope("national")}
              >
                Respublika
              </button>
            </div>
          </div>

          <div className="rank-table glass-panel">
            {leaders.map((leader) => (
              <div key={leader.rank} className={`rank-row ${leader.rank <= 3 ? 'top-rank' : ''}`}>
                <div className="rank-num">{leader.rank}</div>
                <div className="rank-avatar">{leader.avatar}</div>
                <div className="rank-info">
                  <span className="rank-name">{leader.name}</span>
                  <span className="rank-school">{leader.school}</span>
                </div>
                <div className="rank-score">🌟 {leader.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="side-section">
          <div className="active-competitions glass-panel">
            <h3 className="section-title">Faol Musobaqalar</h3>
            <div className="comp-list">
              {competitions.map((comp) => (
                <div key={comp.id} className="comp-card glass-card">
                  <div className="comp-badge">{comp.level}</div>
                  <h4>{comp.title}</h4>
                  <div className="comp-footer">
                    <span>⏳ {comp.deadline}</span>
                    <button className="btn-join">Qatnashish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-page { display: flex; flex-direction: column; gap: 30px; }
        .main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        
        .scope-tabs { display: flex; gap: 10px; padding: 10px; }
        .scope-btn { 
          padding: 8px 20px; border-radius: 8px; border: none; background: none; 
          color: var(--text-muted); cursor: pointer; transition: 0.3s;
        }
        .scope-btn.active { background: var(--glass); color: white; border: 1px solid var(--border); }

        .rank-table { padding: 10px; }
        .rank-row { 
          display: flex; align-items: center; padding: 15px 20px; gap: 20px; 
          border-bottom: 1px solid var(--border); transition: 0.3s;
        }
        .rank-row:last-child { border-bottom: none; }
        .rank-row:hover { background: var(--glass); }
        .top-rank .rank-num { color: var(--accent); font-size: 1.2rem; }

        .rank-avatar { 
          width: 40px; height: 40px; border-radius: 50%; background: var(--primary); 
          display: flex; align-items: center; justify-content: center; font-weight: 700;
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
        
        .btn-join { background: var(--primary); border: none; border-radius: 6px; color: white; padding: 5px 12px; cursor: pointer; }
      `}</style>
    </div>
  );
}
