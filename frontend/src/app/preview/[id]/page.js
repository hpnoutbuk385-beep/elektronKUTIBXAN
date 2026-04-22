"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146c8233f2a8.jpg", file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20O'tgan%20kunlar%20(roman).pdf", pages: ["1264-inchi hijriya, dalv oyining o'ninchisi...", "Kumushbibi o'z xonasida o'tirib...", "Otabek va Kumushning uchrashuvi..."] },
  "102": { title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146c98f9a3d4.jpg", file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20Mehrobdan%20chayon%20(roman).pdf", pages: ["Xudoyorxon saroyidagi hiylalar...", "Ra'noning maktubi...", "Mehrob ichidagi sirlar..."] },
  "103": { title: "Kecha va kunduz", author: "Cho'lpon", image: "https://assets.asaxiy.uz/product/main_image/desktop/6075677943f25.jpg", file: "https://n.ziyouz.com/books/o_zbek_nasri/Cho'lpon%20-%20Kecha%20va%20kunduz.pdf", pages: ["Zebi o'zining yoshligi...", "Akbarali mingboshi saroyi...", "Ozodlik va zulmat kurashi..."] },
  "104": { title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://assets.asaxiy.uz/product/main_image/desktop/6131f79f8e43e.jpg", file: "https://n.ziyouz.com/books/o_zbek_nasri/Pirimqul%20Qodirov%20-%20Yulduzli%20tunlar%20(roman).pdf", pages: ["Bobur Mirzo taxtga o'tirishi...", "Yulduzli tunlarda Boburnoma...", "Vatan sog'inchi..."] },
  "105": { title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146cb148f3b2.jpg", pages: ["Onamning qo'llari...", "Qatog'on yillari...", "Onamning nasihati..."] },
  "106": { title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://assets.asaxiy.uz/product/main_image/desktop/60d4681604085.jpg", pages: ["Hoshimjonning sarguzashtlari...", "Sariq dev - dangasalik ramzi...", "Bolalik damlari..."] },
  "107": { title: "Atom odatlar", author: "James Clear", image: "https://assets.asaxiy.uz/product/main_image/desktop/6321d51c3a6e8.png", pages: ["Kichik o'zgarishlar...", "Odatlar shakllanishi...", "O'zlikni o'zgartirish..."] },
  "108": { title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://assets.asaxiy.uz/product/main_image/desktop/61543b8c3d8e5.jpg", pages: ["Moliyaviy savodxonlik...", "Aktiv va Passiv...", "Moliyaviy erkinlik..."] },
  "109": { title: "Diqqat", author: "Cal Newport", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146ce148f3b2.jpg", pages: ["Deep Work...", "Diqqat kamayishi...", "Unumdorlik siri..."] },
  "110": { title: "Psixologiya", author: "Darslik", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146d1148f3b2.jpg", pages: ["Psixologiya predmeti...", "Temperament va xarakter...", "O'smirlik davri..."] },
  "default": { title: "Kitob", author: "Muallif", image: "https://assets.asaxiy.uz/product/main_image/desktop/6146c8233f2a8.jpg", pages: ["Sahifa 1", "Sahifa 2"] }
};

export default function PreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);

    async function loadBook() {
      try {
        const res = await fetchApi(`/books/${id}/`);
        const fb = BOOK_CONTENT[id] || BOOK_CONTENT["default"];
        if (res.ok) {
          const data = await res.json();
          setBook({ ...fb, ...data, pages: fb.pages, description: fb.description });
        } else {
          setBook(fb);
        }
      } catch (err) {
        setBook(BOOK_CONTENT[id] || BOOK_CONTENT["default"]);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  if (loading) return <div className="preview-loading">Yuklanmoqda...</div>;

  const pages = book.pages || [];
  const fullPdfUrl = book.file ? `https://docs.google.com/viewer?url=${encodeURIComponent(book.file)}&embedded=true` : null;

  return (
    <div className="preview-page animate-fade">
      <div className="top-nav">
        <button className="btn-back" onClick={() => router.back()}>← Orqaga</button>
        <div className="book-top-info">
          <h3>{book.title} {isAuth && <span className="full-badge">✅ To'liq versiya</span>}</h3>
          <span>{book.author}</span>
        </div>
      </div>

      <div className="preview-container">
        <div className="page-viewer">
          {isAuth && fullPdfUrl ? (
            <div className="full-reader-wrap">
              <iframe src={fullPdfUrl} width="100%" height="100%" style={{ border: 'none' }}></iframe>
            </div>
          ) : (
            <div className="text-page-wrapper">
              <div className="page-stack">
                <div className="stack-layer layer-3"></div>
                <div className="stack-layer layer-2"></div>
                <div className="page-paper-real animate-slide-up">
                  <div className="paper-header">
                    <span className="book-name-mini">{book.title}</span>
                    <span className="page-count-mini">{currentPage + 1}</span>
                  </div>
                  <div className="paper-content">
                    <p className="page-text-real">{pages[currentPage]}</p>
                  </div>
                  <div className="paper-footer">
                    <div className="footer-line"></div>
                    <span className="author-name-mini">{book.author}</span>
                  </div>
                  {showOverlay && (
                    <div className="overlay-lock-modern animate-fade">
                      <div className="lock-card-modern glass-panel">
                        <div className="lock-icon">🔒</div>
                        <h3>Kitobni to'liq o'qing</h3>
                        <p>Barcha 100+ sahifalarni o'qish uchun ro'yxatdan o'ting.</p>
                        <button className="btn-primary-modern" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isAuth && (
            <div className="viewer-footer">
              <button className="nav-btn-modern" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>← Oldingi</button>
              <div className="page-indicator">Sahifa <span>{currentPage + 1}</span> / {pages.length}</div>
              <button className="nav-btn-modern next" onClick={() => (currentPage < pages.length - 1 ? setCurrentPage(prev => prev + 1) : setShowOverlay(true))}>Keyingi →</button>
            </div>
          )}
        </div>

        <div className="side-panel-modern glass-panel">
          <img 
            src={book.image} 
            alt="" 
            className="side-cover-img"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x450/1e293b/ffffff?text=Book+Cover"; }} 
          />
          <div className="side-desc-wrap">
            <h4>Batafsil Tavsif</h4>
            <p className="side-desc-text">{book.description || "Ushbu asar o'zbek adabiyotining eng sara namunalaridan biri hisoblanadi."}</p>
            {!isAuth && (
              <button className="btn-primary-modern borrow-btn-large" onClick={() => router.push('/register')}>
                📖 Kitobni ijaraga olish
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #0f172a; min-height: 100vh; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 10px 20px; border-radius: 12px; cursor: pointer; }
        .preview-container { display: grid; grid-template-columns: 1fr 380px; gap: 30px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; }
        .page-viewer { display: flex; flex-direction: column; background: #1e293b; border-radius: 20px; overflow: hidden; }
        .text-page-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; }
        .page-stack { position: relative; width: 100%; max-width: 500px; aspect-ratio: 3/4.2; }
        .stack-layer { position: absolute; inset: 0; background: #fdf6e3; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
        .page-paper-real { position: absolute; inset: 0; background: #fdf6e3; padding: 60px 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 4px; display: flex; flex-direction: column; }
        .page-text-real { color: #1a202c; font-size: 1.25rem; line-height: 1.9; font-family: 'Lora', serif; text-align: justify; }
        .viewer-footer { background: rgba(0,0,0,0.3); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 40px; }
        .nav-btn-modern { background: #818cf8; border: none; color: white; padding: 10px 25px; border-radius: 12px; cursor: pointer; font-weight: 700; }
        .side-panel-modern { padding: 30px; border-radius: 24px; overflow-y: auto; }
        .side-cover-img { width: 100%; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .side-desc-text { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.7; margin-bottom: 25px; }
        .overlay-lock-modern { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .lock-card-modern { padding: 40px; text-align: center; color: white; max-width: 380px; }
        .preview-loading { background: #0f172a; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        @media (max-width: 1100px) { .preview-container { grid-template-columns: 1fr; } .side-panel-modern { display: none; } }
      `}</style>
    </div>
  );
}
