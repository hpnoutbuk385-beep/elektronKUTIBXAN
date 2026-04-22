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
        setStatusMsg({ type: "error", text: data.error || "Xatolik" });
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Xatolik yuz berdi" });
    } finally {
      setBorrowingId(null);
    }
  };

  const filteredBooks = books.filter(b => 
    !searchQuery || 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">{t('library_title')} 👋</h1>
        <p className="welcome-subtitle">{t('library_subtitle')}</p>
      </div>

      <div className="search-bar-wrap glass-panel">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {statusMsg.text && (
        <div className={`status-alert ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <div className="books-grid-layout">
        <div className="books-main-card glass-panel">
          <h3 className="section-header">{t('library_title')}</h3>
          <div className="books-list-container">
            {filteredBooks.length > 0 ? filteredBooks.map((book) => (
              <div key={book.id} className="book-card-item glass-card">
                <div className="book-cover-mini">
                  {book.image ? <img src={book.image} alt="" /> : "📚"}
                </div>
                <div className="book-info-box">
                  <h4 className="book-item-title">{book.title}</h4>
                  <p className="book-item-author">{book.author}</p>
                  <div className="book-item-meta">
                    <span className={`status-pill ${book.available_copies > 0 ? 'available' : 'empty'}`}>
                      {book.available_copies > 0 ? `✅ ${book.available_copies} nusxa` : "❌ Nusxa qolmagan"}
                    </span>
                    {book.file && <span className="status-pill ebook">📱 E-kitob</span>}
                  </div>
                  <button 
                    className="btn-primary borrow-btn-mini"
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.available_copies <= 0 || borrowingId === book.id}
                  >
                    {borrowingId === book.id ? "..." : `📖 ${t('borrow_btn')}`}
                  </button>
                </div>
              </div>
            )) : <p className="empty-msg">{t('no_results')}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 25px; }
        .welcome-title { font-size: 2rem; color: white; margin-bottom: 5px; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.5); font-size: 0.95rem; }

        .search-bar-wrap { display: flex; align-items: center; gap: 12px; padding: 12px 20px; max-width: 400px; }
        .search-input { background: none; border: none; color: white; outline: none; width: 100%; }
        
        .status-alert { padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; }
        .status-alert.success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-alert.error { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); }

        .books-main-card { padding: 25px; min-height: 400px; }
        .section-header { margin-bottom: 20px; color: white; font-size: 1.1rem; }
        
        .books-list-container { display: flex; flex-direction: column; gap: 12px; }
        .book-card-item { padding: 15px; display: flex; gap: 15px; align-items: center; }
        
        .book-cover-mini { 
          width: 60px; height: 80px; background: rgba(255,255,255,0.05); 
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          overflow: hidden; font-size: 24px;
        }
        .book-cover-mini img { width: 100%; height: 100%; object-fit: cover; }
        
        .book-info-box { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
        .book-item-title { font-size: 1rem; color: white; font-weight: 600; }
        .book-item-author { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        
        .book-item-meta { display: flex; gap: 8px; margin-top: 5px; }
        .status-pill { padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
        .status-pill.available { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.empty { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-pill.ebook { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        
        .borrow-btn-mini { padding: 6px 15px; font-size: 0.8rem; margin-top: 8px; width: fit-content; }
        .empty-msg { color: rgba(255,255,255,0.3); text-align: center; padding: 40px; }
      `}</style>
    </div>
  );
}
