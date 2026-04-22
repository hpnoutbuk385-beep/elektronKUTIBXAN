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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    setIsLoggedIn(!!token);

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

  // Kitobni ijaraga olish yoki previewdan keyin registerga yuborish
  const handleBorrow = async (bookId) => {
    if (!isLoggedIn) {
      // Tanlangan kitobni saqlab qo'yamiz, registerdan keyin ijaraga olish uchun
      localStorage.setItem("pending_book_id", bookId);
      router.push("/register");
      return;
    }

    setBorrowingId(bookId);
    try {
      const res = await fetchApi('/transactions/digital-loan/', {
        method: "POST",
        body: JSON.stringify({ book_id: bookId }),
      });
      if (res.ok) {
        setStatusMsg({ type: "success", text: t('borrow_success') });
        setBooks(prev => prev.map(b => b.id === bookId ? { ...b, available_copies: b.available_copies - 1 } : b));
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      } else {
        const data = await res.json();
        setStatusMsg({ type: "error", text: data.error || "Xatolik" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Xatolik yuz berdi" });
    } finally {
      setBorrowingId(null);
    }
  };

  // Preview funksiyasi: 1, 2, 3 sahifalarni ko'rsatish
  const handlePreview = (book) => {
    if (!book.file) {
      alert("Elektron versiya mavjud emas");
      return;
    }
    // Pending bookni saqlaymiz
    localStorage.setItem("pending_book_id", book.id);
    
    // Preview oynasini ochamiz
    const previewUrl = `/preview/${book.id}`;
    window.open(previewUrl, '_blank');
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
        <p className="welcome-subtitle">Kitoblar bilan tanishing va o'qishni boshlang.</p>
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

      <div className="books-main-card glass-panel">
        <h3 className="section-header">Barcha kitoblar</h3>
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
                
                <div className="btn-group">
                  {book.file && (
                    <button className="btn-preview" onClick={() => handlePreview(book)}>
                      👁️ Tanishish
                    </button>
                  )}
                  <button 
                    className="btn-primary borrow-btn-mini"
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.available_copies <= 0 || borrowingId === book.id}
                  >
                    {borrowingId === book.id ? "..." : `📖 ${t('borrow_btn')}`}
                  </button>
                </div>
              </div>
            </div>
          )) : <p className="empty-msg">{t('no_results')}</p>}
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 25px; }
        .welcome-title { font-size: 2rem; color: white; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.5); }
        .search-bar-wrap { display: flex; align-items: center; gap: 12px; padding: 12px 20px; max-width: 400px; }
        .search-input { background: none; border: none; color: white; outline: none; width: 100%; }
        .books-main-card { padding: 25px; min-height: 400px; }
        .books-list-container { display: flex; flex-direction: column; gap: 12px; }
        .book-card-item { padding: 15px; display: flex; gap: 15px; align-items: center; }
        .book-cover-mini { width: 60px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; font-size: 24px; display: flex; align-items: center; justify-content: center; }
        .book-cover-mini img { width: 100%; height: 100%; object-fit: cover; }
        .book-info-box { flex-grow: 1; }
        .book-item-title { font-size: 1rem; color: white; font-weight: 600; }
        .book-item-author { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        .book-item-meta { display: flex; gap: 8px; margin-top: 5px; }
        .status-pill { padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
        .status-pill.available { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.empty { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-pill.ebook { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        
        .btn-group { display: flex; gap: 10px; margin-top: 10px; }
        .btn-preview { 
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
          color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: 0.3s;
        }
        .btn-preview:hover { background: rgba(255,255,255,0.1); }
        .borrow-btn-mini { padding: 6px 15px; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
