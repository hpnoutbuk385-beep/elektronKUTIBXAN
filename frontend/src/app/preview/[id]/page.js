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

    // 10 soniyadan keyin yoki foydalanuvchi "o'qishni boshlaganda" registratsiya oynasini chiqarish
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 15000); // 15 soniya tanishish uchun vaqt

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;
  if (!book) return <div>Kitob topilmadi</div>;

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h2>{book.title} — Tanishuv versiyasi</h2>
        <p>Siz hozirda kitobning birinchi 3 sahifasi bilan tanishishingiz mumkin.</p>
      </div>

      <div className="pdf-viewer">
        {book.file ? (
          <iframe 
            src={`${book.file}#page=1`} 
            width="100%" 
            height="800px"
            title="Preview"
          ></iframe>
        ) : (
          <div className="no-file">PDF fayl topilmadi</div>
        )}
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
        .preview-page { background: #020617; min-height: 100vh; color: white; padding: 40px; }
        .preview-header { text-align: center; margin-bottom: 30px; }
        .preview-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
        .preview-header p { color: rgba(255,255,255,0.5); }

        .pdf-viewer { 
          max-width: 900px; margin: 0 auto; border-radius: 12px; overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.1); background: white;
        }

        .overlay-modal { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); 
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content { padding: 40px; text-align: center; max-width: 450px; }
        .modal-content h3 { font-size: 1.5rem; margin-bottom: 15px; }
        .modal-content p { color: rgba(255,255,255,0.7); margin-bottom: 25px; }
        
        .modal-btns { display: flex; gap: 15px; justify-content: center; }
        .btn-close { background: none; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 20px; border-radius: 10px; cursor: pointer; }
        
        .preview-loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; }
      `}</style>
    </div>
  );
}
