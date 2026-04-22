"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = [
  { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", description: "O'zbek adabiyotining durdonasi.", image: "/otkan_kunlar_cover_1776853598586.png", available_copies: 10 },
  { id: 102, title: "Mehrobdan chayon", author: "Abdulla Qodiriy", description: "Anvar va Ra'noning pokiza muhabbati haqida.", image: "/mehrobdan_chayon_cover_1776853646785.png", available_copies: 8 },
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
  const [books, setBooks] = useState(FALLBACK_BOOKS); // DARHOL KO'RINISHI UCHUN

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetchApi('/books/?show_all=1');
        if (res.ok) {
          const data = await res.json();
          const results = Array.isArray(data) ? data : data.results || [];
          if (results.length > 0) setBooks(results);
        }
      } catch (err) {}
    }
    loadBooks();
  }, []);

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Elektron Kutubxona 📚</h1>
        <p className="welcome-subtitle">Eng sara kitoblar to'plami.</p>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card glass-panel" onClick={() => router.push(`/preview/${book.id}`)}>
            <div className="book-image-wrap">
              <img src={book.image} alt={book.title} className="book-image" onError={(e) => e.target.src = "https://via.placeholder.com/200x300?text=Kitob"} />
              <div className="book-overlay">
                <span>👁️ Tanishish</span>
              </div>
            </div>
            <div className="book-card-info">
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author}</p>
              <div className="book-meta">
                <span className="copies">✅ {book.available_copies} ta bor</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-content { padding: 20px; }
        .welcome-title { font-size: 2rem; color: white; margin-bottom: 5px; }
        .welcome-subtitle { color: rgba(255,255,255,0.5); margin-bottom: 30px; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        .book-card { padding: 15px; cursor: pointer; transition: 0.3s; }
        .book-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.1); }
        .book-image-wrap { position: relative; border-radius: 12px; overflow: hidden; height: 280px; margin-bottom: 15px; }
        .book-image { width: 100%; height: 100%; object-fit: cover; }
        .book-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .book-card:hover .book-overlay { opacity: 1; }
        .book-overlay span { background: white; color: black; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 0.85rem; }
        .book-title { color: white; font-size: 1rem; margin-bottom: 4px; font-weight: 700; }
        .book-author { color: #818cf8; font-size: 0.85rem; margin-bottom: 8px; }
        .copies { font-size: 0.75rem; color: #10b981; font-weight: 600; }
      `}</style>
    </div>
  );
}
