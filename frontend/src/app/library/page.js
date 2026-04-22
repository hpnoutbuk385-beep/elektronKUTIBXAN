"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = [
  { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", description: "O'zbek adabiyoti durdonasi.", image: "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg", available_copies: 10, file: "https://www.afisha.uz/pdf/otkan_kunlar.pdf" },
  { id: 102, title: "Mehrobdan chayon", author: "Abdulla Qodiriy", description: "Tarixiy roman.", image: "https://images.uzum.uz/cl9v5klennt1543387sg/original.jpg", available_copies: 8, file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20Mehrobdan%20chayon%20(roman).pdf" },
  { id: 103, title: "Kecha va kunduz", author: "Cho'lpon", description: "Milliy uyg'onish asari.", image: "https://images.uzum.uz/cl9v765ennt1543387ug/original.jpg", available_copies: 5, file: "#" },
  { id: 104, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", description: "Bobur Mirzo hayoti.", image: "https://images.uzum.uz/cl9v955ennt15433880g/original.jpg", available_copies: 7, file: "#" },
  { id: 105, title: "Dunyoning ishlari", author: "O'tkir Hoshimov", description: "Mehr-oqibat haqida.", image: "https://images.uzum.uz/cl9vbclennt15433882g/original.jpg", available_copies: 12, file: "#" },
  { id: 106, title: "Sariq devni minib", author: "Xudoyberdi To'xtaboyev", description: "Bolalar uchun sarguzasht.", image: "https://images.uzum.uz/cl9vd55ennt15433884g/original.jpg", available_copies: 15, file: "#" },
  { id: 107, title: "Atom odatlar", author: "James Clear", description: "Yaxshi odatlar haqida.", image: "https://images.uzum.uz/cl9vf5lennt15433886g/original.jpg", available_copies: 20, file: "#" },
  { id: 108, title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", description: "Moliya sirlari.", image: "https://images.uzum.uz/cl9vh55ennt15433888g/original.jpg", available_copies: 10, file: "#" },
  { id: 109, title: "Diqqat", author: "Cal Newport", description: "Diqqatni jamlash.", image: "https://images.uzum.uz/cl9vj55ennt1543388ag/original.jpg", available_copies: 9, file: "#" },
  { id: 110, title: "Psixologiya", author: "Sh. Do'stmuhamedova", description: "Darslik.", image: "https://images.uzum.uz/cl9vl55ennt1543388cg/original.jpg", available_copies: 25, file: "#" }
];

export default function LibraryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetchApi('/books/?show_all=1');
        if (res.ok) {
          const data = await res.json();
          const results = Array.isArray(data) ? data : data.results || [];
          if (results.length > 0) {
            setBooks(results);
          } else {
            // AGAR BAZA BO'SH BO'LSA - FALLBACK KITOBLLARNI KO'RSATAMIZ
            setBooks(FALLBACK_BOOKS);
          }
        } else {
          setBooks(FALLBACK_BOOKS);
        }
      } catch (err) {
        setBooks(FALLBACK_BOOKS);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = books.filter(b => 
    !searchQuery || 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreview = (bookId) => {
    router.push(`/preview/${bookId}`);
  };

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">Kutubxona 👋</h1>
        <p className="welcome-subtitle">Kitoblar bilan tanishing va o'qishni boshlang.</p>
      </div>

      <div className="search-bar-wrap glass-panel">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Kitoblarni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="books-main-card glass-panel">
        <h3 className="section-header">Barcha kitoblar</h3>
        <div className="books-list-container">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card-item glass-card">
              <div className="book-cover-mini">
                <img src={book.image || "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg"} alt="" />
              </div>
              <div className="book-info-box">
                <h4 className="book-item-title">{book.title}</h4>
                <p className="book-item-author">{book.author}</p>
                <div className="book-item-meta">
                  <span className="status-pill available">✅ {book.available_copies} nusxa</span>
                  <span className="status-pill ebook">📱 E-kitob</span>
                </div>
                
                <div className="btn-group">
                  <button className="btn-preview" onClick={() => handlePreview(book.id)}>
                    👁️ Tanishish
                  </button>
                  <button className="btn-primary borrow-btn-mini" onClick={() => router.push('/register')}>
                    📖 Ijaraga olish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 25px; }
        .welcome-title { font-size: 2rem; color: white; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.5); }
        .search-bar-wrap { display: flex; align-items: center; gap: 12px; padding: 12px 20px; max-width: 400px; }
        .search-input { background: none; border: none; color: white; outline: none; width: 100%; }
        .books-main-card { padding: 25px; min-height: 400px; }
        .books-list-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .book-card-item { padding: 15px; display: flex; gap: 15px; align-items: center; }
        .book-cover-mini { width: 70px; height: 100px; border-radius: 8px; overflow: hidden; }
        .book-cover-mini img { width: 100%; height: 100%; object-fit: cover; }
        .book-info-box { flex-grow: 1; }
        .book-item-title { font-size: 1rem; color: white; font-weight: 600; }
        .book-item-author { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        .book-item-meta { display: flex; gap: 8px; margin-top: 5px; }
        .status-pill { padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
        .status-pill.available { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.ebook { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        .btn-group { display: flex; gap: 10px; margin-top: 10px; }
        .btn-preview { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; }
        .borrow-btn-mini { padding: 6px 15px; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
