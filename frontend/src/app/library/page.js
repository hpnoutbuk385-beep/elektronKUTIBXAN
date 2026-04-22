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
        const res = await fetchApi('/books/');
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
    <div className="library-page animate-fade">
      <div className="page-header">
        <h1 className="gradient-text">{t('library_title')}</h1>
        <p className="subtitle">{t('library_subtitle')}</p>
      </div>

      {/* Search */}
      <div className="search-bar glass-panel">
        <span className="search-icon-lib">🔍</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input-lib"
        />
      </div>

      {/* Status */}
      {statusMsg.text && (
        <div className={`status-toast glass-card ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Books Grid */}
      <div className="lib-grid">
        {filteredBooks.length > 0 ? filteredBooks.map((book) => (
          <div key={book.id} className="lib-card glass-panel">
            <div className="lib-cover">
              {book.image ? (
                <img src={book.image} alt={book.title} className="lib-cover-img" />
              ) : (
                "📕"
              )}
              {book.file && <span className="e-badge">📱</span>}
            </div>
            <div className="lib-info">
              <h3 className="lib-title">{book.title}</h3>
              <p className="lib-author">{book.author}</p>
              <div className="lib-meta">
                {book.page_count > 0 && (
                  <span className="lib-tag">📄 {book.page_count} {t('pages')}</span>
                )}
                <span className={`lib-tag ${book.available_copies > 0 ? 'tag-ok' : 'tag-no'}`}>
                  {book.available_copies > 0 ? `✅ ${book.available_copies} ${t('copies_available')}` : `❌ ${t('no_copies')}`}
                </span>
              </div>
              <button
                className={`btn-primary lib-borrow ${book.available_copies <= 0 ? 'btn-disabled' : ''}`}
                onClick={() => handleBorrow(book.id)}
                disabled={book.available_copies <= 0 || borrowingId === book.id}
              >
                {borrowingId === book.id ? "⏳..." : book.available_copies <= 0 ? t('no_copies') : `📖 ${t('borrow_btn')}`}
              </button>
            </div>
          </div>
        )) : (
          <p className="text-muted">{t('no_results')}</p>
        )}
      </div>

      <style jsx>{`
        .library-page { display: flex; flex-direction: column; gap: 25px; }
        .subtitle { color: var(--text-muted); margin-top: 5px; }

        .search-bar { display: flex; align-items: center; gap: 12px; padding: 12px 20px; width: fit-content; min-width: 350px; }
        .search-icon-lib { font-size: 1.1rem; opacity: 0.5; }
        .search-input-lib {
          background: none; border: none; outline: none;
          color: var(--text-main); font-size: 0.95rem; width: 100%;
        }
        .search-input-lib::placeholder { color: var(--text-muted); }

        .status-toast { padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; }
        .status-toast.success { border-color: #10b981; color: #34d399; background: rgba(16, 185, 129, 0.08); }
        .status-toast.error { border-color: #ef4444; color: #fca5a5; background: rgba(239, 68, 68, 0.08); }

        .lib-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .lib-card {
          padding: 20px;
          display: flex;
          gap: 20px;
          transition: all 0.3s ease;
        }
        .lib-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }

        .lib-cover {
          font-size: 40px;
          background: rgba(255, 255, 255, 0.05);
          min-width: 70px;
          height: 95px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .lib-cover-img { width: 100%; height: 100%; object-fit: cover; }
        .e-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 12px;
          background: rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          padding: 1px 4px;
        }

        .lib-info { display: flex; flex-direction: column; gap: 4px; flex-grow: 1; }
        .lib-title { font-size: 1rem; font-weight: 700; }
        .lib-author { font-size: 0.8rem; color: var(--text-muted); }

        .lib-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .lib-tag {
          padding: 2px 8px; border-radius: 6px;
          font-size: 0.7rem; font-weight: 500;
          background: rgba(255, 255, 255, 0.05); color: var(--text-muted);
        }
        .tag-ok { color: #34d399; background: rgba(16, 185, 129, 0.08); }
        .tag-no { color: #f87171; background: rgba(239, 68, 68, 0.08); }

        .lib-borrow {
          margin-top: 10px;
          padding: 8px 14px;
          font-size: 0.8rem;
          border-radius: 8px;
        }
        .btn-disabled {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--text-muted) !important;
          cursor: not-allowed;
          box-shadow: none !important;
        }

        .text-muted { color: var(--text-muted); }

        @media (max-width: 1024px) {
          .lib-grid { grid-template-columns: 1fr; }
          .search-bar { min-width: auto; width: 100%; }
        }
      `}</style>
    </div>
  );
}
