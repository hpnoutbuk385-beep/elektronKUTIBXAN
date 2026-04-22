"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "/otkan_kunlar_page_1_1776854793090.png",
      "https://n.ziyouz.com/images/stories/books/otgan_kunlar_2.jpg",
      "https://n.ziyouz.com/images/stories/books/otgan_kunlar_3.jpg"
    ]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", 
    image: "https://kitobxon.com/img_u/b/1500.jpg",
    pages: [
      "https://n.ziyouz.com/images/stories/books/mehrobdan_chayon_1.jpg",
      "https://n.ziyouz.com/images/stories/books/mehrobdan_chayon_2.jpg",
      "https://n.ziyouz.com/images/stories/books/mehrobdan_chayon_3.jpg"
    ]
  },
  "103": { 
    title: "Kecha va kunduz", author: "Cho'lpon", 
    image: "https://kitobxon.com/img_u/b/2034.jpg",
    pages: [
      "https://n.ziyouz.com/images/stories/books/kecha_va_kunduz_1.jpg",
      "https://n.ziyouz.com/images/stories/books/kecha_va_kunduz_2.jpg"
    ]
  },
  "104": { 
    title: "Yulduzli tunlar", author: "Pirimqul Qodirov", 
    image: "https://kitobxon.com/img_u/b/2012.jpg",
    pages: [
      "https://n.ziyouz.com/images/stories/books/yulduzli_tunlar_1.jpg",
      "https://n.ziyouz.com/images/stories/books/yulduzli_tunlar_2.jpg"
    ]
  },
  "105": { 
    title: "Dunyoning ishlari", author: "O'tkir Hoshimov", 
    image: "https://kitobxon.com/img_u/b/814.jpg",
    pages: ["https://n.ziyouz.com/images/stories/books/dunyoning_ishlari_1.jpg"]
  },
  "default": { 
    title: "Kitob", author: "Muallif", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "https://via.placeholder.com/600x800/2a3441/ffffff?text=Mundarija",
      "https://via.placeholder.com/600x800/2a3441/ffffff?text=Kirish+qismi",
      "https://via.placeholder.com/600x800/2a3441/ffffff?text=Birinchi+bob"
    ]
  }
};

export default function PreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetchApi(`/books/${id}/`);
        const fb = FALLBACK_BOOKS[id] || FALLBACK_BOOKS["default"];
        if (res.ok) {
          const data = await res.json();
          setBook({ ...fb, ...data, pages: fb.pages });
        } else {
          setBook(fb);
        }
      } catch (err) {
        setBook(FALLBACK_BOOKS[id] || FALLBACK_BOOKS["default"]);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;

  const pages = book.pages || [];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setShowOverlay(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="preview-page animate-fade">
      <div className="top-nav">
        <button className="btn-back" onClick={() => router.back()}>← Orqaga</button>
        <div className="book-top-info">
          <h3>{book.title}</h3>
          <span>{book.author}</span>
        </div>
      </div>

      <div className="preview-container">
        <div className="page-viewer glass-panel">
          <div className="page-display">
            <img 
              src={pages[currentPage]} 
              alt={`Page ${currentPage + 1}`} 
              className="page-img" 
              onError={(e) => e.target.src = "https://via.placeholder.com/600x800/1e293b/ffffff?text=Sahifa+yuklanmoqda..."}
            />
            
            {showOverlay && (
              <div className="overlay-lock animate-fade">
                <div className="lock-card glass-panel">
                  <h3>📖 Kitobni to'liq o'qing</h3>
                  <p>Preview tugadi. Davomini o'qish uchun ro'yxatdan o'ting.</p>
                  <button className="btn-primary" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                </div>
              </div>
            )}
          </div>

          <div className="viewer-footer">
            <button className="nav-btn" onClick={handlePrev} disabled={currentPage === 0}>Oldingi</button>
            <div className="page-indicator">
              Sahifa <span>{currentPage + 1}</span> / {pages.length}
            </div>
            <button className="nav-btn next" onClick={handleNext}>Keyingi</button>
          </div>
        </div>

        <div className="side-details glass-panel">
          <img src={book.image} alt="" className="side-cover" />
          <h4>Kitob tavsifi</h4>
          <p>{book.description || "Ushbu asar o'zbek adabiyotining eng sara namunalaridan biri hisoblanadi."}</p>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; }
        .book-top-info h3 { color: white; font-size: 1.1rem; margin-bottom: 2px; }
        .book-top-info span { color: #818cf8; font-size: 0.85rem; }

        .preview-container { display: grid; grid-template-columns: 1fr 320px; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 100px); }
        .page-viewer { display: flex; flex-direction: column; overflow: hidden; background: #1e293b; }
        .page-display { flex-grow: 1; position: relative; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; }
        .page-img { max-height: 100%; box-shadow: 0 15px 40px rgba(0,0,0,0.5); border-radius: 4px; transition: 0.4s; }
        
        .viewer-footer { background: rgba(0,0,0,0.3); padding: 12px; display: flex; align-items: center; justify-content: center; gap: 30px; }
        .nav-btn { background: rgba(255,255,255,0.08); border: none; color: white; padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .nav-btn:hover:not(:disabled) { background: #818cf8; }
        .nav-btn:disabled { opacity: 0.2; }
        .page-indicator { color: white; font-size: 0.9rem; }
        .page-indicator span { font-weight: 800; color: #818cf8; }

        .side-details { padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; }
        .side-cover { width: 100%; border-radius: 10px; }
        .side-details h4 { color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
        .side-details p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.6; }

        .overlay-lock { position: absolute; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .lock-card { padding: 40px; text-align: center; color: white; max-width: 350px; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        
        @media (max-width: 900px) {
          .preview-container { grid-template-columns: 1fr; }
          .side-details { display: none; }
        }
      `}</style>
    </div>
  );
}
