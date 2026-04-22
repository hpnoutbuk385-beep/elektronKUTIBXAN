"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// RASMLARNI KAFOLATLANGAN HOLDA KO'RSATISH UCHUN PROKSI ISHLATAMIZ
const getImageUrl = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=300&h=450&fit=cover`;

const FALLBACK_BOOKS = [
  { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg" },
  { id: 102, title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg" },
  { id: 103, title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg" },
  { id: 104, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg" },
  { id: 105, title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg" },
  { id: 106, title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg" },
  { id: 107, title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg" },
  { id: 108, title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://kitobxon.com/img_u/b/4836.jpg" },
  { id: 109, title: "Diqqat", author: "Cal Newport", image: "https://kitobxon.com/img_u/b/6169.jpg" },
  { id: 110, title: "Psixologiya", author: "Darslik", image: "https://kitobxon.com/img_u/b/402.jpg" }
];

export default function LibraryPage() {
  const router = useRouter();
  const [books] = useState(FALLBACK_BOOKS);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Elektron Kutubxona 📚</h1>
        <p className="welcome-subtitle">Eng sara kitoblar to'plami. Tanlang va o'qishni boshlang.</p>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card glass-panel" onClick={() => router.push(`/preview/${book.id}`)}>
            <div className="book-image-wrap">
              <img 
                src={getImageUrl(book.image)} 
                alt={book.title} 
                className="book-image"
                loading="lazy"
              />
              <div className="book-overlay"><span>👁️ O'qish</span></div>
            </div>
            <div className="book-card-info">
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author}</p>
              <button className="btn-borrow-mini" onClick={(e) => { e.stopPropagation(); router.push('/register'); }}>
                📖 Ijaraga olish
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-content { padding: 20px; }
        .welcome-title { font-size: 2.2rem; color: white; margin-bottom: 8px; font-weight: 800; }
        .welcome-subtitle { color: rgba(255,255,255,0.5); margin-bottom: 35px; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        .book-card { padding: 12px; border-radius: 20px; cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
        .book-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.08); }
        .book-image-wrap { position: relative; border-radius: 12px; overflow: hidden; height: 300px; background: #1e293b; }
        .book-image { width: 100%; height: 100%; object-fit: cover; }
        .book-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .book-card:hover .book-overlay { opacity: 1; }
        .book-overlay span { background: white; color: black; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
        .book-card-info { text-align: center; margin-top: 12px; }
        .book-title { color: white; font-size: 1rem; margin-bottom: 4px; font-weight: 700; height: 2.4rem; overflow: hidden; }
        .book-author { color: #818cf8; font-size: 0.8rem; margin-bottom: 12px; }
        .btn-borrow-mini { width: 100%; background: #818cf8; color: white; border: none; padding: 8px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
        @media (max-width: 600px) { .books-grid { grid-template-columns: 1fr 1fr; gap: 15px; } }
      `}</style>
    </div>
  );
}
