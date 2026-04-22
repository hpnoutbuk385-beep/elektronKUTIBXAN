"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const BOOK_CONTENT = {
  "101": { 
    title: "O'tkan kunlar", author: "Abdulla Qodiriy", image: "https://kitobxon.com/img_u/b/887.jpg",
    description: "Abdulla Qodiriyning 'O'tkan kunlar' romani o'zbek adabiyoti tarixidagi birinchi roman hisoblanadi. Asarda XIX asr o'rtalaridagi Turkiston hayoti, o'sha davrdagi siyosiy nizolar va fojiaviy muhabbat qissasi mohirona bayon etilgan.",
    pages: [
      "1264-inchi hijriya, dalv oyining o'ninchisi, qishki kunlarning biri, quyosh botqan, ufqda qizil shafaq ko'ringan bir vaqtda Toshkentning 'Zarkaynar' ko'chasidagi bir do'kon oldiga bir otliq kelib to'xtadi. Bu yigit, ustidagi qora movut chakmoni va boshidagi oq sallasidan ko'rinib turganidek, biror o'qimishli yoki boyvachcha kishining o'g'li edi. U otidan tushib, do'kon oldidagi so'riga o'tirdi va do'kondor bilan so'rashdi. Uning ko'zlarida qandaydir bir g'amginlik, ammo shu bilan birga qat'iyat bor edi. Marg'ilondan kelgan bu yosh yigitning taqdiri hali o'zi bilmagan holda buyuk muhabbatga bog'lanib bo'lgan edi.",
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
  "default": { 
    title: "Kitob", author: "Muallif", image: "https://kitobxon.com/img_u/b/887.jpg",
    pages: [
      "Ushbu kitobning birinchi sahifasi sizga yangi olam eshiklarini ochadi. Bu yerda asarning kirish qismi va asosiy g'oyalari bayon etiladi. Kitobxonni qiziqarli sarguzashtlar va falsafiy mulohazalar kutmoqda. Har bir qator sizni qahramonlarning murakkab taqdiri sari yetaklaydi. Diqqat bilan o'qing, chunki har bir so'zda chuqur ma'no yashiringan. Kitob mutolaasi inson ruhini boyitadi va unga kuch bag'ishlaydi. Bizning elektron kutubxonamiz sizga eng sara asarlarni taqdim etishdan mamnun.",
      "Ikkinchi sahifaga xush kelibsiz. Voqealar rivoji tobora avjiga chiqmoqda. Qahramonlar o'z maqsadlari yo'lida turli to'siqlarga duch keladilar. Asar o'zining falsafiy chuqurligi bilan ajralib turadi. Bu yerda siz o'zingizni qiziqtirgan savollarga javob topishingiz mumkin. Hayotning mazmuni, sadoqat va xiyonat, yaxshilik va yomonlik o'rtasidagi abadiy kurash ushbu kitobning asosiy mavzularidir. Mutolaadan zavqlaning va asarning to'liq versiyasini o'qish uchun ro'yxatdan o'tishni unutmang."
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
          setBook({ ...fb, ...data, pages: fb.pages, description: fb.description || fb.description });
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
        <div className="page-viewer">
          <div className="text-page-wrapper">
            {/* KITOB VARAQLARI EFFEKTI */}
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
                      <button className="btn-primary-modern" onClick={() => router.push("/register")}>
                        Ro'yxatdan o'tish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="viewer-controls">
            <button className="nav-btn-modern" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>
              ← Oldingi
            </button>
            <div className="progress-bar-wrap">
              <div className="progress-fill" style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}></div>
            </div>
            <button className="nav-btn-modern next" onClick={handleNext}>
              Keyingi →
            </button>
          </div>
        </div>

        <div className="side-panel-modern glass-panel">
          <div className="side-cover-wrap">
            <img src={book.image} alt="" className="side-cover-img" />
          </div>
          <div className="side-desc-wrap">
            <h4>Asar haqida</h4>
            <p className="side-desc-text">{book.description}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-page { background: #0f172a; min-height: 100vh; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .top-nav { display: flex; align-items: center; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .btn-back { background: rgba(255,255,255,0.05); color: white; padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; font-weight: 600; }
        .btn-back:hover { background: rgba(255,255,255,0.1); transform: translateX(-5px); }
        .book-top-info h3 { color: white; font-size: 1.2rem; margin-bottom: 2px; }
        .book-top-info span { color: #818cf8; font-size: 0.9rem; }

        .preview-container { display: grid; grid-template-columns: 1fr 380px; gap: 30px; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; height: calc(100vh - 120px); }
        
        .page-viewer { display: flex; flex-direction: column; gap: 20px; }
        .text-page-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; }
        
        /* KITOB VARAQLARI STACK EFFEKTI */
        .page-stack { position: relative; width: 100%; max-width: 550px; aspect-ratio: 3/4.2; }
        .stack-layer { position: absolute; inset: 0; background: #fdf6e3; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
        .layer-3 { transform: translate(6px, 6px); }
        .layer-2 { transform: translate(3px, 3px); }

        .page-paper-real { 
          position: absolute; inset: 0; background: #fdf6e3; padding: 60px 50px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 4px;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .paper-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; opacity: 0.5; }
        .book-name-mini { font-size: 0.75rem; font-family: serif; font-style: italic; color: #2c3e50; }
        .page-count-mini { font-size: 0.8rem; font-family: serif; color: #2c3e50; }

        .paper-content { flex-grow: 1; position: relative; }
        .paper-texture { position: absolute; inset: 0; opacity: 0.08; background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); pointer-events: none; }
        .page-text-real { 
          color: #1a202c; font-size: 1.25rem; line-height: 1.9; 
          font-family: 'Lora', 'Georgia', serif; text-align: justify; 
          z-index: 1; margin: 0; height: 100%;
          hyphens: auto;
        }

        .paper-footer { margin-top: 30px; text-align: center; opacity: 0.4; }
        .footer-line { height: 1px; background: rgba(0,0,0,0.05); margin-bottom: 10px; }
        .author-name-mini { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #2c3e50; }

        .viewer-controls { display: flex; align-items: center; gap: 20px; padding: 0 20px; }
        .nav-btn-modern { background: #818cf8; border: none; color: white; padding: 12px 30px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .nav-btn-modern:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(129, 140, 248, 0.4); }
        .nav-btn-modern:disabled { opacity: 0.2; transform: none; box-shadow: none; }
        
        .progress-bar-wrap { flex-grow: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: #818cf8; transition: 0.5s; }

        .side-panel-modern { padding: 30px; border-radius: 24px; display: flex; flex-direction: column; gap: 25px; overflow-y: auto; }
        .side-cover-img { width: 100%; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .side-desc-wrap h4 { color: white; font-size: 1.3rem; margin-bottom: 15px; border-left: 4px solid #818cf8; padding-left: 15px; }
        .side-desc-text { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.7; text-align: justify; }

        .overlay-lock-modern { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .lock-card-modern { padding: 40px; text-align: center; color: white; max-width: 380px; border-radius: 30px; }
        .lock-icon { font-size: 3rem; margin-bottom: 20px; }
        .btn-primary-modern { background: #818cf8; color: white; border: none; padding: 14px 30px; border-radius: 15px; font-weight: 700; width: 100%; margin-top: 20px; cursor: pointer; transition: 0.3s; }
        .btn-primary-modern:hover { background: #6366f1; transform: scale(1.02); }

        .preview-loading { background: #0f172a; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; }
        
        @media (max-width: 1100px) {
          .preview-container { grid-template-columns: 1fr; }
          .side-panel-modern { display: none; }
          .page-stack { max-width: 450px; }
        }
      `}</style>
    </div>
  );
}
