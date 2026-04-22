"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elektronkutibxan-production.up.railway.app/api';

export default function MyBooks() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("current");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const res = await fetchApi('/transactions/');
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      setBooks(results);
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReturn = async (transactionId) => {
    if (!confirm(t('return_confirm'))) return;
    
    setReturningId(transactionId);
    try {
      const res = await fetchApi('/transactions/digital-return/', {
        method: "POST",
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: "success", text: t('return_success') });
        // Move from current to returned
        setBooks(prev => prev.map(b => 
          b.id === transactionId ? { ...b, status: 'RETURNED', return_date: new Date().toISOString(), points_earned: 10 } : b
        ));
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      } else {
        setStatusMsg({ type: "error", text: data.error || "Xatolik" });
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Server xatoligi" });
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
    } finally {
      setReturningId(null);
    }
  };

  const handleReadOnline = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const filteredBooks = books.filter(b => 
    activeTab === "current" ? b.status === "BORROWED" : b.status === "RETURNED"
  );

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="books-page animate-fade">
      <div className="page-header">
        <h1 className="gradient-text">{t('books_title')}</h1>
        <p className="subtitle">{t('books_subtitle')}</p>
        <Link href="/library" className="explore-link">📚 {t('explore_library')}</Link>
      </div>

      {/* Status Toast */}
      {statusMsg.text && (
        <div className={`toast-message ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <div className="tabs glass-panel">
        <button 
          className={`tab-btn ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          📖 {t('tab_current')} ({books.filter(b => b.status === 'BORROWED').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📋 {t('tab_history')} ({books.filter(b => b.status === 'RETURNED').length})
        </button>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? filteredBooks.map((trans) => (
          <div key={trans.id} className="book-card-full glass-panel">
            <div className="book-visual">
              {trans.book_details?.image ? (
                <img src={trans.book_details.image} alt={trans.book_details.title} className="cover-img" />
              ) : (
                "📚"
              )}
            </div>
            <div className="book-content">
              <div className="book-main">
                <h3>{trans.book_details?.title}</h3>
                <p>{trans.book_details?.author}</p>
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

              {/* Action Buttons */}
              {trans.status === "BORROWED" && (
                <div className="action-buttons">
                  {trans.book_details?.file && (
                    <button 
                      className="btn-read"
                      onClick={() => handleReadOnline(trans.book_details.file)}
                    >
                      📖 {t('read_btn')}
                    </button>
                  )}
                  <button 
                    className="btn-return"
                    onClick={() => handleReturn(trans.id)}
                    disabled={returningId === trans.id}
                  >
                    {returningId === trans.id ? "⏳" : `🔄 ${t('return_btn')}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="empty-books">
            <span className="empty-icon">{activeTab === "current" ? "📖" : "📋"}</span>
            <p className="text-muted">{t('no_books')}</p>
            {activeTab === "current" && (
              <Link href="/library" className="explore-btn">
                📚 {t('explore_library')}
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .books-page { display: flex; flex-direction: column; gap: 30px; }
        .subtitle { color: var(--text-muted); margin-top: 5px; }
        .explore-link { 
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 20px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 10px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .explore-link:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }

        /* Toast */
        .toast-message {
          padding: 14px 24px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.9rem;
          animation: slideDown 0.4s ease;
        }
        .toast-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        .toast-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tabs { display: flex; gap: 10px; padding: 10px; width: fit-content; }
        .tab-btn { padding: 10px 25px; border-radius: 10px; border: none; background: none; color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.3s ease; }
        .tab-btn.active { background: var(--primary); color: white; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .book-card-full { display: flex; padding: 25px; gap: 25px; transition: all 0.3s ease; }
        .book-card-full:hover {
          border-color: rgba(99, 102, 241, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }
        .book-visual { font-size: 50px; background: rgba(255,255,255,0.05); width: 80px; height: 110px; display: flex; align-items: center; justify-content: center; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
        .cover-img { width: 100%; height: 100%; object-fit: cover; }
        .book-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .book-main h3 { font-size: 1.15rem; margin-bottom: 5px; }
        .book-main p { color: var(--text-muted); font-size: 0.9rem; }
        .book-meta { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; font-size: 0.85rem; }
        .meta-item { display: flex; justify-content: space-between; }
        .warning { color: var(--accent); font-weight: 600; }
        .success { color: #10b981; font-weight: 600; }
        .points-badge { margin-top: 12px; padding: 5px 12px; background: rgba(245, 158, 11, 0.1); color: var(--accent); border-radius: 20px; font-weight: 700; font-size: 0.8rem; width: fit-content; }
        
        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .btn-read {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }
        .btn-read:hover {
          transform: scale(1.03);
          filter: brightness(1.1);
        }
        .btn-return {
          flex: 1;
          padding: 10px;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 10px;
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-return:hover {
          background: rgba(245, 158, 11, 0.15);
          transform: scale(1.03);
        }
        .btn-return:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Empty State */
        .empty-books {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 60px 20px;
        }
        .empty-icon {
          font-size: 60px;
          opacity: 0.3;
        }
        .explore-btn {
          padding: 12px 28px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .explore-btn:hover {
          transform: scale(1.05);
        }

        .text-muted { color: var(--text-muted); margin: 20px 0; }

        @media (max-width: 1024px) {
          .books-grid { grid-template-columns: 1fr; }
          .book-card-full { padding: 18px; gap: 18px; }
          .action-buttons { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
