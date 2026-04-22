"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300x450?text=Kitob';
  // Eng ishonchli proksi: Cloudinary Fetch
  return `https://res.cloudinary.com/demo/image/fetch/w_300,h_450,c_fill/${encodeURIComponent(url)}`;
};

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetchApi('/books/');
        if (res.ok) setBooks(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="premium-loader"></div>
      <p>Kitoblar yuklanmoqda...</p>
      <style jsx>{`
        .loader-container { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #818cf8; }
        .premium-loader { width: 50px; height: 50px; border: 3px solid rgba(129, 140, 248, 0.2); border-top-color: #818cf8; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  return (
    <div className="library-wrapper animate-fade">
      <div className="lib-header">
        <h1 className="v-gradient-text">Elektron Kutubxona</h1>
        <p>Siz uchun saralangan eng sara asarlar to'plami</p>
      </div>

      <div className="v-books-grid">
        {books.map((book) => (
          <div key={book.id} className="v-book-card glass-panel" onClick={() => router.push(`/preview/${book.id}`)}>
            <div className="v-img-wrap">
              <img 
                src={getImageUrl(book.image)} 
                alt={book.title} 
                className="v-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=Kitob'; }}
              />
              <div className="v-overlay"><span>MUTOLAA</span></div>
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
        .v-gradient-text { font-size: 3rem; font-weight: 900; background: linear-gradient(to right, #fff, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; }
        .lib-header p { color: rgba(255,255,255,0.6); font-size: 1.2rem; }

        .v-books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 35px; }
        
        .v-book-card { 
          padding: 15px; border-radius: 28px; cursor: pointer; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; height: 100%;
        }
        .v-book-card:hover { transform: translateY(-12px); background: rgba(255,255,255,0.08); border-color: rgba(129, 140, 248, 0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }

        .v-img-wrap { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 2/3; background: #1e293b; }
        .v-img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .v-book-card:hover .v-img { transform: scale(1.1) rotate(2deg); }

        .v-overlay { position: absolute; inset: 0; background: rgba(99, 102, 241, 0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; backdrop-filter: blur(4px); }
        .v-book-card:hover .v-overlay { opacity: 1; }
        .v-overlay span { background: white; color: black; padding: 10px 24px; border-radius: 30px; font-weight: 800; font-size: 0.8rem; letter-spacing: 1px; }

        .v-info { padding: 20px 10px 5px; display: flex; flex-direction: column; flex-grow: 1; text-align: center; }
        .v-title { color: white; font-size: 1.2rem; margin-bottom: 8px; font-weight: 800; line-height: 1.3; height: 3.1rem; overflow: hidden; }
        .v-author { color: #818cf8; font-size: 0.95rem; margin-bottom: 20px; font-weight: 500; opacity: 0.8; }
        
        .v-btn { margin-top: auto; background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); color: white; border: none; padding: 14px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
        .v-btn:hover { transform: scale(1.03); filter: brightness(1.1); }

        /* MOBILE REDESIGN - QAT'IY YANGILASH */
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
            border-radius: 22px !important;
          }
          
          .v-img-wrap { width: 110px !important; height: 156px !important; flex-shrink: 0 !important; border-radius: 15px !important; }
          .v-info { padding: 0 !important; text-align: left !important; justify-content: center !important; }
          .v-title { font-size: 1.1rem !important; height: auto !important; max-height: 2.8rem !important; margin-bottom: 4px !important; }
          .v-author { font-size: 0.9rem !important; margin-bottom: 12px !important; }
          .v-btn { width: fit-content !important; padding: 10px 20px !important; font-size: 0.85rem !important; border-radius: 12px !important; }
        }
      `}</style>
    </div>
  );
}
