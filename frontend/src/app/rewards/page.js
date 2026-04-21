"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function RewardsStore() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, rewardsRes] = await Promise.all([
          fetchApi('/auth/profile/'),
          fetchApi('/rewards/')
        ]);
        const userData = await userRes.json();
        const rewardsData = await rewardsRes.json();
        setUser(userData);
        setRewards(rewardsData.results || []);
      } catch (err) {
        console.error("Load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleBuy = async (reward) => {
    if (user.points >= reward.points_cost) {
      if (confirm(`${reward.name}ni ${reward.points_cost} ${t('buy_confirm')}`)) {
        try {
          const res = await fetchApi('/purchases/', {
            method: 'POST',
            body: JSON.stringify({ reward: reward.id })
          });
          if (res.ok) {
            const newPurchase = await res.json();
            setUser({ ...user, points: user.points - reward.points_cost });
            alert(`${t('buy_success')} ${newPurchase.claim_code}`);
          } else {
            const err = await res.json();
            alert(err.error || t('buy_error'));
          }
        } catch (err) {
          alert(t('server_error'));
        }
      }
    } else {
      alert(t('not_enough_points'));
    }
  };

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="rewards-page animate-fade">
      <div className="page-header flex-center-between">
        <div>
          <h1 className="gradient-text">{t('rewards_title')}</h1>
          <p className="subtitle">{t('rewards_subtitle')}</p>
        </div>
        <div className="points-display glass-panel">
          <span className="pts-label">{t('your_balance')}</span>
          <span className="pts-value">🌟 {user?.points?.toLocaleString() || 0} PTS</span>
        </div>
      </div>

      <div className="rewards-grid">
        {rewards.length > 0 ? rewards.map((reward) => (
          <div key={reward.id} className="reward-card glass-panel">
            <div className="reward-icon">🎁</div>
            <div className="reward-type-tag">{reward.stock > 0 ? t('available') : t('out_of_stock')}</div>
            <h3 className="reward-title">{reward.name}</h3>
            <p className="reward-stock">{t('in_stock')} {reward.stock}</p>
            
            <div className="reward-footer">
              <div className="reward-cost">{reward.points_cost} PTS</div>
              <button 
                className={`btn-purchase ${user.points < reward.points_cost || reward.stock <= 0 ? 'disabled' : ''}`}
                onClick={() => handleBuy(reward)}
                disabled={user.points < reward.points_cost || reward.stock <= 0}
              >
                {t('buy')}
              </button>
            </div>
          </div>
        )) : <p className="text-muted">{t('no_rewards')}</p>}
      </div>

      <style jsx>{`
        .rewards-page { display: flex; flex-direction: column; gap: 40px; }
        .flex-center-between { display: flex; align-items: center; justify-content: space-between; }
        .points-display { padding: 15px 25px; display: flex; flex-direction: column; align-items: flex-end; border-color: var(--accent); }
        .pts-label { color: var(--text-muted); font-size: 0.8rem; }
        .pts-value { font-size: 1.4rem; font-weight: 800; color: var(--accent); }
        .rewards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
        .reward-card { padding: 30px; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; }
        .reward-icon { font-size: 60px; margin-bottom: 15px; }
        .reward-type-tag { font-size: 0.7rem; text-transform: uppercase; background: var(--glass); padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px; }
        .reward-title { font-size: 1.1rem; margin-bottom: 5px; }
        .reward-stock { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 25px; }
        .reward-footer { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border); }
        .reward-cost { font-weight: 700; color: var(--accent); }
        .btn-purchase { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; }
        .btn-purchase:hover:not(.disabled) { transform: scale(1.05); box-shadow: 0 0 15px var(--primary-glow); }
        .btn-purchase.disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
        .text-muted { color: var(--text-muted); text-align: center; width: 100%; }
      `}</style>
    </div>
  );
}
