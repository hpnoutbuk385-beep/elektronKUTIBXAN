"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20O'tgan%20kunlar%20(roman).pdf",
    description: "Abdulla Qodiriyning 'O'tkan kunlar' romani o'zbek adabiyoti tarixidagi birinchi roman hisoblanadi. Asarda XIX asr o'rtalaridagi Turkiston hayoti, o'sha davrdagi siyosiy nizolar va fojiaviy muhabbat qissasi mohirona bayon etilgan.",
    pages: [
      "1264-inchi hijriya, dalv oyining o'ninchisi, qishki kunlarning biri, quyosh botqan, ufqda qizil shafaq ko'ringan bir vaqtda Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi. Bu yigit Otabek edi...",
      "Kumushbibi o'z xonasida o'tirib, Marg'ilondan kelgan bu kutilmagan mehmon haqida o'ylardi. Uning ko'zlarida qandaydir bir g'amginlik, ammo shu bilan birga qat'iyat bor edi.",
      "Otabek va Kumushning uchrashuvi. Bu uchrashuv nafaqat ikki yoshning taqdirini, balki butun Turkiston adabiyotining yo'nalishini o'zgartirdi..."
    ]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg",
    file: "https://n.ziyouz.com/books/o_zbek_nasri/Abdulla%20Qodiriy%20-%20Mehrobdan%20chayon%20(roman).pdf",
    description: "Ushbu asarda yozuvchi Xudoyorxon davridagi saroy hayoti, u yerdagi fitnalar va adolatsizliklarni fosh etadi. Roman markazida Anvar va Ra'no ismli ikki yoshning pokiza muhabbati turadi.",
    pages: [
      "Xudoyorxon saroyidagi hiylalar va fitnalar. Anvar o'zining pokligi bilan bu qora dunyoda yashashga intilar edi. Uning qalbi doimo adolat va haqiqat tomonda edi.",
      "Ra'noning maktubi. 'Sizga bo'lgan ishonchim hech qachon so'nmaydi, Anvar'. Bu so'zlar yigitga ulkan kuch bag'ishladi va uni saroydagi zulmga qarshi kurashga chorladi.",
      "Mehrob ichidagi sirlar fosh bo'la boshladi. Din pardasi ostidagi insoniy illatlar va Xudoyorxon davridagi ijtimoiy ziddiyatlar yaqqol namoyon bo'ldi."
    ]
  },
  "103": { 
    title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg",
    file: "https://n.ziyouz.com/books/o_zbek_nasri/Cho'lpon%20-%20Kecha%20va%20kunduz.pdf",
    description: "Cho'lponning bu asari jadid adabiyotining eng yirik namunalaridan biridir. Romanda mustamlaka davridagi Turkiston ijtimoiy hayoti, ayollar huquqsizligi va xalqning uyg'onish jarayoni tasvirlangan.",
    pages: [
      "Zebi o'zining yoshligi va go'zalligi bilan hayotdan katta umidlar qilar edi. Ammo taqdir o'yinlari uni kutilmagan ko'chalarga boshladi va hayotining mazmunini o'zgartirdi.",
      "Akbarali mingboshi saroyi. Bu yerda boylik va hokimiyat inson qadrini qanchalik pasaytirishi yaqqol ko'rinardi. Zebi bu yerda o'z erkinligidan butkul mahrum bo'lgan edi.",
      "Ozodlik va zulmat o'rtasidagi kurash. 'Kecha' o'tib, 'Kunduz' kelishi uchun hali ko'p qurbonlar berilishi va xalqning ongi uyg'onishi kerak edi."
    ]
  },
  "104": { 
    title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg",
    file: "https://n.ziyouz.com/books/o_zbek_nasri/Pirimqul%20Qodirov%20-%20Yulduzli%20tunlar%20(roman).pdf",
    description: "Bu tarixiy roman Zahiriddin Muhammad Boburning murakkab hayoti va faoliyatiga bag'ishlangan. Muallif Boburni nafaqat shoh, balki vatan sog'inchi bilan yonayotgan hassos shoir sifatida tasvirlaydi.",
    pages: [
      "Zahiriddin Muhammad Bobur Mirzo o'zining o'n ikki yoshida taxtga o'tirdi. Farg'ona vodiysining go'zal tabiatini va Andijonning iliq havosini tark etish uning uchun juda og'ir edi.",
      "Yulduzli tunlarda Bobur o'zining 'Boburnoma' asarini yozishni boshladi. Har bir satr vatan sog'inchi, vatan ishqi va uning tuprog'iga bo'lgan cheksiz armoni bilan to'la edi.",
      "Afg'oniston va Hindiston sari yurishlar. Bobur shoh bo'lish bilan birga, har doim o'zini g'arib va musofir his qilib yashadi. Uning qalbi har doim ona vataniga talpinardi."
    ]
  },
  "107": { 
    title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg",
    description: "James Clear kichik o'zgarishlar qanday qilib ulkan natijalarga olib kelishini isbotlab beradi. 'Atom odatlar' - bu murakkab foizlar kabi to'planib boradigan kichik qadamlar haqida.",
    pages: [
      "Kichik o'zgarishlar - katta natijalar. Har kuni atigi 1% ga yaxshilanish yil oxirida sizni mutlaqo boshqa odamga - 37 barobar yaxshiroq natijaga erishgan shaxsga aylantiradi.",
      "Odatlarni shakllantirishning to'rt bosqichi: Ishtiyoq, Reaksiya, Mukofot va Takrorlash jarayoni. Bu zanjirni tushunish o'z hayotingizni boshqarishning kalitidir.",
      "O'zlikni o'zgartirish odatlarni o'zgartirishdan boshlanadi. Siz o'zingizni kim deb bilishingiz - sizning takrorlanadigan odatlaringiz natijasidir."
    ]
  },
  "default": { 
    title: "Kitob", author: "Muallif", image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: ["Ushbu kitobning birinchi sahifasi bilan tanishing...", "Ikkinchi sahifada voqealar rivojlanadi...", "Uchinchi sahifa asarning mohiyatini ochib beradi."]
  }
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
              <button className="nav-btn-modern next" onClick={handleNext}>Keyingi →</button>
            </div>
          )}
        </div>

        <div className="side-panel-modern glass-panel">
          <img src={book.image} alt="" className="side-cover-img" />
          <div className="side-desc-wrap">
            <h4>Batafsil Tavsif</h4>
            <p className="side-desc-text">{book.description}</p>
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
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; font-weight: 600; }
        .full-badge { background: #10b981; color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 6px; margin-left: 10px; }
        .preview-container { display: grid; grid-template-columns: 1fr 380px; gap: 30px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 120px); }
        .page-viewer { display: flex; flex-direction: column; background: #1e293b; border-radius: 20px; overflow: hidden; }
        .full-reader-wrap { width: 100%; height: 100%; background: #525659; }
        .text-page-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; }
        .page-stack { position: relative; width: 100%; max-width: 500px; aspect-ratio: 3/4.2; }
        .stack-layer { position: absolute; inset: 0; background: #fdf6e3; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
        .layer-3 { transform: translate(6px, 6px); }
        .layer-2 { transform: translate(3px, 3px); }
        .page-paper-real { position: absolute; inset: 0; background: #fdf6e3; padding: 60px 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 4px; display: flex; flex-direction: column; }
        .paper-header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 5px; opacity: 0.5; }
        .book-name-mini { font-size: 0.75rem; font-family: serif; color: #2c3e50; }
        .page-count-mini { font-size: 0.8rem; font-family: serif; color: #2c3e50; }
        .paper-content { flex-grow: 1; position: relative; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.08; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text-real { color: #1a202c; font-size: 1.25rem; line-height: 1.9; font-family: 'Lora', serif; text-align: justify; z-index: 1; margin: 0; }
        .paper-footer { margin-top: 20px; text-align: center; opacity: 0.4; }
        .footer-line { height: 1px; background: rgba(0,0,0,0.05); margin-bottom: 10px; }
        .author-name-mini { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #2c3e50; }
        .viewer-footer { background: rgba(0,0,0,0.3); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 40px; }
        .nav-btn-modern { background: #818cf8; border: none; color: white; padding: 10px 25px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .nav-btn-modern:hover:not(:disabled) { background: #6366f1; }
        .page-indicator { color: white; }
        .side-panel-modern { padding: 30px; border-radius: 24px; overflow-y: auto; }
        .side-cover-img { width: 100%; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .side-desc-text { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.7; margin-bottom: 25px; text-align: justify; white-space: pre-line; }
        .borrow-btn-large { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); width: 100%; padding: 16px; border-radius: 15px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .overlay-lock-modern { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .lock-card-modern { padding: 40px; text-align: center; color: white; max-width: 380px; border-radius: 30px; }
        .btn-primary-modern { background: #818cf8; color: white; border: none; padding: 14px 30px; border-radius: 15px; width: 100%; margin-top: 20px; cursor: pointer; font-weight: 700; }
        .preview-loading { background: #0f172a; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        @media (max-width: 1100px) { .preview-container { grid-template-columns: 1fr; } .side-panel-modern { display: none; } }
      `}</style>
    </div>
  );
}
