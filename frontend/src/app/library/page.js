"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = [
  { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", description: "O'zbek adabiyoti durdonasi.", image: "https://kitobxon.com/img_u/b/887.jpg", available_copies: 10 },
  { id: 102, title: "Mehrobdan chayon", author: "Abdulla Qodiriy", description: "Anvar va Ra'noning pokiza muhabbati.", image: "https://kitobxon.com/img_u/b/1500.jpg", available_copies: 8 },
  { id: 103, title: "Kecha va kunduz", author: "Cho'lpon", description: "Milliy uyg'onish davri asari.", image: "https://kitobxon.com/img_u/b/2034.jpg", available_copies: 5 },
  { id: 104, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", description: "Bobur Mirzo hayoti.", image: "https://kitobxon.com/img_u/b/2012.jpg", available_copies: 7 },
  { id: 105, title: "Dunyoning ishlari", author: "O'tkir Hoshimov", description: "Mehr-oqibat haqida.", image: "https://kitobxon.com/img_u/b/814.jpg", available_copies: 12 },
  { id: 106, title: "Sariq devni minib", author: "X. To'xtaboyev", description: "Bolalar sarguzashti.", image: "https://kitobxon.com/img_u/b/263.jpg", available_copies: 15 },
  { id: 107, title: "Atom odatlar", author: "James Clear", description: "Yaxshi odatlar.", image: "https://kitobxon.com/img_u/b/6146.jpg", available_copies: 20 },
  { id: 108, title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", description: "Moliya sirlari.", image: "https://kitobxon.com/img_u/b/4836.jpg", available_copies: 10 },
  { id: 109, title: "Diqqat", author: "Cal Newport", description: "Diqqatni jamlash.", image: "https://kitobxon.com/img_u/b/6169.jpg", available_copies: 9 },
  { id: 110, title: "Psixologiya", author: "Darslik", description: "Psixologiya asoslari.", image: "https://kitobxon.com/img_u/b/402.jpg", available_copies: 25 }
];

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState(FALLBACK_BOOKS);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Kutubxona 👋</h1>
        <p className="welcome-subtitle">Eng sara kitoblar to'plami.</p>
      </div>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card glass-panel" onClick={() => router.push(`/preview/${book.id}`)}>
            <div className="book-image-wrap">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-overlay"><span>👁️ Tanishish</span></div>
            </div>
            <div className="book-card-info">
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .dashboard-content { padding: 20px; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .book-card { padding: 12px; cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.05); border-radius: 15px; }
        .book-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.1); }
        .book-image-wrap { height: 250px; border-radius: 10px; overflow: hidden; margin-bottom: 10px; position: relative; }
        .book-image { width: 100%; height: 100%; object-fit: cover; }
        .book-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .book-card:hover .book-overlay { opacity: 1; }
        .book-title { color: white; font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
        .book-author { color: #818cf8; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
