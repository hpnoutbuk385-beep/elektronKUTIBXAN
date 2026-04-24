"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ScanPage() {
  const { t } = useLanguage();
  const [scanResult, setScanResult] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");

  useEffect(() => {
    // Load books to issue
    async function loadBooks() {
      try {
        const res = await fetchApi('/books/');
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) { console.error(err); }
    }
    loadBooks();

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      setScanResult(decodedText);
      // Optional: stop scanning after success
      // scanner.clear(); 
    }

    function onScanError(err) {
      // console.warn(err);
    }

    return () => scanner.clear();
  }, []);

  const handleProcess = async () => {
    if (!scanResult || !selectedBook) {
      setError("Iltimos, QR kodni skanerlang va kitobni tanlang");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetchApi('/transactions/process_loan/', {
        method: 'POST',
        body: JSON.stringify({
          qr_code: scanResult,
          book_id: selectedBook
        })
      });

      if (res.ok) {
        setSuccess("Kitob muvaffaqiyatli topshirildi!");
        setScanResult(null);
        setSelectedBook("");
      } else {
        const data = await res.json();
        setError(data.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="page-container animate-fade">
      <div className="page-header">
            <h1 className="page-title">Kutubxonachi Skaneri</h1>
            <p className="page-subtitle">O'quvchi QR-kodini skanerlang ва kitobni biriktiring</p>
          </div>

          <div className="scan-grid">
            <div className="scanner-section glass-panel">
              <div id="reader" style={{ width: "100%", borderRadius: "16px", overflow: "hidden" }}></div>
              {scanResult && (
                <div className="scan-status success">
                  ✅ QR Kod aniqlandi: <strong>{scanResult}</strong>
                </div>
              )}
            </div>

            <div className="process-section glass-panel">
              <h3 className="section-title">Kitob topshirish</h3>
              
              <div className="input-group">
                <label>Kitobni tanlang</label>
                <select 
                  value={selectedBook} 
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="glass-input"
                >
                  <option value="">-- Kitob tanlang --</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>{book.title} ({book.author})</option>
                  ))}
                </select>
              </div>

              {error && <div className="alert error">{error}</div>}
              {success && <div className="alert success">{success}</div>}

              <button 
                className="btn-process" 
                onClick={handleProcess}
                disabled={loading || !scanResult || !selectedBook}
              >
                {loading ? "Ishlanmoqda..." : "📖 Kitobni topshirish"}
              </button>

              <div className="instructions">
                <h4>Yo'riqnoma:</h4>
                <ul>
                  <li>O'quvchining telefonidagi QR-kodni kameraga ko'rsating.</li>
                  <li>Tizim kodni aniqlagandan so'ng, beriladigan kitobni ro'yxatdan tanlang.</li>
                  <li>"Kitobni topshirish" tugmasini bosing.</li>
                </ul>
              </div>
            </div>
          </div>
    </div>

    <style jsx>{`
        .page-container { padding: 20px; }
        .page-header { margin-bottom: 30px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #f5e6c8; margin-bottom: 8px; }
        .page-subtitle { color: rgba(196, 168, 130, 0.6); font-family: 'Lora', serif; }

        .scan-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 25px;
        }

        .scanner-section { padding: 20px; border: 1px solid rgba(218, 165, 32, 0.1) !important; }
        .process-section { padding: 30px; border: 1px solid rgba(218, 165, 32, 0.1) !important; display: flex; flex-direction: column; gap: 20px; }

        .section-title { font-family: 'Playfair Display', serif; color: #DAA520; font-size: 1.5rem; margin-bottom: 10px; }

        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: rgba(196, 168, 130, 0.6); font-size: 0.9rem; }

        .glass-input {
          background: rgba(193, 154, 107, 0.05);
          border: 1px solid rgba(218, 165, 32, 0.15);
          color: #f5e6c8;
          padding: 12px;
          border-radius: 12px;
          outline: none;
          font-family: 'Lora', serif;
        }

        .btn-process {
          background: linear-gradient(135deg, #8B4513, #DAA520);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          font-family: 'Lora', serif;
          margin-top: 10px;
        }
        .btn-process:hover { transform: scale(1.02); filter: brightness(1.1); }
        .btn-process:disabled { opacity: 0.5; cursor: not-allowed; }

        .scan-status { margin-top: 15px; padding: 12px; border-radius: 10px; font-size: 0.9rem; }
        .scan-status.success { background: rgba(76, 175, 80, 0.1); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.2); }

        .alert { padding: 12px; border-radius: 10px; font-size: 0.9rem; text-align: center; }
        .alert.error { background: rgba(229, 115, 115, 0.1); color: #e57373; border: 1px solid rgba(229, 115, 115, 0.2); }
        .alert.success { background: rgba(76, 175, 80, 0.1); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.2); }

        .instructions { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(218, 165, 32, 0.1); }
        .instructions h4 { color: #DAA520; font-size: 0.95rem; margin-bottom: 10px; }
        .instructions ul { padding-left: 20px; color: rgba(196, 168, 130, 0.5); font-size: 0.85rem; }
        .instructions li { margin-bottom: 5px; }

        @media (max-width: 1100px) {
          .scan-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
