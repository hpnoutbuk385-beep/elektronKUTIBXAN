"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { fetchApi } from "@/lib/api";

export default function LibraryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetchApi('/books/?show_all=1');
        if (res.ok) {
          const data = await res.json();
          setBooks(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error("Failed to load books", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    if (!token) {
      router.push("/register");
      return;
    }
    setBorrowingId(bookId);
    setStatusMsg({ type: "", text: "" });
    try {
      const res = await fetchApi('/transactions/digital-loan/', {
        method: "POST",
        body: JSON.stringify({ book_id: bookId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: "success", text: t('borrow_success') });
        setBooks(prev => prev.map(b =>
          b.id === bookId ? { ...b, available_copies: b.available_copies - 1 } : b
        ));
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      } else {
        setStatusMsg({ type: "error", text: data.error || "Xatolik yuz berdi" });
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Server bilan bog'lanishda xatolik" });
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
    } finally {
      setBorrowingId(null);
    }
  };

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    return b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.author?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="dashboard animate-fade">

      {/* Header */}
      <div className="welcome-section">
        <h1 className="welcome-title">{t('library_title')} <span className="gradient-text">📚</span></h1>
        <p className="welcome-subtitle">{t('library_subtitle')}</p>
      </div>

      {/* Search bar */}
      <div className="search-wrap glass-panel">
        <span className="s-icon">🔍</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="s-input"
        />
        {searchQuery && (
          <button className="s-clear" onClick={() => setSearchQuery("")}>✕</button>
        )}
      </div>

      {/* Status toast */}
      {statusMsg.text && (
        <div className={`status-bar glass-card ${statusMsg.type}`}>
          {statusMsg.type === 'success' ? '✅' : '❌'} {statusMsg.text}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary)' }}>📚</div>
          <div className="stat-info">
            <p className="stat-label">{t('book_fund')}</p>
            <h3 className="stat-value">{books.length}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent)' }}>✅</div>
          <div className="stat-info">
            <p className="stat-label">{t('available_status')}</p>
            <h3 className="stat-value">{books.filter(b => b.available_copies > 0).length}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary)' }}>📱</div>
          <div className="stat-info">
            <p className="stat-label">E-kitoblar</p>
            <h3 className="stat-value">{books.filter(b => b.file).length}</h3>
          </div>
        </div>
      </div>

      {/* Books list */}
      <div className="reading-list glass-panel">
        <h3 className="section-title">{t('library_title')}</h3>
        <div className="book-list">
          {filteredBooks.length > 0 ? filteredBooks.map((book) => (
            <div key={book.id} className="book-item glass-card">
              <div className="book-cover">
                {book.image
                  ? <img src={book.image} alt={book.title} className="cover-img" />
                  : '📕'
                }
              </div>
              <div className="book-details">
                <h4 className="book-title">{book.title}</h4>
                <p className="book-author">{book.author}</p>
                <div className="book-tags">
                  <span className={`status-pill ${book.available_copies > 0 ? 'success' : 'danger'}`}>
                    {book.available_copies > 0
                      ? `✅ ${book.available_copies} ${t('copies_available')}`
                      : `❌ ${t('no_copies')}`}
                  </span>
                  {book.file && (
                    <span className="status-pill ebook">📱 E-kitob</span>
                  )}
                </div>
                <button
                  className={`btn-borrow btn-primary ${book.available_copies <= 0 ? 'btn-off' : ''}`}
                  onClick={() => handleBorrow(book.id)}
                  disabled={book.available_copies <= 0 || borrowingId === book.id}
                >
                  {borrowingId === book.id
                    ? '⏳ ...'
                    : book.available_copies <= 0
                    ? t('no_copies')
                    : `📖 ${t('borrow_btn')}`}
                </button>
              </div>
            </div>
          )) : (
            <p className="text-muted">{t('no_results')}</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard { display: flex; flex-direction: column; gap: 30px; }
        .welcome-title { font-size: 2.2rem; margin-bottom: 5px; }
        .welcome-subtitle { color: var(--text-muted); }

        /* Search */
        .search-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          max-width: 480px;
        }
        .s-icon { font-size: 1.1rem; opacity: 0.5; }
        .s-input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text-main); font-size: 0.95rem;
        }
        .s-input::placeholder { color: var(--text-muted); }
        .s-clear {
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; font-size: 0.85rem; padding: 0 4px;
        }

        /* Status */
        .status-bar {
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .status-bar.success { border-color: #10b981; color: #34d399; background: rgba(16,185,129,0.08); }
        .status-bar.error { border-color: #ef4444; color: #fca5a5; background: rgba(239,68,68,0.08); }

        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; }
        .stat-value { font-size: 1.5rem; margin-top: 2px; }

        /* Books */
        .reading-list { padding: 30px; }
        .section-title { margin-bottom: 20px; font-size: 1.2rem; }
        .book-list { display: flex; flex-direction: column; gap: 15px; }
        .book-item { padding: 20px; display: flex; gap: 20px; }
        .book-cover {
          font-size: 40px;
          background: rgba(255,255,255,0.05);
          width: 70px; height: 90px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; overflow: hidden; flex-shrink: 0;
        }
        .cover-img { width: 100%; height: 100%; object-fit: cover; }
        .book-details { flex-grow: 1; }
        .book-title { font-size: 1.05rem; margin-bottom: 4px; }
        .book-author { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; }
        .book-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .status-pill { padding: 2px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; }
        .status-pill.success { background: rgba(16,185,129,0.1); color: #10b981; }
        .status-pill.danger { background: rgba(239,68,68,0.1); color: #ef4444; }
        .status-pill.ebook { background: rgba(99,102,241,0.1); color: #818cf8; }
        .btn-borrow { padding: 8px 18px; font-size: 0.85rem; border-radius: 8px; }
        .btn-off {
          background: rgba(255,255,255,0.05) !important;
          color: var(--text-muted) !important;
          cursor: not-allowed;
          box-shadow: none !important;
        }
        .text-muted { color: var(--text-muted); }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr; }
          .welcome-title { font-size: 1.6rem; }
        }
      `}</style>
    </div>
  );
}
