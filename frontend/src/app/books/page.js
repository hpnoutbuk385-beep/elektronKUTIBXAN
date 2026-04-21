"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function MyBooks() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("current");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetchApi('/transactions/');
        const data = await res.json();
        setBooks(data.results || []);
      } catch (err) {
        console.error("Failed to load books", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = books.filter(b => 
    activeTab === "current" ? b.status === "BORROWED" : b.status === "RETURNED"
  );

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="books-page animate-fade">
      <div className="page-header">
        <h1 className="gradient-text">{t('books_title')}</h1>
        <p className="subtitle">{t('books_subtitle')}</p>
      </div>

      <div className="tabs glass-panel">
        <button 
          className={`tab-btn ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          {t('tab_current')}
        </button>
        <button 
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          {t('tab_history')}
        </button>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? filteredBooks.map((trans) => (
          <div key={trans.id} className="book-card-full glass-panel">
            <div className="book-visual">📚</div>
            <div className="book-content">
              <div className="book-main">
                <h3>{trans.book_details.title}</h3>
                <p>{trans.book_details.author}</p>
              </div>
              <div className="book-meta">
                <div className="meta-item">
                  <span>📅 {t('borrowed_at')}</span>
                  <span>{new Date(trans.borrow_date).toLocaleDateString()}</span>
                </div>
                {trans.status === "BORROWED" ? (
                  <div className="meta-item warning">
                    <span>⏳ {t('due_at')}</span>
                    <span>{new Date(trans.due_date).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="meta-item success">
                    <span>✅ {t('returned_at')}</span>
                    <span>{trans.return_date ? new Date(trans.return_date).toLocaleDateString() : t('unknown')}</span>
                  </div>
                )}
              </div>
              {trans.points_earned > 0 && (
                <div className="points-badge">+{trans.points_earned} {t('points_earned')}</div>
              )}
            </div>
          </div>
        )) : <p className="text-muted">{t('no_books')}</p>}
      </div>

      <style jsx>{`
        .books-page { display: flex; flex-direction: column; gap: 30px; }
        .subtitle { color: var(--text-muted); margin-top: 5px; }
        .tabs { display: flex; gap: 10px; padding: 10px; width: fit-content; }
        .tab-btn { padding: 10px 25px; border-radius: 10px; border: none; background: none; color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.3s ease; }
        .tab-btn.active { background: var(--primary); color: white; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .book-card-full { display: flex; padding: 25px; gap: 25px; }
        .book-visual { font-size: 50px; background: rgba(255,255,255,0.05); width: 80px; height: 110px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .book-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .book-main h3 { font-size: 1.25rem; margin-bottom: 5px; }
        .book-main p { color: var(--text-muted); font-size: 0.9rem; }
        .book-meta { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; font-size: 0.85rem; }
        .meta-item { display: flex; justify-content: space-between; }
        .warning { color: var(--accent); font-weight: 600; }
        .success { color: #10b981; font-weight: 600; }
        .points-badge { margin-top: 15px; padding: 5px 12px; background: rgba(245, 158, 11, 0.1); color: var(--accent); border-radius: 20px; font-weight: 700; font-size: 0.8rem; width: fit-content; }
        .text-muted { color: var(--text-muted); margin: 20px 0; }
      `}</style>
    </div>
  );
}
