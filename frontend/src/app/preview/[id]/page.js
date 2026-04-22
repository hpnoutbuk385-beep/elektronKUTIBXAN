"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", 
    description: "O'zbek adabiyotining durdonasi. Kumush va Otabekning muhabbati haqida.", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: ["/otkan_kunlar_page_1_1776854793090.png", "https://n.ziyouz.com/images/stories/books/otgan_kunlar_2.jpg", "https://n.ziyouz.com/images/stories/books/otgan_kunlar_3.jpg"]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", 
    description: "Anvar va Ra'noning pokiza muhabbati haqida tarixiy asar.", 
    image: "https://kitobxon.com/img_u/b/1500.jpg",
    pages: ["https://n.ziyouz.com/images/stories/books/mehrobdan_chayon_1.jpg", "https://n.ziyouz.com/images/stories/books/mehrobdan_chayon_2.jpg"]
  },
  "default": { 
    title: "Kitob nomi", author: "Muallif", 
    description: "Ushbu kitob mazmuni bilan bu yerda tanishishingiz mumkin.", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: ["https://via.placeholder.com/600x800?text=Sahifa+1", "https://via.placeholder.com/600x800?text=Sahifa+2"]
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
        if (res.ok) {
          const data = await res.json();
          // Backendda sahifalar bo'lmasa, fallback ishlatamiz
          const fb = FALLBACK_BOOKS[id] || FALLBACK_BOOKS["default"];
          setBook({ ...fb, ...data, pages: fb.pages });
        } else {
          setBook(FALLBACK_BOOKS[id] || FALLBACK_BOOKS["default"]);
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
      </div>

      <div className="preview-container">
        <div className="book-details-side glass-panel">
          <div className="book-header-info">
            <img src={book.image} alt="" className="preview-cover" />
            <h2 className="preview-title">{book.title}</h2>
            <p className="preview-author">{book.author}</p>
          </div>
          <div className="book-description-box">
            <h4 className="desc-label">Kitob haqida:</h4>
            <p className="desc-text">{book.description}</p>
          </div>
        </div>

        <div className="pdf-viewer-side glass-panel">
          <div className="page-slider">
            <div className="page-content">
              <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className="page-image" />
              
              {showOverlay && (
                <div className="pdf-overlay animate-fade">
                  <div className="overlay-content glass-panel">
                    <h3>📖 Davomini o'qish</h3>
                    <p>To'liq versiyani o'qish uchun ro'yxatdan o'ting.</p>
                    <button className="btn-primary" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                  </div>
                </div>
              )}
            </div>

            <div className="slider-controls">
              <button className="ctrl-btn" onClick={handlePrev} disabled={currentPage === 0}>Oldingi</button>
              <span className="page-num">{currentPage + 1} / {pages.length}</span>
              <button className="ctrl-btn next" onClick={handleNext}>Keyingi</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 20px; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; }
        .preview-container { display: grid; grid-template-columns: 380px 1fr; gap: 20px; max-width: 1500px; margin: 15px auto 0; height: calc(100vh - 100px); }
        .book-details-side { padding: 30px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        .preview-cover { width: 100%; border-radius: 12px; margin-bottom: 15px; }
        
        .pdf-viewer-side { background: #1e293b; border-radius: 20px; overflow: hidden; position: relative; }
        .page-slider { height: 100%; display: flex; flex-direction: column; }
        .page-content { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; }
        .page-image { max-width: 100%; max-height: 100%; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: 0.5s; }
        
        .slider-controls { background: rgba(0,0,0,0.4); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 20px; }
        .ctrl-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .ctrl-btn:hover:not(:disabled) { background: #818cf8; }
        .ctrl-btn:disabled { opacity: 0.3; cursor: default; }
        .page-num { color: white; font-weight: 600; }
        
        .pdf-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .overlay-content { padding: 40px; text-align: center; color: white; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
      `}</style>
    </div>
  );
}
