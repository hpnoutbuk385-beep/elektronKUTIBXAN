"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function RewardsPage() {
  const { t } = useLanguage();
  
  const rewards = [
    { id: 1, title: "Birinchi kitob", desc: "Siz birinchi kitobingizni muvaffaqiyatli o'qidingiz", icon: "🥇", date: "2024-03-15", unlocked: true },
    { id: 2, title: "Hafta qahramoni", desc: "Bir hafta ichida 3 ta kitob o'qiganingiz uchun", icon: "⚡", date: "2024-04-01", unlocked: true },
    { id: 3, title: "Kutubxona donishmandi", desc: "10 ta kitob o'qiganingizdan so'ng beriladi", icon: "🧙‍♂️", date: null, unlocked: false },
    { id: 4, title: "Tungi o'quvchi", desc: "Soat 22:00 dan keyin kitob o'qiganingiz uchun", icon: "🌙", date: null, unlocked: false },
  ];

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Yutuqlar va Mukofotlar 🎁</h1>
        <p className="welcome-subtitle">Kitob o'qib ballar to'plang va yangi mukofotlarni qo'lga kiriting.</p>
      </div>

      <div className="rewards-grid">
        {rewards.map((reward) => (
          <div key={reward.id} className={`reward-card glass-panel ${!reward.unlocked ? 'locked' : ''}`}>
            <div className="reward-icon-box">{reward.icon}</div>
            <h3 className="reward-title">{reward.title}</h3>
            <p className="reward-desc">{reward.desc}</p>
            {reward.unlocked ? (
              <span className="reward-date">🏅 Olingan: {reward.date}</span>
            ) : (
              <span className="reward-status">🔒 Hali yopiq</span>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .welcome-title { font-size: 2rem; color: white; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.5); }

        .rewards-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
        }

        .reward-card { padding: 30px; text-align: center; position: relative; overflow: hidden; }
        .reward-card.locked { opacity: 0.5; filter: grayscale(1); }
        
        .reward-icon-box { 
          font-size: 3rem; margin-bottom: 20px; 
          background: rgba(255,255,255,0.05); width: 80px; height: 80px;
          margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
          border-radius: 20px;
        }
        
        .reward-title { font-size: 1.1rem; color: white; margin-bottom: 10px; font-weight: 700; }
        .reward-desc { color: rgba(255,255,255,0.5); font-size: 0.85rem; line-height: 1.5; margin-bottom: 20px; }
        
        .reward-date { font-size: 0.8rem; color: #34d399; font-weight: 600; }
        .reward-status { font-size: 0.8rem; color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
