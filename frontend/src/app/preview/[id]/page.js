"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "1264-inchi hijriya, dalv oyining o'ninchisi, Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi. Bu yigit Otabek edi...",
      "Kumushbibi o'z xonasida o'tirib, Marg'ilondan kelgan bu kutilmagan mehmon haqida o'ylardi. Uning qalbidagi hislar hali o'zi uchun ham jumboq edi...",
      "Otabek va Kumushning uchrashuvi. Bu uchrashuv nafaqat ikki yoshning taqdirini, balki butun Turkiston adabiyotining yo'nalishini o'zgartirdi..."
    ]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg",
    pages: [
      "Xudoyorxon saroyidagi hiylalar va fitnalar. Anvar o'zining pokligi bilan bu qora dunyoda yashashga intilar edi...",
      "Ra'noning maktubi. 'Sizga bo'lgan ishonchim hech qachon so'nmaydi, Anvar'. Bu so'zlar yigitga ulkan kuch bag'ishladi...",
      "Mehrob ichidagi sirlar. Din pardasi ostidagi insoniy illatlar fosh bo'la boshladi."
    ]
  },
  "103": { 
    title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg",
    pages: [
      "Zebi o'zining yoshligi va go'zalligi bilan hayotdan katta umidlar qilar edi. Ammo taqdir o'yinlari uni kutilmagan ko'chalarga boshladi...",
      "Akbarali mingboshi saroyi. Bu yerda boylik va hokimiyat inson qadrini qanchalik pasaytirishi yaqqol ko'rinardi...",
      "Ozodlik va zulmat o'rtasidagi kurash. 'Kecha' o'tib, 'Kunduz' kelishi uchun hali ko'p qurbonlar berilishi kerak edi."
    ]
  },
  "104": { 
    title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg",
    pages: [
      "Zahiriddin Muhammad Bobur Mirzo o'zining o'n ikki yoshida taxtga o'tirdi. Farg'ona vodiysining go'zal tabiatini tark etish uning uchun og'ir edi...",
      "Yulduzli tunlarda Bobur o'zining 'Boburnoma' asarini yozishni boshladi. Har bir satr vatan sog'inchi bilan to'la edi...",
      "Afg'oniston va Hindiston sari yurishlar. Bobur shoh bo'lish bilan birga, har doim shoir va adib bo'lib qoldi."
    ]
  },
  "105": { 
    title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg",
    pages: [
      "Ona! Bu dunyoda onadan buyukroq zot bormi? Onamning qo'llari har doim tandir isi bilan anqib turardi...",
      "Hikoyalar to'plami insoniy fazilatlar haqida. Qatog'on yillari va urush davri odamlarining matonati bayon etiladi...",
      "Inson o'z o'tmishini unutmasligi kerak. Onamning har bir nasihati men uchun hayot darsi bo'ldi."
    ]
  },
  "106": { 
    title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg",
    pages: [
      "Hoshimjonning sarguzashtlari. Sehrli sholcha bilan osmonga uchish va dunyoni kezish uning eng katta orzusi edi...",
      "Sariq dev - bu nafaqat ertak qahramoni, balki insonning dangasaligi va qo'rqoqligi ustidan g'alabasi ramzi edi...",
      "Maktabdagi darslar va Hoshimjonning sho'xliklari. Bolalikning beg'ubor damlari."
    ]
  },
  "107": { 
    title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg",
    pages: [
      "Kichik o'zgarishlar - katta natijalar. Har kuni 1% yaxshilanish yil oxirida sizni mutlaqo boshqa odamga aylantiradi...",
      "Odatlarni shakllantirishning to'rt bosqichi: Ishtiyoq, Reaksiya, Mukofot va Takrorlash...",
      "O'zlikni o'zgartirish odatlarni o'zgartirishdan boshlanadi. Siz o'zingizni kim deb bilishingiz natijalaringizni belgilaydi."
    ]
  },
  "108": { 
    title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://kitobxon.com/img_u/b/4836.jpg",
    pages: [
      "Moliyaviy savodxonlik - boy bo'lishning asosi. Boylar pul uchun ishlamaydilar, pul ular uchun ishlashini ta'minlaydilar...",
      "Aktiv va Passiv farqi. Aktivlar sizning cho'ntagingizga pul olib keladi, passivlar esa pulni olib ketadi...",
      "O'z biznesingizni boshlashdan qo'rqmang. Moliyaviy erkinlikka erishish uchun jasorat va bilim kerak."
    ]
  },
  "109": { 
    title: "Diqqat", author: "Cal Newport", image: "https://kitobxon.com/img_u/b/6169.jpg",
    pages: [
      "Deep Work (Chuqur mehnat) - bu chalg'ituvchi dunyoda muvaffaqiyatga erishishning yagona yo'lidir...",
      "Diqqatni jamlash qobiliyati kamayib bormoqda. Ijtimoiy tarmoqlar va kutilmagan xabarlar bizning potensialimizni bo'g'ib qo'ymoqda...",
      "Kunlik rejalashtirish va diqqatni faqat bitta narsaga qaratish yuqori unumdorlikning siridir."
    ]
  },
  "110": { 
    title: "Psixologiya", author: "Darslik", image: "https://kitobxon.com/img_u/b/402.jpg",
    pages: [
      "Psixologiya fanining predmeti va vazifalari. Inson ruhiyati va uning tashqi muhit bilan aloqasi...",
      "Shaxs temperamenti va xarakteri. Inson qanday qilib o'z hissiyotlarini boshqarishi mumkin?...",
      "O'smirlik davri psixologiyasi. Bu davrdagi hissiy o'zgarishlar va shaxsiyatning shakllanish jarayoni."
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
        const fb = BOOK_CONTENT[id] || BOOK_CONTENT["101"]; // Topilmasa O'tkan kunlar chiqadi
        if (res.ok) {
          const data = await res.json();
          setBook({ ...fb, ...data, pages: fb.pages });
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
                  <h3>📖 Kitobni to'liq o'qing</h3>
                  <p>Preview tugadi. Davomini o'qish uchun ro'yxatdan o'ting.</p>
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
          <p>{book.description || "Ushbu asar o'zbek adabiyotining eng sara namunalaridan biri hisoblanadi."}</p>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; }
        .btn-back:hover { background: rgba(255,255,255,0.1); }
        .book-top-info h3 { color: white; font-size: 1.1rem; }
        .book-top-info span { color: #818cf8; font-size: 0.85rem; }
        .preview-container { display: grid; grid-template-columns: 1fr 300px; gap: 20px; max-width: 1200px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 100px); }
        .page-viewer { display: flex; flex-direction: column; background: #1e293b; border-radius: 20px; overflow: hidden; }
        .text-page-content { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .page-paper { background: #fdf6e3; width: 100%; max-width: 500px; aspect-ratio: 3/4; padding: 50px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: center; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.05; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text { color: #2c3e50; font-size: 1.25rem; line-height: 1.8; font-family: 'Georgia', serif; text-align: justify; z-index: 1; }
        .page-footer-num { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; color: #7f8c8d; font-size: 0.9rem; }
        .viewer-footer { background: rgba(0,0,0,0.3); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 40px; }
        .nav-btn { background: #818cf8; border: none; color: white; padding: 8px 25px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .nav-btn:hover:not(:disabled) { background: #6366f1; }
        .nav-btn:disabled { opacity: 0.2; }
        .page-indicator { color: white; }
        .side-details { padding: 20px; border-radius: 20px; overflow-y: auto; }
        .side-cover { width: 100%; border-radius: 10px; margin-bottom: 15px; }
        .side-details h4 { color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 10px; }
        .side-details p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.5; }
        .overlay-lock { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .lock-card { padding: 40px; text-align: center; color: white; max-width: 350px; border-radius: 25px; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        @media (max-width: 800px) { .preview-container { grid-template-columns: 1fr; } .side-details { display: none; } .page-paper { padding: 30px; } .page-text { font-size: 1.1rem; } }
      `}</style>
    </div>
  );
}
