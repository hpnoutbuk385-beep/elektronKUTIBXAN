"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop';
  return url;
};

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fallbackBooks = [
      { id: "101", title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg" },
      { id: "102", title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg" },
      { id: "103", title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg" },
      { id: "104", title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg" },
      { id: "105", title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg" },
      { id: "106", title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg" }
    ];
    setBooks(fallbackBooks);

    async function loadBooks() {
      try {
        const res = await fetchApi('/books/');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setBooks(data);
        }
      } catch (err) {
        console.error("API Error, using fallback", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="book-loader">
        <div className="book-page"></div>
        <div className="book-page"></div>
        <div className="book-page"></div>
      </div>
      <p>Kitoblar yuklanmoqda...</p>
      <style jsx>{`
        .loader-container { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #DAA520; font-family: 'Lora', serif; }
        .book-loader { display: flex; gap: 4px; margin-bottom: 25px; }
        .book-page {
          width: 12px; height: 40px; background: linear-gradient(to bottom, #DAA520, #8B4513);
          border-radius: 2px; animation: pageFlip 1.2s ease-in-out infinite;
        }
        .book-page:nth-child(2) { animation-delay: 0.15s; height: 45px; }
        .book-page:nth-child(3) { animation-delay: 0.3s; }
        @keyframes pageFlip {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="library-wrapper animate-fade">
      <div className="lib-header">
        <div className="header-ornament">
          <span className="orn-wing">━━━ ✦ ━━━</span>
        </div>
        <h1 className="v-gradient-text">Elektron Kutubxona</h1>
        <p>Siz uchun saralangan eng sara asarlar to'plami</p>
        <div className="header-ornament">
          <span className="orn-wing">━━━ ◆ ━━━</span>
        </div>
      </div>

      <div className="v-books-grid">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="v-book-card glass-panel"
            onClick={() => router.push(`/preview/${book.id}`)}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="v-img-wrap">
              <img 
                src={getImageUrl(book.image)} 
                alt={book.title} 
                className="v-img"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop'; }}
              />
              <div className="v-overlay">
                <span>MUTOLAA</span>
              </div>
              {/* Book spine effect */}
              <div className="book-spine"></div>
            </div>
            <div className="v-info">
              <h3 className="v-title">{book.title}</h3>
              <p className="v-author">{book.author}</p>
              <button className="v-btn" onClick={(e) => { e.stopPropagation(); router.push('/register'); }}>
                📖 Ijaraga olish
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .library-wrapper { padding: 40px 20px; max-width: 1300px; margin: 0 auto; }
        .lib-header { text-align: center; margin-bottom: 50px; }
        .v-gradient-text {
          font-size: 2.8rem; font-weight: 900;
          background: linear-gradient(135deg, #f5e6c8 0%, #DAA520 50%, #C19A6B 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 12px; font-family: 'Playfair Display', serif;
          letter-spacing: 0.02em;
        }
        .lib-header p { color: rgba(196, 168, 130, 0.5); font-size: 1.1rem; font-family: 'Lora', serif; }
        .header-ornament { color: rgba(218, 165, 32, 0.25); font-size: 0.8rem; margin: 8px 0; letter-spacing: 4px; }

        .v-books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 30px; }
        
        .v-book-card { 
          padding: 14px; border-radius: 22px; cursor: pointer;
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(42, 31, 20, 0.6) !important;
          border: 1px solid rgba(218, 165, 32, 0.08) !important;
          display: flex; flex-direction: column; height: 100%;
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }
        .v-book-card:hover {
          transform: translateY(-10px) scale(1.02);
          background: rgba(42, 31, 20, 0.9) !important;
          border-color: rgba(218, 165, 32, 0.3) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(218, 165, 32, 0.08);
        }

        .v-img-wrap {
          position: relative; border-radius: 16px; overflow: hidden;
          aspect-ratio: 2/3; background: #2a1f14;
          box-shadow: inset -3px 0 8px rgba(0,0,0,0.3);
        }
        .book-spine {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(to bottom, rgba(218, 165, 32, 0.3), rgba(139, 69, 19, 0.5), rgba(218, 165, 32, 0.3));
          z-index: 3;
        }
        .v-img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .v-book-card:hover .v-img { transform: scale(1.08); }

        .v-overlay {
          position: absolute; inset: 0;
          background: rgba(139, 69, 19, 0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: 0.35s; backdrop-filter: blur(3px);
        }
        .v-book-card:hover .v-overlay { opacity: 1; }
        .v-overlay span {
          background: #f5e6c8; color: #3d2b1f; padding: 10px 24px;
          border-radius: 30px; font-weight: 800; font-size: 0.8rem;
          letter-spacing: 2px; font-family: 'Inter', sans-serif;
        }

        .v-info { padding: 18px 8px 5px; display: flex; flex-direction: column; flex-grow: 1; text-align: center; }
        .v-title {
          color: #f5e6c8; font-size: 1.15rem; margin-bottom: 6px; font-weight: 700;
          line-height: 1.3; height: 3rem; overflow: hidden;
          font-family: 'Playfair Display', serif;
        }
        .v-author {
          color: #DAA520; font-size: 0.9rem; margin-bottom: 18px;
          font-weight: 500; opacity: 0.7; font-family: 'Lora', serif;
          font-style: italic;
        }
        
        .v-btn {
          margin-top: auto;
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #DAA520 100%);
          color: #f5e6c8; border: none; padding: 13px;
          border-radius: 14px; font-weight: 700; cursor: pointer;
          transition: 0.3s; font-family: 'Lora', serif;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
          letter-spacing: 0.03em;
        }
        .v-btn:hover { transform: scale(1.03); filter: brightness(1.15); box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4); }

        /* MOBILE */
        @media (max-width: 768px) {
          .library-wrapper { padding: 20px 15px; }
          .v-gradient-text { font-size: 2rem; }
          .v-books-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          
          .v-book-card { 
            flex-direction: row !important; 
            height: 180px !important; 
            padding: 12px !important; 
            gap: 15px !important; 
            align-items: center !important;
            border-radius: 18px !important;
          }
          
          .v-img-wrap { width: 110px !important; height: 156px !important; flex-shrink: 0 !important; border-radius: 12px !important; }
          .v-info { padding: 0 !important; text-align: left !important; justify-content: center !important; }
          .v-title { font-size: 1.05rem !important; height: auto !important; max-height: 2.8rem !important; margin-bottom: 4px !important; }
          .v-author { font-size: 0.85rem !important; margin-bottom: 12px !important; }
          .v-btn { width: fit-content !important; padding: 10px 20px !important; font-size: 0.85rem !important; border-radius: 12px !important; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
