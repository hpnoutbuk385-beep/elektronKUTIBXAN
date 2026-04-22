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
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=Kitob'; }}
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
        .dashboard-content { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .welcome-title { font-size: 2.2rem; color: white; margin-bottom: 8px; font-weight: 800; text-align: center; }
        .welcome-subtitle { color: rgba(255,255,255,0.5); margin-bottom: 35px; text-align: center; }
        
        .books-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
          gap: 30px; 
        }
        
        .book-card { 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .book-card:hover { 
          transform: translateY(-10px); 
          background: rgba(255,255,255,0.08);
          border-color: rgba(129, 140, 248, 0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .book-image-wrap { 
          position: relative; 
          border-radius: 18px; 
          overflow: hidden; 
          aspect-ratio: 2/3; 
          background: #1e293b; 
        }
        
        .book-image { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .book-card:hover .book-image { transform: scale(1.1); }

        .book-overlay { 
          position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
          display: flex; align-items: center; justify-content: center; 
          opacity: 0; transition: 0.3s; backdrop-filter: blur(4px);
        }
        .book-card:hover .book-overlay { opacity: 1; }
        .book-overlay span { background: white; color: black; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
        
        .book-card-info { padding: 15px 5px 5px; display: flex; flex-direction: column; flex-grow: 1; }
        .book-title { color: white; font-size: 1.1rem; margin-bottom: 5px; font-weight: 700; height: 2.6rem; overflow: hidden; line-height: 1.3; }
        .book-author { color: #818cf8; font-size: 0.9rem; margin-bottom: 15px; font-weight: 500; }
        
        .btn-borrow-mini { 
          margin-top: auto; 
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); 
          color: white; border: none; padding: 12px; border-radius: 14px; 
          font-weight: 700; cursor: pointer; font-size: 0.9rem;
          transition: 0.3s;
        }
        .btn-borrow-mini:hover { transform: scale(1.02); filter: brightness(1.1); }
        
        @media (max-width: 768px) {
          .dashboard-content { padding: 15px; }
          .welcome-title { font-size: 1.8rem; margin-bottom: 20px; }
          
          .books-grid { 
            grid-template-columns: 1fr; /* 1 qatorga o'tamiz */
            gap: 15px; 
          }

          .book-card { 
            flex-direction: row; /* Rasm chapda, matn o'ngda */
            height: 160px;
            padding: 10px;
            align-items: center;
            gap: 15px;
          }

          .book-image-wrap { 
            width: 100px;
            height: 140px;
            flex-shrink: 0;
            aspect-ratio: auto;
          }

          .book-card-info { 
            padding: 0;
            text-align: left;
            justify-content: center;
          }

          .book-title { 
            font-size: 1.05rem; 
            height: auto; 
            max-height: 2.8rem; 
            margin-bottom: 5px;
          }

          .book-author { 
            font-size: 0.85rem; 
            margin-bottom: 12px; 
          }

          .btn-borrow-mini { 
            width: fit-content;
            padding: 8px 20px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
