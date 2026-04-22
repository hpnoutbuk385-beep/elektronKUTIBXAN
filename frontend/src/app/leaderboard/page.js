"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState([
    { id: 1, first_name: "Azizbek", last_name: "R.", points: 1540, read_books: 45 },
    { id: 2, first_name: "Madina", last_name: "S.", points: 1320, read_books: 38 },
    { id: 3, first_name: "Sardor", last_name: "M.", points: 1100, read_books: 30 },
    { id: 4, first_name: "Dilnoza", last_name: "A.", points: 950, read_books: 28 },
    { id: 5, first_name: "Jasur", last_name: "B.", points: 820, read_books: 25 },
  ]);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Kitobxonlar Reytingi 🏆</h1>
        <p className="welcome-subtitle">Eng ko'p kitob o'qigan va ball to'plagan foydalanuvchilar.</p>
      </div>

      <div className="glass-panel leaderboard-card">
        <div className="leader-table-header">
          <span>O'rin</span>
          <span>Foydalanuvchi</span>
          <span>O'qilgan</span>
          <span>Ballar</span>
        </div>
        
        <div className="leader-list">
          {leaders.map((user, idx) => (
            <div key={user.id} className="leader-row glass-card">
              <span className={`rank-num rank-${idx + 1}`}>{idx + 1}</span>
              <div className="user-cell">
                <div className="user-avatar">{user.first_name[0]}</div>
                <span className="user-full-name">{user.first_name} {user.last_name}</span>
              </div>
              <span className="books-num">{user.read_books} ta kitob</span>
              <span className="points-num">{user.points} PTS</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .welcome-title { font-size: 2rem; color: white; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.5); }

        .leaderboard-card { padding: 30px; }
        .leader-table-header { 
          display: grid; grid-template-columns: 80px 1fr 150px 120px; 
          padding: 0 20px 15px; border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.4); font-size: 0.85rem; font-weight: 600;
        }

        .leader-list { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; }
        .leader-row { 
          display: grid; grid-template-columns: 80px 1fr 150px 120px; 
          align-items: center; padding: 15px 20px; 
        }

        .rank-num { font-size: 1.1rem; font-weight: 800; color: rgba(255,255,255,0.3); }
        .rank-1 { color: #fbbf24; }
        .rank-2 { color: #94a3b8; }
        .rank-3 { color: #b45309; }

        .user-cell { display: flex; align-items: center; gap: 15px; }
        .user-avatar { 
          width: 35px; height: 35px; background: rgba(129, 140, 248, 0.2); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #818cf8; font-weight: 700; border: 1px solid rgba(129, 140, 248, 0.3);
        }
        .user-full-name { color: white; font-weight: 600; }
        
        .books-num { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .points-num { color: #fbbf24; font-weight: 700; text-align: right; }
      `}</style>
    </div>
  );
}
