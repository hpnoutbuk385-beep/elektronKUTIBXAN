"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    description: "Abdulla Qodiriyning 'O'tkan kunlar' romani o'zbek adabiyoti tarixidagi birinchi roman hisoblanadi. Asarda XIX asr o'rtalaridagi Turkiston hayoti, o'sha davrdagi siyosiy nizolar va fojiaviy muhabbat qissasi mohirona bayon etilgan.",
    pages: ["1264-inchi hijriya, dalv oyining o'ninchisi, Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi...", "Kumushbibi o'z xonasida o'tirib, Marg'ilondan kelgan bu kutilmagan mehmon haqida o'ylardi...", "Otabek va Kumushning uchrashuvi. Bu uchrashuv nafaqat ikki yoshning taqdirini o'zgartirdi."]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg",
    description: "Ushbu asarda yozuvchi Xudoyorxon davridagi saroy hayoti, u yerdagi fitnalar va adolatsizliklarni fosh etadi. Roman markazida Anvar va Ra'no ismli ikki yoshning pokiza muhabbati turadi.",
    pages: ["Xudoyorxon saroyidagi hiylalar va fitnalar. Anvar o'zining pokligi bilan yashashga intilar edi...", "Ra'noning maktubi. 'Sizga bo'lgan ishonchim hech qachon so'nmaydi, Anvar'...", "Mehrob ichidagi sirlar fosh bo'la boshladi."]
  },
  "103": { 
    title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg",
    description: "Cho'lponning bu asari jadid adabiyotining eng yirik namunalaridan biridir. Romanda mustamlaka davridagi Turkiston ijtimoiy hayoti, ayollar huquqsizligi va xalqning uyg'onish jarayoni tasvirlangan.",
    pages: ["Zebi o'zining yoshligi va go'zalligi bilan hayotdan katta umidlar qilar edi...", "Akbarali mingboshi saroyidagi hayot...", "Ozodlik va zulmat o'rtasidagi kurash."]
  },
  "104": { 
    title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg",
    description: "Bu tarixiy roman Zahiriddin Muhammad Boburning murakkab hayoti va faoliyatiga bag'ishlangan. Muallif Boburni nafaqat shoh va sarkarda, balki vatan sog'inchi bilan yonayotgan hassos shoir sifatida tasvirlaydi.",
    pages: ["Bobur Mirzo o'zining o'n ikki yoshida taxtga o'tirdi. Farg'onani tark etish og'ir edi...", "Yulduzli tunlarda Bobur o'zining 'Boburnoma' asarini yozishni boshladi...", "Afg'oniston va Hindiston sari yurishlar."]
  },
  "105": { 
    title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg",
    description: "O'tkir Hoshimovning ushbu asari insoniylik, mehr-oqibat va eng asosiysi - onaga bo'lgan cheksiz muhabbat haqidadir. Kitob bir nechta turkum hikoyalardan iborat.",
    pages: ["Onamning qo'llari har doim tandir isi bilan anqib turardi...", "Qatog'on yillari va urush davri odamlarining matonati...", "Onamning har bir nasihati men uchun hayot darsi bo'ldi."]
  },
  "106": { 
    title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg",
    description: "Bu asar o'zbek bolalar adabiyotining eng mashhur namunasi bo'lib, u ko'plab tillarga tarjima qilingan. Soddadil va sho'x Hoshimjonning sarguzashtlari orqali yozuvchi bolalarni dangasalikdan qochishga chorlaydi.",
    pages: ["Hoshimjonning sarguzashtlari. Sehrli sholcha bilan osmonga uchish...", "Sariq dev - bu insonning dangasaligi ustidan g'alabasi ramzi...", "Bolalikning beg'ubor damlari."]
  },
  "107": { 
    title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg",
    description: "James Clear o'zining ushbu jahon bestsellerida kichik o'zgarishlar qanday qilib ulkan natijalarga olib kelishini isbotlab beradi. 'Atom odatlar' - bu murakkab foizlar kabi to'planib boradigan kichik qadamlar haqida.",
    pages: ["Kichik o'zgarishlar - katta natijalar. Har kuni 1% yaxshilanish...", "Odatlarni shakllantirishning to'rt bosqichi...", "O'zlikni o'zgartirish odatlarni o'zgartirishdan boshlanadi."]
  },
  "108": { 
    title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://kitobxon.com/img_u/b/4836.jpg",
    description: "Robert Kiyosaki bu kitobda moliyaviy savodxonlikning sirlari bilan bo'lishadi. Aktivlar va passivlar orasidagi farqni tushunish boylikka olib boradigan birinchi qadamdir.",
    pages: ["Moliyaviy savodxonlik - boy bo'lishning asosi...", "Aktiv va Passiv farqi. Aktivlar cho'ntagingizga pul olib keladi...", "Moliyaviy erkinlikka erishish uchun jasorat va bilim kerak."]
  },
  "109": { 
    title: "Diqqat", author: "Cal Newport", image: "https://kitobxon.com/img_u/b/6169.jpg",
    description: "Chalg'ituvchi texnologiyalar davrida diqqatni bir joyga jamlash eng noyob mahoratga aylandi. Cal Newport 'Deep Work' konsepsiyasi orqali sifatli natijaga erishishni o'rgatadi.",
    pages: ["Deep Work - bu muvaffaqiyatga erishishning yagona yo'lidir...", "Diqqatni jamlash qobiliyati kamayib bormoqda...", "Kunlik rejalashtirish yuqori unumdorlikning siridir."]
  },
  "110": { 
    title: "Psixologiya", author: "Darslik", image: "https://kitobxon.com/img_u/b/402.jpg",
    description: "Bu darslik psixologiya fanining asosiy tushunchalari, inson ruhiyatining shakllanishi va ijtimoiy munosabatlar psixologiyasini o'rganadi.",
    pages: ["Psixologiya fanining predmeti va vazifalari...", "Shaxs temperamenti va xarakteri...", "O'smirlik davri psixologiyasi."]
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
        const fb = BOOK_CONTENT[id] || BOOK_CONTENT["101"];
        if (res.ok) {
          const data = await res.json();
          setBook({ ...fb, ...data, pages: fb.pages, description: fb.description });
        } else {
          setBook(fb);
        }
      } catch (err) {
        setBook(BOOK_CONTENT[id] || BOOK_CONTENT["101"]);
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
        <div className="page-viewer">
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
                  <div className="paper-texture"></div>
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
                      <h3>Davomini o'qing</h3>
                      <p>Ushbu kitobning to'liq versiyasini o'qish uchun ro'yxatdan o'ting.</p>
                      <button className="btn-primary-modern" onClick={() => router.push("/register")}>Ro'yxatdan o'tish</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="viewer-controls">
            <button className="nav-btn-modern" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>← Oldingi</button>
            <div className="progress-bar-wrap"><div className="progress-fill" style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}></div></div>
            <button className="nav-btn-modern next" onClick={handleNext}>Keyingi →</button>
          </div>
        </div>
        <div className="side-panel-modern glass-panel">
          <div className="side-cover-wrap"><img src={book.image} alt="" className="side-cover-img" /></div>
          <div className="side-desc-wrap">
            <h4>Batafsil Tavsif</h4>
            <p className="side-desc-text">{book.description}</p>
            
            <button className="btn-primary-modern borrow-btn-large" onClick={() => router.push('/register')}>
              📖 Kitobni ijaraga olish
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #0f172a; min-height: 100vh; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; font-weight: 600; }
        .btn-back:hover { background: rgba(255,255,255,0.1); transform: translateX(-5px); }
        .book-top-info h3 { color: white; font-size: 1.2rem; }
        .book-top-info span { color: #818cf8; font-size: 0.9rem; }
        .preview-container { display: grid; grid-template-columns: 1fr 380px; gap: 30px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 120px); }
        .page-viewer { display: flex; flex-direction: column; gap: 20px; }
        .text-page-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; }
        .page-stack { position: relative; width: 100%; max-width: 550px; aspect-ratio: 3/4.2; }
        .stack-layer { position: absolute; inset: 0; background: #fdf6e3; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
        .layer-3 { transform: translate(6px, 6px); }
        .layer-2 { transform: translate(3px, 3px); }
        .page-paper-real { position: absolute; inset: 0; background: #fdf6e3; padding: 60px 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
        .paper-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; opacity: 0.5; }
        .book-name-mini { font-size: 0.75rem; font-family: serif; color: #2c3e50; }
        .page-count-mini { font-size: 0.8rem; font-family: serif; color: #2c3e50; }
        .paper-content { flex-grow: 1; position: relative; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.08; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text-real { color: #1a202c; font-size: 1.25rem; line-height: 1.9; font-family: 'Lora', 'Georgia', serif; text-align: justify; z-index: 1; margin: 0; height: 100%; hyphens: auto; }
        .paper-footer { margin-top: 30px; text-align: center; opacity: 0.4; }
        .footer-line { height: 1px; background: rgba(0,0,0,0.05); margin-bottom: 10px; }
        .author-name-mini { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #2c3e50; }
        .viewer-controls { display: flex; align-items: center; gap: 20px; padding: 0 20px; }
        .nav-btn-modern { background: #818cf8; border: none; color: white; padding: 12px 30px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .nav-btn-modern:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(129, 140, 248, 0.4); }
        .nav-btn-modern:disabled { opacity: 0.2; }
        .progress-bar-wrap { flex-grow: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: #818cf8; transition: 0.5s; }
        .side-panel-modern { padding: 30px; border-radius: 24px; display: flex; flex-direction: column; gap: 25px; overflow-y: auto; }
        .side-cover-img { width: 100%; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .side-desc-wrap h4 { color: white; font-size: 1.3rem; margin-bottom: 15px; border-left: 4px solid #818cf8; padding-left: 15px; }
        .side-desc-text { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.7; text-align: justify; white-space: pre-line; margin-bottom: 25px; }
        .borrow-btn-large { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); width: 100%; padding: 16px; border-radius: 15px; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
        .overlay-lock-modern { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .lock-card-modern { padding: 40px; text-align: center; color: white; max-width: 380px; border-radius: 30px; }
        .lock-icon { font-size: 3rem; margin-bottom: 20px; }
        .btn-primary-modern { background: #818cf8; color: white; border: none; padding: 14px 30px; border-radius: 15px; font-weight: 700; width: 100%; margin-top: 20px; cursor: pointer; transition: 0.3s; }
        .preview-loading { background: #0f172a; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        @media (max-width: 1100px) { .preview-container { grid-template-columns: 1fr; } .side-panel-modern { display: none; } }
      `}</style>
    </div>
  );
}
