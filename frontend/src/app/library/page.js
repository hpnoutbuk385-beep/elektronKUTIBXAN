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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(`${API_URL}/books/`, {
          headers: { 'Content-Type': 'application/json' },
        });
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
      // Not logged in — redirect to register
      router.push("/register");
      return;
    }

    setBorrowingId(bookId);
    setErrorMsg("");
    setSuccessMsg("");

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
        setSuccessMsg(t('borrow_success'));
        // Update available copies locally
        setBooks(prev => prev.map(b => 
          b.id === bookId ? { ...b, available_copies: b.available_copies - 1 } : b
        ));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Xatolik yuz berdi");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg("Server bilan bog'lanishda xatolik");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setBorrowingId(null);
    }
  };

  const categories = [...new Set(books.map(b => b.category_name).filter(Boolean))];

  const filteredBooks = books.filter(b => {
    const matchesSearch = !searchQuery || 
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || b.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem("access_token");

  return (
    <div className="library-public">
      {/* Cinematic Background */}
      <div className="library-bg">
        <div className="particles">
          {[...Array(25)].map((_, i) => {
            const r1 = (i * 17) % 100;
            const r2 = (i * 31) % 100;
            const r3 = ((i * 11) % 50) / 100;
            const dur = 12 + ((i * 3) % 18);
            const del = (i * 2) % 12;
            return (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${r1}%`,
                  top: `${r2}%`,
                  opacity: r3,
                  animationDuration: `${dur}s`,
                  animationDelay: `-${del}s`
                }}
              />
            );
          })}
        </div>
        <div className="bg-gradient-overlay"></div>
      </div>

      {/* Top Navbar */}
      <nav className="library-nav">
        <div className="nav-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">{t('library_hero_title')}</span>
        </div>
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <Link href="/books" className="nav-link">📖 {t('my_books')}</Link>
              <Link href="/" className="nav-link nav-link-primary">🏠 Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Kirish</Link>
              <Link href="/register" className="nav-link nav-link-primary">{t('register')}</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="library-hero">
        <h1 className="hero-title">{t('library_hero_title')}</h1>
        <p className="hero-subtitle">{t('library_hero_subtitle')}</p>
        
        {/* Search Bar */}
        <div className="hero-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {/* Status Messages */}
      {successMsg && <div className="toast-msg toast-success">{successMsg}</div>}
      {errorMsg && <div className="toast-msg toast-error">{errorMsg}</div>}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="category-bar">
          <button 
            className={`cat-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory("")}
          >
            {t('all_categories')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Books Grid */}
      <section className="library-grid-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="library-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="lib-book-card">
                <div className="book-cover-wrap">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="book-cover-img" />
                  ) : (
                    <div className="book-cover-placeholder">
                      <span className="cover-emoji">📕</span>
                    </div>
                  )}
                  {book.file && (
                    <div className="ebook-badge">📱 E-kitob</div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-name">{book.title}</h3>
                  <p className="book-writer">{book.author}</p>
                  <div className="book-meta-row">
                    {book.page_count > 0 && (
                      <span className="meta-tag">📄 {book.page_count} {t('pages')}</span>
                    )}
                    <span className={`meta-tag ${book.available_copies > 0 ? 'available' : 'unavailable'}`}>
                      {book.available_copies > 0 ? `✅ ${book.available_copies} ${t('copies_available')}` : `❌ ${t('no_copies')}`}
                    </span>
                  </div>
                  <button
                    className={`borrow-button ${book.available_copies <= 0 ? 'disabled' : ''}`}
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.available_copies <= 0 || borrowingId === book.id}
                  >
                    {borrowingId === book.id ? (
                      <span className="btn-loading">⏳</span>
                    ) : book.available_copies <= 0 ? (
                      t('no_copies')
                    ) : (
                      <>📖 {t('borrow_btn')}</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <p>{t('no_results')}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="library-footer">
        <p>© 2026 Raqamli Kutubxona. Barcha huquqlar himoyalangan.</p>
      </footer>

      <style jsx>{`
        .library-public {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Background */
        .library-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 70%, #030712 100%);
        }
        .library-bg .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .library-bg .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          filter: blur(1px);
          animation: float-particle 15s infinite linear;
        }
        .bg-gradient-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.06) 0%, transparent 40%);
          z-index: 2;
        }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
        }

        /* Nav */
        .library-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon {
          font-size: 28px;
        }
        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 30%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .nav-link {
          color: #9ca3af;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
        }
        .nav-link-primary {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white !important;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .nav-link-primary:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        /* Hero */
        .library-hero {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 80px 40px 40px;
        }
        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: 3.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #6366f1 50%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
          animation: fadeIn 0.8s ease;
        }
        .hero-subtitle {
          color: #9ca3af;
          font-size: 1.15rem;
          max-width: 500px;
          margin: 0 auto 40px;
          animation: fadeIn 1s ease;
        }
        .hero-search {
          max-width: 550px;
          margin: 0 auto;
          position: relative;
          animation: fadeIn 1.2s ease;
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
          opacity: 0.5;
        }
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 50px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
        }
        .search-input::placeholder {
          color: #6b7280;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Toast */
        .toast-msg {
          position: fixed;
          top: 90px;
          right: 30px;
          z-index: 200;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.95rem;
          backdrop-filter: blur(20px);
          animation: slideIn 0.4s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .toast-success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }
        .toast-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Category Bar */
        .category-bar {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 10px;
          padding: 0 40px 30px;
          overflow-x: auto;
          scrollbar-width: none;
          animation: fadeIn 1.3s ease;
        }
        .category-bar::-webkit-scrollbar { display: none; }
        .cat-chip {
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #9ca3af;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }
        .cat-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }
        .cat-chip.active {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        /* Grid */
        .library-grid-section {
          position: relative;
          z-index: 10;
          padding: 0 40px 60px;
          min-height: 400px;
        }
        .library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* Book Card */
        .lib-book-card {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.6s ease;
        }
        .lib-book-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.1);
        }
        .book-cover-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .book-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .book-cover-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cover-emoji {
          font-size: 64px;
          opacity: 0.6;
        }
        .ebook-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        .book-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .book-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f9fafb;
          line-height: 1.3;
        }
        .book-writer {
          color: #9ca3af;
          font-size: 0.85rem;
        }
        .book-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .meta-tag {
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.05);
          color: #9ca3af;
        }
        .meta-tag.available {
          color: #34d399;
          background: rgba(16, 185, 129, 0.08);
        }
        .meta-tag.unavailable {
          color: #f87171;
          background: rgba(239, 68, 68, 0.08);
        }
        .borrow-button {
          margin-top: 12px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }
        .borrow-button:hover:not(.disabled) {
          transform: scale(1.02);
          box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
          filter: brightness(1.1);
        }
        .borrow-button.disabled {
          background: rgba(255, 255, 255, 0.05);
          color: #6b7280;
          cursor: not-allowed;
          box-shadow: none;
        }
        .btn-loading {
          font-size: 1.2rem;
        }

        /* States */
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 300px;
          color: #9ca3af;
        }
        .empty-icon {
          font-size: 60px;
          opacity: 0.3;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .library-footer {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 30px;
          color: #4b5563;
          font-size: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .library-nav {
            padding: 12px 20px;
          }
          .brand-text {
            font-size: 1rem;
          }
          .library-hero {
            padding: 50px 20px 30px;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 0.95rem;
          }
          .library-grid-section {
            padding: 0 20px 40px;
          }
          .library-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }
          .category-bar {
            padding: 0 20px 20px;
          }
          .nav-link {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .library-grid {
            grid-template-columns: 1fr;
          }
          .hero-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
