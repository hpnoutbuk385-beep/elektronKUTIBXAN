"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const FALLBACK_BOOKS = {
  "101": { title: "O'tkan kunlar", author: "Abdulla Qodiriy", description: "O'zbek adabiyotining durdonasi. Kumush va Otabekning fojiaviy muhabbati va Turkistonning og'ir damlari haqida.", image: "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg", file: "https://www.afisha.uz/pdf/otkan_kunlar.pdf" },
  "102": { title: "Mehrobdan chayon", author: "Abdulla Qodiriy", description: "Anvar va Ra'noning pokiza muhabbati, diniy ulamolar orasidagi ziddiyatlar va adolat haqida tarixiy asar.", image: "https://images.uzum.uz/cl9v5klennt1543387sg/original.jpg", file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20Mehrobdan%20chayon%20(roman).pdf" },
  "103": { title: "Kecha va kunduz", author: "Cho'lpon", description: "Milliy uyg'onish davri adabiyotining eng yirik asarlaridan biri. Mustamlaka davri hayoti va inson taqdiri.", image: "https://images.uzum.uz/cl9v765ennt1543387ug/original.jpg", file: null },
  "default": { title: "Kitob nomi", author: "Muallif", description: "Ushbu kitob mazmuni bilan bu yerda tanishishingiz mumkin.", image: "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg", file: null }
};

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

    const timer = setTimeout(() => setShowOverlay(true), 60000); 
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;

  return (
    <div className="preview-page animate-fade">
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
          {book.file ? (
            <div className="pdf-wrapper">
              <iframe src={`${book.file}#toolbar=0&navpanes=0&page=1`} width="100%" height="100%" style={{ border: 'none' }}></iframe>
              {showOverlay && (
                <div className="pdf-overlay animate-fade">
                  <div className="overlay-content glass-panel">
                    <h3>📖 Davomini o'qish</h3>
                    <p>Kitobni to'liq o'qish uchun ro'yxatdan o'ting.</p>
                    <button className="btn-primary" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-file-msg">
              <span className="icon">📄</span>
              <p>Elektron fayl admin tomonidan yuklanmoqda...</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 20px; }
        .preview-container { display: grid; grid-template-columns: 380px 1fr; gap: 20px; max-width: 1500px; margin: 0 auto; height: calc(100vh - 40px); }
        .book-details-side { padding: 30px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        .preview-cover { width: 100%; border-radius: 12px; }
        .preview-title { font-size: 1.4rem; color: white; font-weight: 800; }
        .pdf-viewer-side { background: white; border-radius: 20px; overflow: hidden; position: relative; }
        .pdf-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .overlay-content { padding: 40px; text-align: center; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
      `}</style>
    </div>
  );
}
