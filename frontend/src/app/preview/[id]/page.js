"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function PreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetchApi(`/books/${id}/`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBook();

    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 20000); // 20 soniya tanishish uchun

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;
  if (!book) return <div>Kitob topilmadi</div>;

  return (
    <div className="preview-page animate-fade">
      <div className="preview-container">
        {/* Chap taraf: Kitob haqida ma'lumot */}
        <div className="book-details-side glass-panel">
          <div className="book-header-info">
            <img src={book.image || "/book-placeholder.png"} alt={book.title} className="preview-cover" />
            <h2 className="preview-title">{book.title}</h2>
            <p className="preview-author">{book.author}</p>
          </div>
          
          <div className="book-description-box">
            <h4 className="desc-label">Kitob haqida:</h4>
            <p className="desc-text">{book.description || "Ushbu kitob uchun tavsif hali qo'shilmagan."}</p>
          </div>

          <div className="preview-info-alert">
            💡 Siz hozirda kitobning birinchi 3 sahifasi bilan tanishishingiz mumkin.
          </div>
        </div>

        {/* O'ng taraf: PDF Viewer */}
        <div className="pdf-viewer-side glass-panel">
          {book.file ? (
            <iframe 
              src={`${book.file}#page=1`} 
              width="100%" 
              height="100%"
              style={{ border: 'none', borderRadius: '12px' }}
              title="Preview"
            ></iframe>
          ) : (
            <div className="no-file-msg">
              <span className="icon">📄</span>
              <p>Elektron fayl mavjud emas, lekin yuqoridagi tavsif orqali kitob bilan tanishishingiz mumkin.</p>
            </div>
          )}
        </div>
      </div>

      {showOverlay && (
        <div className="overlay-modal animate-fade">
          <div className="modal-content glass-panel">
            <h3>📖 Davomini o'qishni xohlaysizmi?</h3>
            <p>Kitobning to'liq versiyasini o'qish va "Mening kitoblarim"ga qo'shish uchun ro'yxatdan o'ting.</p>
            <div className="modal-btns">
              <button 
                className="btn-primary" 
                onClick={() => {
                  localStorage.setItem("pending_book_id", id);
                  router.push("/register");
                }}
              >
                Ro'yxatdan o'tish
              </button>
              <button className="btn-close" onClick={() => window.close()}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 40px; }
        .preview-container { display: grid; grid-template-columns: 350px 1fr; gap: 30px; max-width: 1400px; margin: 0 auto; height: 85vh; }
        
        .book-details-side { padding: 30px; display: flex; flex-direction: column; gap: 25px; overflow-y: auto; }
        .preview-cover { width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px; }
        .preview-title { font-size: 1.5rem; color: white; font-weight: 800; }
        .preview-author { color: #818cf8; font-weight: 600; font-size: 1rem; }
        
        .desc-label { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .desc-text { color: rgba(255,255,255,0.8); line-height: 1.6; font-size: 0.95rem; }
        
        .preview-info-alert { 
          margin-top: auto; padding: 15px; background: rgba(129, 140, 248, 0.1); 
          border-radius: 12px; font-size: 0.85rem; color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.2);
        }

        .pdf-viewer-side { position: relative; overflow: hidden; background: white; }
        .no-file-msg { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; padding: 40px; text-align: center; background: #f8fafc; }
        .no-file-msg .icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.2; }

        .overlay-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { padding: 40px; text-align: center; max-width: 450px; }
        .modal-btns { display: flex; gap: 15px; justify-content: center; margin-top: 25px; }
        .btn-close { background: none; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 20px; border-radius: 10px; cursor: pointer; }

        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
        
        @media (max-width: 1024px) {
          .preview-container { grid-template-columns: 1fr; height: auto; }
          .pdf-viewer-side { height: 600px; }
        }
      `}</style>
    </div>
  );
}
