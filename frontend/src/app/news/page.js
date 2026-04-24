"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetchApi('/news/');
        if (res.ok) {
          const data = await res.json();
          setNews(data.results || data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadNews();
  }, []);

  return (
    <div className="news-container animate-fade">
      <header className="news-header">
        <h1 className="gradient-text">Maktab Yangiliklari</h1>
        <p className="subtitle">So'nggi e'lonlar va qiziqarli xabarlar</p>
      </header>

      {loading ? (
        <div className="loader">Yuklanmoqda...</div>
      ) : (
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={item.id} className="news-card glass-panel" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="news-date">{new Date(item.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <h2 className="news-title">{item.title}</h2>
              <p className="news-content">{item.content}</p>
              <div className="news-footer">
                <span className="news-tag">E'LON</span>
              </div>
            </div>
          ))}
          {news.length === 0 && <p className="no-news">Hozircha yangiliklar yo'q.</p>}
        </div>
      )}

      <style jsx>{`
        .news-container { padding: 40px 20px; max-width: 1000px; margin: 0 auto; }
        .news-header { text-align: center; margin-bottom: 50px; }
        .subtitle { color: rgba(196, 168, 130, 0.5); font-family: 'Lora', serif; margin-top: 10px; }
        
        .news-grid { display: flex; flex-direction: column; gap: 25px; }
        .news-card { padding: 30px; border-radius: 24px; transition: 0.3s; animation: slideUp 0.6s ease forwards; opacity: 0; }
        .news-card:hover { transform: translateY(-5px); border-color: rgba(218, 165, 32, 0.3) !important; }
        
        .news-date { color: #DAA520; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px; opacity: 0.8; }
        .news-title { color: #f5e6c8; font-family: 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 15px; }
        .news-content { color: rgba(245, 230, 200, 0.8); line-height: 1.7; font-size: 1.05rem; white-space: pre-wrap; }
        
        .news-footer { margin-top: 20px; display: flex; align-items: center; gap: 15px; }
        .news-tag { background: rgba(218, 165, 32, 0.1); color: #DAA520; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(218, 165, 32, 0.2); }
        
        .no-news { text-align: center; color: rgba(196, 168, 130, 0.4); font-style: italic; margin-top: 40px; }
        .loader { text-align: center; color: #DAA520; margin-top: 50px; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
