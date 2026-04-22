"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elektronkutibxan-production.up.railway.app/api';

export default function LibraryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    setIsLoggedIn(!!token);

    async function loadBooks() {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/books/?show_all=1`, { headers });
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
      const res = await fetch(`${API_URL}/transactions/digital-loan/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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

  // ── Agar tizimga kirgan bo'lsa — dashboard ichida chiqsin ──
  if (isLoggedIn) {
    return (
      <div className="dashboard animate-fade">
        <div className="welcome-section">
          <h1 className="welcome-title">{t('library_title')} <span className="gradient-text">📚</span></h1>
          <p className="welcome-subtitle">{t('library_subtitle')}</p>
        </div>

        <div className="search-wrap glass-panel">
          <span className="s-icon">🔍</span>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="s-input"
          />
          {searchQuery && <button className="s-clear" onClick={() => setSearchQuery("")}>✕</button>}
        </div>

        {statusMsg.text && (
          <div className={`status-bar glass-card ${statusMsg.type}`}>
            {statusMsg.type === 'success' ? '✅' : '❌'} {statusMsg.text}
          </div>
        )}

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

        <div className="reading-list glass-panel">
          <h3 className="section-title">{t('library_title')}</h3>
          {loading ? <p className="text-muted">{t('loading')}</p> : (
            <div className="book-list">
              {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                <div key={book.id} className="book-item glass-card">
                  <div className="book-cover">
                    {book.image ? <img src={book.image} alt={book.title} className="cover-img" /> : '📕'}
                  </div>
                  <div className="book-details">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-tags">
                      <span className={`status-pill ${book.available_copies > 0 ? 'success' : 'danger'}`}>
                        {book.available_copies > 0 ? `✅ ${book.available_copies} ${t('copies_available')}` : `❌ ${t('no_copies')}`}
                      </span>
                      {book.file && <span className="status-pill ebook">📱 E-kitob</span>}
                    </div>
                    <button
                      className={`btn-borrow btn-primary ${book.available_copies <= 0 ? 'btn-off' : ''}`}
                      onClick={() => handleBorrow(book.id)}
                      disabled={book.available_copies <= 0 || borrowingId === book.id}
                    >
                      {borrowingId === book.id ? '⏳ ...' : book.available_copies <= 0 ? t('no_copies') : `📖 ${t('borrow_btn')}`}
                    </button>
                  </div>
                </div>
              )) : <p className="text-muted">{t('no_results')}</p>}
            </div>
          )}
        </div>

        <style jsx>{`
          .dashboard { display: flex; flex-direction: column; gap: 30px; }
          .welcome-title { font-size: 2.2rem; margin-bottom: 5px; }
          .welcome-subtitle { color: var(--text-muted); }
          .search-wrap { display: flex; align-items: center; gap: 12px; padding: 14px 20px; max-width: 480px; }
          .s-icon { font-size: 1.1rem; opacity: 0.5; }
          .s-input { flex: 1; background: none; border: none; outline: none; color: var(--text-main); font-size: 0.95rem; }
          .s-input::placeholder { color: var(--text-muted); }
          .s-clear { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
          .status-bar { padding: 14px 20px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; }
          .status-bar.success { border-color: #10b981; color: #34d399; background: rgba(16,185,129,0.08); }
          .status-bar.error { border-color: #ef4444; color: #fca5a5; background: rgba(239,68,68,0.08); }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
          .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .stat-label { color: var(--text-muted); font-size: 0.9rem; }
          .stat-value { font-size: 1.5rem; margin-top: 2px; }
          .reading-list { padding: 30px; }
          .section-title { margin-bottom: 20px; font-size: 1.2rem; }
          .book-list { display: flex; flex-direction: column; gap: 15px; }
          .book-item { padding: 20px; display: flex; gap: 20px; }
          .book-cover { font-size: 40px; background: rgba(255,255,255,0.05); min-width: 70px; height: 90px; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
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
          .btn-off { background: rgba(255,255,255,0.05) !important; color: var(--text-muted) !important; cursor: not-allowed; box-shadow: none !important; }
          .text-muted { color: var(--text-muted); }
          @media (max-width: 1024px) { .stats-grid { grid-template-columns: 1fr; } .welcome-title { font-size: 1.6rem; } }
        `}</style>
      </div>
    );
  }

  // ── Tizimga kirmagan foydalanuvchilar uchun — to'liq ekranli dizayn ──
  return (
    <div className="lib-public">
      {/* Fon */}
      <div className="lib-bg">
        <div className="particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              opacity: ((i * 11) % 50) / 100,
              animationDuration: `${12 + ((i * 3) % 18)}s`,
              animationDelay: `-${(i * 2) % 12}s`
            }} />
          ))}
        </div>
        <div className="lamp-glow"></div>
      </div>
      <div className="auth-overlay"></div>

      {/* Nav */}
      <nav className="pub-nav">
        <div className="pub-brand">
          <span>📚</span>
          <span className="gradient-text">Raqamli Kutubxona</span>
        </div>
        <div className="pub-nav-links">
          <Link href="/login" className="nav-link-btn">Kirish</Link>
          <Link href="/register" className="nav-link-btn primary">{t('register')}</Link>
        </div>
      </nav>

      {/* Kontent */}
      <div className="pub-content">
        {/* Hero */}
        <div className="pub-hero animate-slide-up">
          <h1 className="pub-hero-title gradient-text">{t('library_hero_title')}</h1>
          <p className="pub-hero-sub">{t('library_hero_subtitle')}</p>
          <div className="pub-search glass-panel">
            <span>🔍</span>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pub-search-input"
            />
          </div>
        </div>

        {/* Status */}
        {statusMsg.text && (
          <div className={`pub-toast ${statusMsg.type}`}>
            {statusMsg.type === 'success' ? '✅' : '❌'} {statusMsg.text}
          </div>
        )}

        {/* Kitoblar */}
        <div className="pub-grid-wrap">
          {loading ? (
            <div className="pub-loading"><div className="spinner"></div></div>
          ) : (
            <div className="pub-grid">
              {filteredBooks.map((book) => (
                <div key={book.id} className="pub-book glass-panel">
                  <div className="pub-cover">
                    {book.image ? <img src={book.image} alt={book.title} className="pub-cover-img" /> : <span>📕</span>}
                    {book.file && <span className="pub-ebook-badge">📱</span>}
                  </div>
                  <div className="pub-info">
                    <h3 className="pub-title">{book.title}</h3>
                    <p className="pub-author">{book.author}</p>
                    <span className={`pub-badge ${book.available_copies > 0 ? 'ok' : 'no'}`}>
                      {book.available_copies > 0 ? `✅ ${book.available_copies} ${t('copies_available')}` : `❌ ${t('no_copies')}`}
                    </span>
                    <button
                      className={`pub-borrow ${book.available_copies <= 0 ? 'off' : ''}`}
                      onClick={() => handleBorrow(book.id)}
                      disabled={book.available_copies <= 0 || borrowingId === book.id}
                    >
                      {borrowingId === book.id ? '⏳' : book.available_copies <= 0 ? t('no_copies') : `📖 ${t('borrow_btn')}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .lib-public { min-height: 100vh; position: relative; overflow-x: hidden; }

        /* Background — register sahifasiga o'xshash */
        .lib-bg {
          position: fixed; inset: 0; z-index: 0;
          background: url('/images/cinematic_bg.png') center/cover no-repeat #000;
          filter: brightness(0.5) saturate(1.2);
        }
        .particles { position: absolute; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
        .particle { position: absolute; width: 3px; height: 3px; background: rgba(255,255,255,0.4); border-radius: 50%; filter: blur(1px); animation: float-particle 15s infinite linear; }
        .lamp-glow { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at 60% 40%, rgba(245,158,11,0.08) 0%, transparent 60%); z-index: 1; }
        .auth-overlay { position: fixed; inset: 0; background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%); z-index: 2; }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; } 80% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
        }

        /* Nav */
        .pub-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 40px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .pub-brand { display: flex; align-items: center; gap: 10px; font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; }
        .pub-nav-links { display: flex; gap: 10px; }
        .nav-link-btn {
          padding: 8px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          color: #9ca3af; text-decoration: none; transition: all 0.3s;
        }
        .nav-link-btn:hover { color: white; background: rgba(255,255,255,0.06); }
        .nav-link-btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white; box-shadow: 0 4px 15px var(--primary-glow);
        }
        .nav-link-btn.primary:hover { filter: brightness(1.1); transform: scale(1.03); }

        /* Content */
        .pub-content { position: relative; z-index: 10; padding: 0 40px 60px; }

        /* Hero */
        .pub-hero { text-align: center; padding: 60px 20px 40px; }
        .pub-hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 12px; }
        .pub-hero-sub { color: #9ca3af; font-size: 1.1rem; margin-bottom: 30px; }
        .pub-search {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 14px 22px; border-radius: 16px; min-width: 400px;
        }
        .pub-search-input { background: none; border: none; outline: none; color: white; font-size: 0.95rem; flex: 1; }
        .pub-search-input::placeholder { color: #6b7280; }

        /* Toast */
        .pub-toast {
          max-width: 500px; margin: 0 auto 20px;
          padding: 14px 24px; border-radius: 14px; font-weight: 600; text-align: center;
        }
        .pub-toast.success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }
        .pub-toast.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }

        /* Grid */
        .pub-grid-wrap { max-width: 1200px; margin: 0 auto; }
        .pub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .pub-book {
          padding: 20px; display: flex; gap: 16px;
          transition: all 0.3s ease;
        }
        .pub-book:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.3); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        .pub-cover {
          position: relative; flex-shrink: 0;
          width: 65px; height: 88px; font-size: 36px;
          background: rgba(255,255,255,0.05); border-radius: 8px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .pub-cover-img { width: 100%; height: 100%; object-fit: cover; }
        .pub-ebook-badge {
          position: absolute; top: 3px; right: 3px; font-size: 10px;
          background: rgba(16,185,129,0.3); border-radius: 4px; padding: 1px 3px;
        }
        .pub-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .pub-title { font-size: 0.95rem; font-weight: 700; }
        .pub-author { font-size: 0.8rem; color: #9ca3af; }
        .pub-badge { font-size: 0.72rem; font-weight: 600; }
        .pub-badge.ok { color: #34d399; }
        .pub-badge.no { color: #f87171; }
        .pub-borrow {
          margin-top: auto; padding: 8px 14px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border: none; border-radius: 8px; color: white;
          font-weight: 700; font-size: 0.82rem; cursor: pointer;
          transition: all 0.3s; box-shadow: 0 4px 12px var(--primary-glow);
        }
        .pub-borrow:hover:not(.off) { transform: scale(1.03); filter: brightness(1.1); }
        .pub-borrow.off { background: rgba(255,255,255,0.06); color: #6b7280; cursor: not-allowed; box-shadow: none; }

        /* Loading */
        .pub-loading { display: flex; justify-content: center; padding: 60px; }
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .pub-nav { padding: 12px 20px; }
          .pub-content { padding: 0 20px 40px; }
          .pub-hero-title { font-size: 1.8rem; }
          .pub-search { min-width: auto; width: 100%; }
          .pub-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
