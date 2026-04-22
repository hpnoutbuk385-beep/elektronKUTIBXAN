"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "1264-inchi hijriya, dalv oyining o'ninchisi, qishki kunlarning biri, quyosh botqan, ufqda qizil shafaq ko'ringan bir vaqtda Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi...",
      "Otabek otidan tushib, do'kondor bilan so'rashdi. Uning ko'zlarida qandaydir bir g'amginlik, ammo shu bilan birga qat'iyat bor edi. Marg'ilondan kelgan bu yosh yigitning taqdiri hali o'zi bilmagan holda buyuk muhabbatga bog'lanib bo'lgan edi...",
      "Kumushbibi o'z xonasida o'tirib, derazadan tashqariga boqar ekan, ko'nglida bir g'ashlik bor edi. Bu g'ashlik balki kutilayotgan baxtning, balki kelajakdagi fojianing darakchisi edi..."
    ]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", 
    image: "https://kitobxon.com/img_u/b/1500.jpg",
    pages: [
      "Xudoyorxon o'rdasi. Saroy ichidagi fitnalar va amaldorlarning bir-biriga bo'lgan adovati avjiga chiqqan. Anvar o'zining pok niyati bilan bu muhitda yashashga harakat qilar edi...",
      "Ra'no o'z otasining do'sti bo'lgan amaldorning hiylasidan bexabar, Anvarni kutar edi. Ular o'rtasidagi munosabat nafaqat muhabbat, balki sadoqat va adolat timsoli edi..."
    ]
  },
  "107": { 
    title: "Atom odatlar", author: "James Clear", 
    image: "https://kitobxon.com/img_u/b/6146.jpg",
    pages: [
      "Odatlar - bu shaxsiy o'sishning murakkab foizidir. Agar siz har kuni 1 foizga yaxshilanib borsangiz, bir yildan so'ng siz 37 barobar yaxshi natijaga erishasiz...",
      "Kichik odatlarning kuchi ularning takrorlanishidadir. Sizning natijalaringiz sizning odatlaringizning kechikkan ko'rsatkichidir. Boyligingiz - moliyaviy odatlaringiz natijasi..."
    ]
  },
  "default": { 
    title: "Kitob", author: "Muallif", 
    image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "Ushbu kitobning birinchi sahifasi. Bu yerda asarning kirish qismi va asosiy g'oyalari bayon etiladi. Kitobxonni qiziqarli sarguzashtlar kutmoqda...",
      "Ikkinchi sahifa. Voqealar rivoji davom etadi. Qahramonlar o'z maqsadlari yo'lida turli to'siqlarga duch keladilar. Asar o'zining falsafiy chuqurligi bilan ajralib turadi..."
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
        const fb = BOOK_CONTENT[id] || BOOK_CONTENT["default"];
        if (res.ok) {
          const data = await res.json();
          setBook({ ...fb, ...data, pages: fb.pages });
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

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setShowOverlay(true);
    }
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
          <div className="text-page-content">
            <div className="page-paper animate-slide-up">
              <div className="paper-texture"></div>
              <p className="page-text">{pages[currentPage]}</p>
              <div className="page-footer-num">- {currentPage + 1} -</div>
            </div>
            
            {showOverlay && (
              <div className="overlay-lock animate-fade">
                <div className="lock-card glass-panel">
                  <h3>📖 Davomini o'qish</h3>
                  <p>Preview tugadi. To'liq versiyani o'qish uchun ro'yxatdan o'ting.</p>
                  <button className="btn-primary" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                </div>
              </div>
            )}
          </div>

          <div className="viewer-footer">
            <button className="nav-btn" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>Oldingi</button>
            <div className="page-indicator">Sahifa <span>{currentPage + 1}</span> / {pages.length}</div>
            <button className="nav-btn next" onClick={handleNext}>Keyingi</button>
          </div>
        </div>

        <div className="side-details glass-panel">
          <img src={book.image} alt="" className="side-cover" />
          <h4>Tavsif</h4>
          <p>{book.description || "Ushbu asar bilan tanishib chiqing. To'liq versiyada sizni yanada qiziqarli voqealar kutmoqda."}</p>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; }
        .book-top-info h3 { color: white; font-size: 1.1rem; }
        .book-top-info span { color: #818cf8; font-size: 0.85rem; }

        .preview-container { display: grid; grid-template-columns: 1fr 300px; gap: 20px; max-width: 1200px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 100px); }
        .page-viewer { display: flex; flex-direction: column; background: #1e293b; border-radius: 20px; overflow: hidden; }
        
        .text-page-content { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .page-paper { 
          background: #fdf6e3; width: 100%; max-width: 500px; aspect-ratio: 3/4; 
          padding: 50px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.4); 
          display: flex; flex-direction: column; justify-content: center;
        }
        .paper-texture { position: absolute; inset: 0; opacity: 0.05; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text { color: #2c3e50; font-size: 1.3rem; line-height: 1.8; font-family: 'Georgia', serif; text-align: justify; z-index: 1; }
        .page-footer-num { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; color: #7f8c8d; font-size: 0.9rem; }

        .viewer-footer { background: rgba(0,0,0,0.3); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 40px; }
        .nav-btn { background: #818cf8; border: none; color: white; padding: 8px 25px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .nav-btn:disabled { opacity: 0.2; }
        .page-indicator { color: white; }

        .side-details { padding: 20px; border-radius: 20px; overflow-y: auto; }
        .side-cover { width: 100%; border-radius: 10px; margin-bottom: 15px; }
        .side-details p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.5; }

        .overlay-lock { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .lock-card { padding: 40px; text-align: center; color: white; max-width: 350px; border-radius: 25px; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        
        @media (max-width: 800px) {
          .preview-container { grid-template-columns: 1fr; }
          .side-details { display: none; }
          .page-paper { padding: 30px; font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
