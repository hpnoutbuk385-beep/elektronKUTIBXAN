"use client";
import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ScannerPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState("loan"); // 'loan' or 'return'
  const [step, setStep] = useState(1); // 1: Student QR, 2: Book QR (only for loan)
  const [studentQr, setStudentQr] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    setIsScanning(true);
    setStatus({ type: "info", message: t('camera_initializing') || "Kamera tayyorlanmoqda..." });

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      );
      setStatus({ type: "success", message: mode === 'loan' && step === 1 ? "Talaba QR kodini ko'rsating" : "Kitob QR kodini ko'rsating" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: t('camera_error') || "Kameraga ruxsat berilmadi yoki xatolik." });
      setIsScanning(false);
    }
  };

  const onScanSuccess = async (decodedText) => {
    if (scannerRef.current) {
        await scannerRef.current.stop();
        setIsScanning(false);
    }

    if (mode === "loan") {
      if (step === 1) {
        setStudentQr(decodedText);
        setStep(2);
        setStatus({ type: "success", message: "Talaba aniqlandi! Endi kitobni skanerlang." });
        // Auto-restart for book
        setTimeout(startScanner, 1000);
      } else {
        processLoan(decodedText);
      }
    } else {
      processReturn(decodedText);
    }
  };

  const processLoan = async (bookQr) => {
    setStatus({ type: "info", message: "Rasmiylashtirilmoqda..." });
    try {
      const res = await fetchApi("/transactions/process-loan/", {
        method: "POST",
        body: JSON.stringify({ student_qr: studentQr, book_qr: bookQr }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Kitob muvaffaqiyatli berildi!" });
        resetScanner();
      } else {
        setStatus({ type: "error", message: data.error || "Xatolik yuz berdi." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server bilan aloqa yo'q." });
    }
  };

  const processReturn = async (bookQr) => {
    setStatus({ type: "info", message: "Qaytarilmoqda..." });
    try {
      const res = await fetchApi("/transactions/process-return/", {
        method: "POST",
        body: JSON.stringify({ book_qr: bookQr }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: `Muvaffaqiyatli qaytarildi! +${data.points} ball.` });
        resetScanner();
      } else {
        setStatus({ type: "error", message: data.error || "Xatolik yuz berdi." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server bilan aloqa yo'q." });
    }
  };

  const resetScanner = () => {
    setStep(1);
    setStudentQr(null);
    setIsScanning(false);
  };

  return (
    <div className="scanner-container animate-fade">
      <div className="scanner-header glass-panel">
          <Link href="/" className="back-btn">⬅️ {t('back') || 'Orqaga'}</Link>
          <h2 className="gradient-text">{t('qr_scanner_title') || 'QR Skaner'}</h2>
      </div>

      <div className="mode-switcher glass-panel mt-20">
        <button 
          className={`mode-btn ${mode === 'loan' ? 'active' : ''}`} 
          onClick={() => { setMode('loan'); resetScanner(); }}
        >
          📖 {t('mode_loan') || 'Kitob Berish'}
        </button>
        <button 
          className={`mode-btn ${mode === 'return' ? 'active' : ''}`} 
          onClick={() => { setMode('return'); resetScanner(); }}
        >
          🔄 {t('mode_return') || 'Qaytarish'}
        </button>
      </div>

      <div className="scan-area mt-30">
        <div id="reader" className="scanner-window glass-panel">
            {!isScanning && (
                <div className="scanner-placeholder flex-center flex-col">
                    <div className="scan-icon-large">📷</div>
                    <button className="btn-primary" onClick={startScanner}>
                        {t('start_camera') || 'Kamerani yoqish'}
                    </button>
                </div>
            )}
        </div>
      </div>

      {status.message && (
          <div className={`status-alert glass-panel mt-20 ${status.type}`}>
            {status.message}
          </div>
      )}

      {mode === 'loan' && step === 2 && (
          <div className="step-info glass-card mt-20">
              <p>👤 <b>Talaba:</b> {studentQr}</p>
              <p className="text-muted">Endi kitob QR kodini skanerga tuting.</p>
          </div>
      )}

      <style jsx>{`
        .scanner-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .scanner-header { padding: 20px; display: flex; align-items: center; justify-content: space-between; border-radius: 16px; }
        .back-btn { color: white; text-decoration: none; font-size: 0.9rem; }
        .mode-switcher { display: flex; gap: 10px; padding: 10px; border-radius: 12px; }
        .mode-btn { flex: 1; padding: 12px; border: none; border-radius: 10px; background: rgba(255, 255, 255, 0.05); color: var(--text-muted); cursor: pointer; transition: all 0.3s; font-weight: 600; }
        .mode-btn.active { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; box-shadow: 0 4px 15px var(--primary-glow); }
        .scanner-window { width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 20px; position: relative; border: 2px solid var(--border); }
        .scanner-placeholder { height: 100%; gap: 20px; }
        .scan-icon-large { font-size: 80px; opacity: 0.2; }
        .status-alert { padding: 15px 25px; border-radius: 12px; text-align: center; font-weight: 500; }
        .status-alert.error { border-color: #ef4444; color: #fca5a5; background: rgba(239, 68, 68, 0.1); }
        .status-alert.success { border-color: var(--accent); color: var(--accent); background: rgba(16, 185, 129, 0.1); }
        .status-alert.info { border-color: var(--primary); color: white; background: rgba(59, 130, 246, 0.1); }
        .step-info { padding: 20px; border-radius: 12px; }
        .mt-20 { margin-top: 20px; }
        .mt-30 { margin-top: 30px; }
        .text-muted { color: var(--text-muted); font-size: 0.85rem; margin-top: 5px; }
      `}</style>
    </div>
  );
}
