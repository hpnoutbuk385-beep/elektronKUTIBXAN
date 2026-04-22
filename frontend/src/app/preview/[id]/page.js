"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    description: "Abdulla Qodiriyning 'O'tkan kunlar' romani o'zbek adabiyoti tarixidagi birinchi roman hisoblanadi. Asarda XIX asr o'rtalaridagi Turkiston hayoti, o'sha davrdagi siyosiy nizolar va fojiaviy muhabbat qissasi mohirona bayon etilgan. \n\nAsosiy qahramonlar Otabek va Kumushbibi timsolida o'zbek xalqining yuksak insoniy fazilatlari, sadoqati va pokiza muhabbati ko'rsatilgan. Shu bilan birga, asarda yurtning parchalanishiga olib kelgan ichki nizolar va jaholatning achchiq oqibatlari tanqid ostiga olinadi.",
    pages: ["1264-inchi hijriya, dalv oyining o'ninchisi, Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi...", "Kumushbibi o'z xonasida o'tirib, Marg'ilondan kelgan bu kutilmagan mehmon haqida o'ylardi...", "Otabek va Kumushning uchrashuvi. Bu uchrashuv nafaqat ikki yoshning taqdirini o'zgartirdi."]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg",
    description: "Ushbu asarda yozuvchi Xudoyorxon davridagi saroy hayoti, u yerdagi fitnalar va adolatsizliklarni fosh etadi. Roman markazida Anvar va Ra'no ismli ikki yoshning pokiza muhabbati va ularning o'z sevgilari yo'lidagi matonati turadi. \n\n'Mehrobdan chayon' nomi ramziy ma'noga ega bo'lib, eng muqaddas joy hisoblangan mehrob ichidan chiqqan 'chayonlar' - ya'ni din niqobi ostidagi ikkiyuzlamachi amaldorlarni anglatadi. Asar adolat, sadoqat va ilm-ma'rifatning g'alabasi bilan yakunlanadi.",
    pages: ["Xudoyorxon saroyidagi hiylalar va fitnalar. Anvar o'zining pokligi bilan yashashga intilar edi...", "Ra'noning maktubi. 'Sizga bo'lgan ishonchim hech qachon so'nmaydi, Anvar'...", "Mehrob ichidagi sirlar fosh bo'la boshladi."]
  },
  "103": { 
    title: "Kecha va kunduz", author: "Cho'lpon", image: "https://kitobxon.com/img_u/b/2034.jpg",
    description: "Cho'lponning bu asari jadid adabiyotining eng yirik namunalaridan biridir. Romanda mustamlaka davridagi Turkiston ijtimoiy hayoti, ayollar huquqsizligi va xalqning uyg'onish jarayoni tasvirlangan. \n\nAsar ikki qismdan iborat bo'lishi rejalashtirilgan edi, ammo bizgacha faqat 'Kecha' qismi yetib kelgan. Unda Zebi ismli qizning fojiaviy taqdiri orqali butun jamiyatdagi illatlar va umidsizliklar ko'rsatib berilgan.",
    pages: ["Zebi o'zining yoshligi va go'zalligi bilan hayotdan katta umidlar qilar edi...", "Akbarali mingboshi saroyidagi hayot...", "Ozodlik va zulmat o'rtasidagi kurash."]
  },
  "104": { 
    title: "Yulduzli tunlar", author: "Pirimqul Qodirov", image: "https://kitobxon.com/img_u/b/2012.jpg",
    description: "Bu tarixiy roman Zahiriddin Muhammad Boburning murakkab hayoti va faoliyatiga bag'ishlangan. Muallif Boburni nafaqat shoh va sarkarda, balki vatan sog'inchi bilan yonayotgan hassos shoir va inson sifatida tasvirlaydi. \n\nAsarda Temuriylar saltanatining so'nggi yillari, Movarounnahr uchun kurashlar va Boburning Hindistonda buyuk saltanatga asos solishi voqealari juda jonli va tarixiy asosda bayon etilgan.",
    pages: ["Bobur Mirzo o'zining o'n ikki yoshida taxtga o'tirdi. Farg'onani tark etish og'ir edi...", "Yulduzli tunlarda Bobur o'zining 'Boburnoma' asarini yozishni boshladi...", "Afg'oniston va Hindiston sari yurishlar."]
  },
  "105": { 
    title: "Dunyoning ishlari", author: "O'tkir Hoshimov", image: "https://kitobxon.com/img_u/b/814.jpg",
    description: "O'tkir Hoshimovning ushbu asari insoniylik, mehr-oqibat va eng asosiysi - onaga bo'lgan cheksiz muhabbat haqidadir. Kitob bir nechta turkum hikoyalardan iborat bo'lib, ularning har biri qalbni larzaga soladi. \n\nMuallif o'z onasining timsolida barcha o'zbek onalarining mehnatkashligi, sabr-toqati va fidoyiligini ko'rsatib bergan. Bu asar har bir kitobxonni o'z ota-onasini qadrlashga va hayotning mazmuni haqida o'ylashga undaydi.",
    pages: ["Onamning qo'llari har doim tandir isi bilan anqib turardi...", "Qatog'on yillari va urush davri odamlarining matonati...", "Onamning har bir nasihati men uchun hayot darsi bo'ldi."]
  },
  "106": { 
    title: "Sariq devni minib", author: "X. To'xtaboyev", image: "https://kitobxon.com/img_u/b/263.jpg",
    description: "Bu asar o'zbek bolalar adabiyotining eng mashhur namunasi bo'lib, u ko'plab tillarga tarjima qilingan. Soddadil va sho'x Hoshimjonning sarguzashtlari orqali yozuvchi bolalarni dangasalikdan qochishga, ilm olishga va mehnatsevarlikka chorlaydi. \n\nSehrli sholcha yordamida dunyoni kezgan Hoshimjon oxir-oqibat haqiqiy baxt sehr-jodu bilan emas, balki o'z mehnati va bilimi bilan erishilishini tushunib yetadi.",
    pages: ["Hoshimjonning sarguzashtlari. Sehrli sholcha bilan osmonga uchish...", "Sariq dev - bu insonning dangasaligi ustidan g'alabasi ramzi...", "Bolalikning beg'ubor damlari."]
  },
  "107": { 
    title: "Atom odatlar", author: "James Clear", image: "https://kitobxon.com/img_u/b/6146.jpg",
    description: "James Clear o'zining ushbu jahon bestsellerida kichik o'zgarishlar qanday qilib ulkan natijalarga olib kelishini ilmiy va amaliy jihatdan isbotlab beradi. 'Atom odatlar' - bu murakkab foizlar kabi to'planib boradigan kichik qadamlar haqidagi kitobdir. \n\nYozuvchi yaxshi odatlarni shakllantirish va yomonlaridan qutulishning 4 ta aniq qoidasini taklif etadi. Kitob o'z ustida ishlashni xohlaydigan har bir inson uchun eng yaxshi qo'llanma hisoblanadi.",
    pages: ["Kichik o'zgarishlar - katta natijalar. Har kuni 1% yaxshilanish...", "Odatlarni shakllantirishning to'rt bosqichi...", "O'zlikni o'zgartirish odatlarni o'zgartirishdan boshlanadi."]
  },
  "108": { 
    title: "Boy ota, kambag'al ota", author: "Robert Kiyosaki", image: "https://kitobxon.com/img_u/b/4836.jpg",
    description: "Robert Kiyosaki bu kitobda moliyaviy savodxonlikning sirlari bilan bo'lishadi. U o'zining ikki 'otasi' - biri o'ta bilimli lekin kambag'al, ikkinchisi esa maktabni bitirmagan lekin juda boy insonning hayotiy darslarini taqqoslaydi. \n\nAsosiy g'oya - pul uchun ishlash emas, balki pulni siz uchun ishlashga majbur qilishdir. Aktivlar va passivlar orasidagi farqni tushunish boylikka olib boradigan birinchi qadamdir.",
    pages: ["Moliyaviy savodxonlik - boy bo'lishning asosi...", "Aktiv va Passiv farqi. Aktivlar cho'ntagingizga pul olib keladi...", "Moliyaviy erkinlikka erishish uchun jasorat va bilim kerak."]
  },
  "109": { 
    title: "Diqqat", author: "Cal Newport", image: "https://kitobxon.com/img_u/b/6169.jpg",
    description: "Chalg'ituvchi texnologiyalar davrida diqqatni bir joyga jamlash eng noyob va qimmatli mahoratga aylandi. Cal Newport 'Deep Work' (Chuqur mehnat) konsepsiyasi orqali qanday qilib qisqa vaqt ichida ko'p va sifatli natijaga erishish mumkinligini o'rgatadi. \n\nKitobda ijtimoiy tarmoqlarning zarari va diqqatni boshqarishning amaliy usullari keltirilgan. Bu yuqori texnologiyalar asrida o'z unumdorligini oshirmoqchi bo'lganlar uchun juda muhim asardir.",
    pages: ["Deep Work - bu muvaffaqiyatga erishishning yagona yo'lidir...", "Diqqatni jamlash qobiliyati kamayib bormoqda...", "Kunlik rejalashtirish yuqori unumdorlikning siridir."]
  },
  "110": { 
    title: "Psixologiya", author: "Darslik", image: "https://kitobxon.com/img_u/b/402.jpg",
    description: "Bu darslik psixologiya fanining asosiy tushunchalari, inson ruhiyatining shakllanishi va ijtimoiy munosabatlar psixologiyasini o'rganadi. Unda insonning xarakteri, temperamenti, xotirasi va tafakkuri kabi muhim mavzular ilmiy tushuntirilgan. \n\nDarslik ham talabalar, ham o'zini yaxshiroq tushunishni xohlaydigan oddiy o'quvchilar uchun foydali manba hisoblanadi. Inson psixologiyasini bilish hayotdagi to'siqlarni yengishda katta yordam beradi.",
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
          <h4>Batafsil Tavsif</h4>
          <p className="full-desc">{book.description}</p>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #020617; min-height: 100vh; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; }
        .btn-back:hover { background: rgba(255,255,255,0.1); }
        .book-top-info h3 { color: white; font-size: 1.1rem; }
        .book-top-info span { color: #818cf8; font-size: 0.85rem; }

        .preview-container { display: grid; grid-template-columns: 1fr 350px; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 100px); }
        .page-viewer { display: flex; flex-direction: column; background: #1e293b; border-radius: 20px; overflow: hidden; }
        .text-page-content { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 30px; position: relative; }
        .page-paper { background: #fdf6e3; width: 100%; max-width: 480px; aspect-ratio: 3/4; padding: 45px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: center; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.05; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text { color: #2c3e50; font-size: 1.2rem; line-height: 1.8; font-family: 'Georgia', serif; text-align: justify; z-index: 1; }
        .page-footer-num { position: absolute; bottom: 25px; left: 0; right: 0; text-align: center; color: #7f8c8d; font-size: 0.85rem; }

        .viewer-footer { background: rgba(0,0,0,0.3); padding: 15px; display: flex; align-items: center; justify-content: center; gap: 40px; }
        .nav-btn { background: #818cf8; border: none; color: white; padding: 8px 25px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .nav-btn:hover:not(:disabled) { background: #6366f1; }
        .nav-btn:disabled { opacity: 0.2; }
        .page-indicator { color: white; }

        .side-details { padding: 25px; border-radius: 20px; overflow-y: auto; }
        .side-cover { width: 100%; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .side-details h4 { color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px; font-size: 1.2rem; }
        .full-desc { color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.7; white-space: pre-line; }

        .overlay-lock { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .lock-card { padding: 40px; text-align: center; color: white; max-width: 350px; border-radius: 25px; }
        .preview-loading { background: #020617; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        
        @media (max-width: 1000px) {
          .preview-container { grid-template-columns: 1fr; }
          .side-details { display: none; }
        }
      `}</style>
    </div>
  );
}
