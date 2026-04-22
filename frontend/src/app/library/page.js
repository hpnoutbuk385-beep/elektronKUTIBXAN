"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = [
  { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg", available_copies: 10 },
  { id: 102, title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg", available_copies: 8 },
  { id: 103, title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg", available_copies: 5 },
  { id: 104, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg", available_copies: 7 },
  { id: 105, title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg", available_copies: 12 },
  { id: 106, title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg", available_copies: 15 },
  { id: 107, title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg", available_copies: 20 },
  { id: 108, title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://kitobxon.com/img_u/b/4836.jpg", available_copies: 10 },
  { id: 109, title: "Diqqat", author: "Cal Newport", image: "https://kitobxon.com/img_u/b/6169.jpg", available_copies: 9 },
  { id: 110, title: "Psixologiya", author: "Darslik", image: "https://kitobxon.com/img_u/b/402.jpg", available_copies: 25 }
];

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState(FALLBACK_BOOKS);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Elektron Kutubxona 📚</h1>
        <p className="welcome-subtitle">Eng sara kitoblar to'plami. Tanlang va o'qishni boshlang.</p>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card glass-panel">
            <div className="book-image-wrap" onClick={() => router.push(`/preview/${book.id}`)}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-overlay">
                <span>👁️ Tanishish</span>
              </div>
            </div>
            <div className="book-card-info">
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author}</p>
              
              <div className="card-actions">
                <button className="btn-borrow-mini" onClick={() => router.push('/register')}>
                  📖 Ijaraga olish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-content { padding: 20px; }
        .welcome-title { font-size: 2.2rem; color: white; margin-bottom: 8px; font-weight: 800; }
        .welcome-subtitle { color: rgba(255,255,255,0.5); margin-bottom: 35px; font-size: 1.1rem; }
        
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .book-card { padding: 15px; border-radius: 20px; transition: 0.4s; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
        .book-card:hover { transform: translateY(-8px); background: rgba(255,255,255,0.08); border-color: rgba(129, 140, 248, 0.3); }
        
        .book-image-wrap { position: relative; border-radius: 15px; overflow: hidden; height: 300px; margin-bottom: 15px; cursor: pointer; }
        .book-image { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .book-card:hover .book-image { transform: scale(1.05); }
        
        .book-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .book-card:hover .book-overlay { opacity: 1; }
        .book-overlay span { background: white; color: black; padding: 10px 20px; border-radius: 25px; font-weight: 700; font-size: 0.9rem; }
        
        .book-card-info { text-align: center; }
        .book-title { color: white; font-size: 1.1rem; margin-bottom: 5px; font-weight: 700; }
        .book-author { color: #818cf8; font-size: 0.9rem; margin-bottom: 15px; }
        
        .card-actions { margin-top: 10px; }
        .btn-borrow-mini { 
          width: 100%; background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); 
          color: white; border: none; padding: 10px; border-radius: 12px; 
          font-weight: 700; cursor: pointer; transition: 0.3s; font-size: 0.9rem;
        }
        .btn-borrow-mini:hover { transform: scale(1.02); box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4); }
      `}</style>
    </div>
  );
}
