"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const getImageUrl = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&h=600&fit=cover`;

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    description: "Abdulla Qodiriyning 'O'tkan kunlar' romani o'zbek adabiyoti tarixidagi birinchi roman hisoblanadi. Asarda XIX asr o'rtalaridagi Turkiston hayoti, o'sha davrdagi siyosiy nizolar va fojiaviy muhabbat qissasi mohirona bayon etilgan.",
    pages: [
      "1264-inchi hijriya, dalv oyining o'ninchisi, qishki kunlarning biri, quyosh botqan, ufqda qizil shafaq ko'ringan bir vaqtda Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi. Bu yigit Otabek edi. U otidan tushib, do'kondor bilan so'rashdi. Uning ko'zlarida qandaydir bir g'amginlik, ammo shu bilan birga qat'iyat bor edi. Marg'ilondan kelgan bu yosh yigitning taqdiri hali o'zi bilmagan holda buyuk muhabbatga bog'lanib bo'lgan edi. U atrofga hayron bo'lib boqar, o'zining kelajakdagi hayoti haqida o'ylardi.",
      "Otabek do'kon oldida o'tirib, uzoqlarga termulardi. Toshkentning tor ko'chalari, devorlar ortidan ko'rinib turgan daraxtlar unga Marg'ilonni eslatardi. U yerda uni kim kutyapti? Qalbi nima uchun bunchalik bezovta? O'sha kuni u ilk bor Kumushning ismini eshitdi. Bu ism uning qalbida kutilmagan bir aks-sado berdi. Go'yo butun koinot shu ism atrofida aylana boshlagandek edi. 'Kumush...' - deb pichirladi u o'z-o'ziga. Bu pichirlashda ham qo'rqinch, ham cheksiz bir umid bor edi. Hayotining eng go'zal va eng og'ir kunlari boshlanayotgan edi.",
      "Kechasi bilan uxlay olmay chiqqan Otabek tongda turib, shahar aylangani chiqdi. Havoning salqinligi uning biroz ko'nglini yozdi. Ammo shahar shovqini, odamlarning tinimsiz harakati unga begona tuyulardi. U o'zini qandaydir bir buyuk voqeaning ostonasida turgandek his qilardi. Ko'cha bo'ylab ketar ekan, u beixtiyor o'sha do'kon tomonga qaytib keldi. Do'kondor uni ko'rib kulimsiradi: 'Yana keldingizmi, yigit?' - dedi. Otabek indamay bosh irg'adi. Uning borlig'i o'sha sirli Marg'ilonlik go'zalni ko'rish ishtiyoqi bilan yonayotgan edi."
    ]
  },
  "102": { 
    title: "Mehrobdan chayon", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/1500.jpg",
    description: "Ushbu asarda yozuvchi Xudoyorxon davridagi saroy hayoti, u yerdagi fitnalar va adolatsizliklarni fosh etadi. Roman markazida Anvar va Ra'no ismli ikki yoshning pokiza muhabbati turadi.",
    pages: [
      "Xudoyorxon o'rdasi. Saroy ichidagi fitnalar va amaldorlarning bir-biriga bo'lgan adovati avjiga chiqqan. Anvar o'zining pok niyati bilan bu muhitda yashashga harakat qilar edi. U saroy kotibi bo'lishiga qaramay, qalbi har doim oddiy xalq bilan birga edi. Bir kuni u saroy mehrobi yaqinida o'tirib, kitob mutolaa qilardi. Shu payt uzoqdan qandaydir shivir-shivir ovozlar eshitildi. Bu ovozlar kutilayotgan xatar yoki kutilmagan baxtning xabarchisi edi. Anvar kitobni yopib, quloq tutdi. Saroyning devorlari ham quloqqa ega ekanligini u yaxshi bilardi.",
      "Ra'no o'z otasining do'sti bo'lgan amaldorning hiylasidan bexabar, Anvarni kutar edi. Ular o'rtasidagi munosabat nafaqat muhabbat, balki sadoqat va adolat timsoli edi. 'Anvar aka keladi, albatta keladi' - deb takrorlardi u o'z-o'ziga. Uning ko'zlari doimo yo'lda, yuragi esa bezovta edi. O'sha paytda saroyda unga qarshi qandaydir katta reja tuzilayotganini u hali sezmasdi. Ammo qizning ichki sezgisi uni ogohlantirardi. U qo'liga qalam olib, Anvarga maktub yozishni boshladi. Har bir harfda uning sog'inchi va sadoqati aks etardi."
    ]
  },
  "default": { title: "Kitob", author: "Muallif", image: "https://kitobxon.com/img_u/b/887.jpg", pages: ["Kitob sahifasi bilan tanishing. Bu yerda asarning kirish qismi va asosiy g'oyalari bayon etiladi.", "Ikkinchi sahifada voqealar rivojlanadi va qahramonlar yangi sarguzashtlar sari otlanadilar."] }
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
    const token = localStorage.getItem("access_token");
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
                      <h3>Kitobni to'liq o'qing</h3>
                      <p>Davomini o'qish uchun ro'yxatdan o'ting.</p>
                      <button className="btn-primary-modern" onClick={() => router.push("/login")}>Tizimga kirish</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="viewer-controls">
            <button className="nav-btn-modern" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>← Oldingi</button>
            <button className="nav-btn-modern next" onClick={() => (currentPage < pages.length - 1 ? setCurrentPage(prev => prev + 1) : setShowOverlay(true))}>Keyingi →</button>
          </div>
        </div>

        <div className="side-panel-modern glass-panel">
          <img src={getImageUrl(book.image)} alt="" className="side-cover-img" />
          <div className="side-desc-wrap">
            <h4>Batafsil Tavsif</h4>
            <p className="side-desc-text">{book.description}</p>
            <button className="btn-primary-modern borrow-btn-large" onClick={() => router.push("/login")}>
              📖 Kitobni ijaraga olish
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #1a0f0a; min-height: 100vh; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .top-nav { display: flex; align-items: center; gap: 15px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(217,119,6,0.05); color: #fef3c7; padding: 8px 16px; border-radius: 12px; cursor: pointer; border: 1px solid rgba(217,119,6,0.15); font-size: 0.9rem; }
        .book-top-info h3 { font-size: 1.1rem; margin: 0; color: #fef3c7; }
        .book-top-info span { font-size: 0.8rem; color: #d97706; }

        .preview-container { display: grid; grid-template-columns: 1fr 380px; gap: 25px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; min-height: 0; }
        .page-viewer { display: flex; flex-direction: column; background: #2d1a12; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .text-page-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 25px; position: relative; overflow: hidden; }
        
        .page-stack { position: relative; width: 100%; max-width: 500px; aspect-ratio: 3/4.2; }
        .stack-layer { position: absolute; inset: 0; background: #fdf6e3; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
        .layer-3 { transform: translate(6px, 6px); }
        .layer-2 { transform: translate(3px, 3px); }
        
        .page-paper-real { position: absolute; inset: 0; background: #fdf6e3; padding: 50px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 4px; display: flex; flex-direction: column; }
        .paper-header { display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; opacity: 0.5; }
        .book-name-mini { font-size: 0.7rem; font-family: serif; color: #2c3e50; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
        .page-count-mini { font-size: 0.75rem; font-family: serif; color: #2c3e50; }
        
        .paper-content { flex-grow: 1; position: relative; overflow-y: auto; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.08; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text-real { color: #1a202c; font-size: 1.2rem; line-height: 1.8; font-family: 'Lora', serif; text-align: justify; z-index: 1; margin: 0; }
        
        .paper-footer { margin-top: 25px; text-align: center; opacity: 0.4; }
        .footer-line { height: 1px; background: rgba(0,0,0,0.05); margin-bottom: 8px; }
        .author-name-mini { font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: #2c3e50; }
        
        .viewer-controls { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 20px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(217,119,6,0.1); }
        .nav-btn-modern { background: #d97706; border: none; color: #fef3c7; padding: 12px 28px; border-radius: 14px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 1rem; flex: 1; max-width: 160px; }
        .nav-btn-modern:disabled { opacity: 0.3; cursor: not-allowed; background: #451a03; }
        .nav-btn-modern:hover:not(:disabled) { transform: translateY(-2px); background: #f59e0b; box-shadow: 0 5px 15px rgba(217, 119, 6, 0.4); }

        .side-panel-modern { padding: 30px; border-radius: 24px; overflow-y: auto; display: flex; flex-direction: column; }
        .side-cover-img { width: 100%; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .side-desc-text { color: rgba(254, 243, 199, 0.7); font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; }
        .borrow-btn-large { background: linear-gradient(135deg, #d97706 0%, #92400e 100%); width: 100%; padding: 16px; border-radius: 15px; font-weight: 700; cursor: pointer; transition: 0.3s; color: #fef3c7; border: none; }
        
        .overlay-lock-modern { position: absolute; inset: 0; background: rgba(26, 15, 10, 0.95); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; border-radius: 4px; }
        .lock-card-modern { padding: 30px; text-align: center; color: #fef3c7; width: 100%; border-radius: 30px; }
        .lock-icon { font-size: 3rem; margin-bottom: 15px; }
        .btn-primary-modern { background: #d97706; color: #fef3c7; border: none; padding: 14px; border-radius: 15px; width: 100%; margin-top: 20px; cursor: pointer; font-weight: 700; font-size: 1rem; }
        .preview-loading { background: #1a0f0a; height: 100vh; display: flex; align-items: center; justify-content: center; color: #fef3c7; }

        @media (max-width: 1100px) { 
          .preview-container { grid-template-columns: 1fr; } 
          .side-panel-modern { display: none; } 
        }

        @media (max-width: 600px) {
          .preview-page { padding: 10px; gap: 10px; }
          .page-paper-real { padding: 35px 25px; }
          .page-text-real { font-size: 1rem; line-height: 1.7; }
          .paper-header { margin-bottom: 15px; }
          .viewer-controls { padding: 15px; gap: 15px; }
          .nav-btn-modern { padding: 10px 20px; font-size: 0.9rem; }
          .text-page-wrapper { padding: 15px; }
        }
      `}</style>
    </div>
  );
}
