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

    // 30 soniyadan keyin PDF bloklanadi, lekin tavsif (chap taraf) ochiq qoladi
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 30000); 

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;
  if (!book) return <div>Kitob topilmadi</div>;

  return (
    <div className="preview-page animate-fade">
      <div className="preview-container">
        {/* Chap taraf: Har doim ochiq (Registratsiya buni to'smaydi) */}
        <div className="book-details-side glass-panel">
          <div className="book-header-info">
            <img src={book.image || "/book-placeholder.png"} alt={book.title} className="preview-cover" />
            <h2 className="preview-title">{book.title}</h2>
            <p className="preview-author">{book.author}</p>
          </div>
          
          <div className="book-description-box">
            <h4 className="desc-label">Kitob haqida:</h4>
            <p className="desc-text">{book.description || "Ushbu kitob o'zbek adabiyotining sara asarlaridan biri hisoblanadi."}</p>
          </div>

          <div className="preview-info-alert">
            💡 Kitob mazmuni bilan tanishib chiqing. To'liq o'qish uchun ijaraga olishingiz mumkin.
          </div>
        </div>

        {/* O'ng taraf: PDF Viewer (Faqat shu qism bloklanishi mumkin) */}
        <div className="pdf-viewer-side glass-panel">
          {book.file ? (
            <div className="pdf-wrapper">
              <iframe 
                src={`${book.file}#page=1`} 
                width="100%" 
                height="100%"
                style={{ border: 'none' }}
                title="Preview"
              ></iframe>
              
              {showOverlay && (
                <div className="pdf-overlay animate-fade">
                  <div className="overlay-content glass-panel">
                    <h3>📖 Davomini o'qish</h3>
                    <p>Kitobning qolgan sahifalarini o'qish uchun ro'yxatdan o'ting.</p>
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        localStorage.setItem("pending_book_id", id);
                        router.push("/register");
                      }}
                    >
                      Ro'yxatdan o'tish
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-file-msg">
              <span className="icon">📄</span>
              <p>Elektron fayl yuklanmoqda yoki mavjud emas.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 20px; }
        .preview-container { 
          display: grid; 
          grid-template-columns: 380px 1fr; 
          gap: 20px; 
          max-width: 1500px; 
          margin: 0 auto; 
          height: calc(100vh - 40px);
        }
        
        .book-details-side { padding: 30px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        .preview-cover { width: 100%; border-radius: 12px; margin-bottom: 15px; }
        .preview-title { font-size: 1.4rem; color: white; font-weight: 800; }
        .preview-author { color: #818cf8; font-weight: 600; }
        .desc-text { color: rgba(255,255,255,0.7); line-height: 1.6; font-size: 0.95rem; }
        
        .pdf-viewer-side { background: white; border-radius: 20px; overflow: hidden; position: relative; }
        .pdf-wrapper { width: 100%; height: 100%; position: relative; }
        
        .pdf-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        
        .overlay-content { padding: 40px; text-align: center; max-width: 350px; }
        .overlay-content h3 { margin-bottom: 10px; color: white; }
        .overlay-content p { color: rgba(255,255,255,0.6); margin-bottom: 20px; }

        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        
        @media (max-width: 1024px) {
          .preview-container { grid-template-columns: 1fr; height: auto; }
          .pdf-viewer-side { height: 500px; }
        }
      `}</style>
    </div>
  );
}
