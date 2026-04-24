"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchApi } from "@/lib/api";

export default function MyBooksPage() {
  const { t } = useLanguage();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadMyBooks();
  }, []);

  async function loadMyBooks() {
    try {
      const res = await fetchApi('/transactions/my-loans/');
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
      }
    } catch (err) {
      console.error("Failed to load loans", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReturn = async (loanId) => {
    setActionId(loanId);
    try {
      const res = await fetchApi('/transactions/digital-return/', {
        method: "POST",
        body: JSON.stringify({ transaction_id: loanId }),
      });
      if (res.ok) {
        setLoans(prev => prev.filter(l => l.id !== loanId));
        alert("Kitob muvaffaqiyatli qaytarildi! +10 ball 🌟");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setActionId(null);
    }
  };

  const handleRead = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert("Ushbu kitobning elektron versiyasi mavjud emas.");
    }
  };

  if (loading) return <div className="flex-center h-full" style={{color: '#DAA520', fontFamily: "'Lora', serif"}}>{t('loading')}</div>;

  return (
    <div className="dashboard-content animate-fade">
      <div className="welcome-header">
        <h1 className="welcome-title">{t('my_books')} 📖</h1>
        <p className="welcome-subtitle">Siz ijaraga olgan va hozirda o'qiyotgan kitoblaringiz ro'yxati.</p>
      </div>

      <div className="books-main-card glass-panel">
        <h3 className="section-header">
          <span className="header-ornament">✦</span>
          Sizdagi kitoblar ({loans.length})
        </h3>
        
        <div className="books-list-container">
          {loans.length > 0 ? loans.map((loan) => (
            <div key={loan.id} className="book-card-item glass-card">
              <div className="book-cover-mini">
                {loan.book_details?.image ? <img src={loan.book_details.image} alt="" /> : "📕"}
              </div>
              <div className="book-info-box">
                <h4 className="book-item-title">{loan.book_details?.title}</h4>
                <p className="book-item-author">{loan.book_details?.author}</p>
                <div className="book-item-meta">
                  <span className="status-pill due">📅 Qaytarish: {new Date(loan.due_date).toLocaleDateString()}</span>
                  {loan.book_details?.file && <span className="status-pill ebook">📱 E-kitob mavjud</span>}
                </div>
                
                <div className="action-row">
                  <button 
                    className={`btn-primary read-btn ${!loan.book_details?.file ? 'disabled' : ''}`}
                    onClick={() => handleRead(loan.book_details?.file)}
                    disabled={!loan.book_details?.file}
                  >
                    📖 O'qish
                  </button>
                  <button 
                    className="btn-secondary return-btn"
                    onClick={() => handleReturn(loan.id)}
                    disabled={actionId === loan.id}
                  >
                    {actionId === loan.id ? "..." : "🔄 Qaytarish"}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state-box">
              <div className="empty-icon">📚</div>
              <p>Sizda hali ijaraga olingan kitoblar yo'q.</p>
              <button className="btn-primary" onClick={() => window.location.href='/library'}>
                Kutubxonaga borish
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 25px; }
        .welcome-title { font-size: 2rem; color: #f5e6c8; font-family: 'Playfair Display', serif; }
        .welcome-subtitle { color: rgba(196, 168, 130, 0.5); font-family: 'Lora', serif; }

        .books-main-card { padding: 30px; min-height: 400px; }
        .section-header {
          margin-bottom: 25px; color: #f5e6c8; font-size: 1.1rem;
          font-family: 'Playfair Display', serif; display: flex; align-items: center; gap: 10px;
        }
        .header-ornament { color: rgba(218, 165, 32, 0.4); font-size: 0.7rem; }
        
        .books-list-container { display: flex; flex-direction: column; gap: 15px; }
        .book-card-item { padding: 20px; display: flex; gap: 20px; align-items: flex-start; }
        
        .book-cover-mini { 
          width: 80px; height: 110px; background: rgba(139, 69, 19, 0.15); 
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          overflow: hidden; font-size: 32px; flex-shrink: 0;
          box-shadow: inset -2px 0 5px rgba(0,0,0,0.2);
          border-left: 3px solid rgba(218, 165, 32, 0.3);
        }
        .book-cover-mini img { width: 100%; height: 100%; object-fit: cover; }
        
        .book-info-box { flex-grow: 1; }
        .book-item-title { font-size: 1.1rem; color: #f5e6c8; font-weight: 700; margin-bottom: 4px; font-family: 'Playfair Display', serif; }
        .book-item-author { color: rgba(218, 165, 32, 0.6); font-size: 0.9rem; margin-bottom: 10px; font-style: italic; font-family: 'Lora', serif; }
        
        .book-item-meta { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .status-pill { padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; font-family: 'Inter', sans-serif; }
        .status-pill.due { background: rgba(139, 69, 19, 0.12); color: #C19A6B; }
        .status-pill.ebook { background: rgba(218, 165, 32, 0.1); color: #DAA520; }
        
        .action-row { display: flex; gap: 12px; }
        .read-btn { padding: 8px 20px; font-size: 0.85rem; }
        .read-btn.disabled { opacity: 0.3; cursor: not-allowed; }
        .return-btn {
          background: rgba(193, 154, 107, 0.06); border: 1px solid rgba(218, 165, 32, 0.15);
          color: #f5e6c8; padding: 8px 20px; font-size: 0.85rem; border-radius: 10px;
          transition: all 0.3s; cursor: pointer; font-family: 'Lora', serif;
        }
        .return-btn:hover { background: rgba(229, 115, 115, 0.08); color: #e57373; border-color: rgba(229, 115, 115, 0.2); }

        .empty-state-box { text-align: center; padding: 60px 20px; color: rgba(196, 168, 130, 0.3); font-family: 'Lora', serif; }
        .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.5; }
        .empty-state-box .btn-primary { margin-top: 20px; }
      `}</style>
    </div>
  );
}
