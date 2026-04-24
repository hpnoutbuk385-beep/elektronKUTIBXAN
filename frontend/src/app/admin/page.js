"use client";
import { useEffect, useState } from 'react';
import { fetchApi, getMediaUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState([
    { label: t('total_students'), value: "0", trend: "..." },
    { label: t('book_fund'), value: "0", trend: "..." },
    { label: t('monthly_activity'), value: "0", trend: "..." },
    { label: t('average_points'), value: "0", trend: "..." },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const adminRoles = ['SUPERADMIN', 'REGION_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'];
    
    if (!adminRoles.includes(userData.role)) {
      router.push('/');
      return;
    }
    async function loadStats() {
      try {
        // This is a simplified mockup of how admin stats might be fetched
        const booksRes = await fetchApi('/books/');
        const booksData = await booksRes.json();
        setBooks(booksData);

        setStats([
          { label: t('total_students'), value: "850", trend: "+12%" },
          { label: t('book_fund'), value: booksData.length || "0", trend: `+50 ${t('new_suffix')}` },
          { label: t('monthly_activity'), value: "485", trend: "+24%" },
          { label: t('average_points'), value: "420", trend: "+15" },
        ]);
      } catch (err) {
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleDownloadReport = () => {
    alert(t('generating_report'));
    window.open('http://localhost:8000/api/reports/school-pdf/', '_blank');
  };

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="admin-dashboard animate-fade">
      <div className="page-header flex-center-between">
        <div>
          <h1 className="gradient-text">{t('admin_panel')}</h1>
          <p className="subtitle">{t('admin_subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={handleDownloadReport}>
          📥 {t('download_report')}
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card glass-panel">
            <p className="stat-label">{stat.label}</p>
            <div className="stat-row">
              <h2 className="stat-value">{stat.value}</h2>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-placeholder glass-panel flex-center">
        <div className="chart-mock">
          <div className="chart-bar" style={{ height: '40%' }}></div>
          <div className="chart-bar" style={{ height: '70%' }}></div>
          <div className="chart-bar" style={{ height: '55%' }}></div>
          <div className="chart-bar" style={{ height: '90%' }}></div>
          <div className="chart-bar" style={{ height: '65%' }}></div>
        </div>
        <p className="mt-20">{t('weekly_activity')}</p>
      </div>

      {/* Book Management Section */}
      <div className="admin-inventory glass-panel animate-slide-up">
        <h3 className="section-title">📚 Kitoblar Inventarizatsiyasi</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kitob</th>
                <th>QR Kod</th>
                <th>Soni</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>
                    <div className="book-cell">
                      <span className="b-title">{book.title}</span>
                      <span className="b-author">{book.author}</span>
                    </div>
                  </td>
                  <td>
                    <div className="qr-cell">
                      <img src={getMediaUrl(book.qr_code_image)} alt="QR" className="table-qr" />
                      <code className="qr-code-text">{book.qr_code}</code>
                    </div>
                  </td>
                  <td>{book.available_copies} / {book.total_copies}</td>
                  <td>
                    <button className="btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Chop etish</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard { display: flex; flex-direction: column; gap: 30px; }
        .flex-center-between { display: flex; align-items: center; justify-content: space-between; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-card { padding: 20px; }
        .stat-label { color: var(--text-muted); font-size: 0.85rem; }
        .stat-row { display: flex; align-items: baseline; gap: 10px; margin-top: 10px; }
        .stat-value { font-size: 1.8rem; }
        .stat-trend { font-size: 0.8rem; color: #10b981; font-weight: 600; }
        .charts-placeholder { height: 300px; flex-direction: column; padding: 40px; }
        .chart-mock { display: flex; align-items: flex-end; gap: 20px; height: 150px; }
        .chart-bar { 
          width: 40px; background: linear-gradient(to top, var(--primary), var(--secondary)); 
          border-radius: 8px 8px 0 0; opacity: 0.7; transition: 0.3s;
        }
        .chart-bar:hover { opacity: 1; transform: scaleX(1.1); }
        .mt-20 { margin-top: 20px; }

        .admin-inventory { padding: 30px; }
        .section-title { font-family: 'Playfair Display', serif; color: #f5e6c8; margin-bottom: 25px; }
        .table-wrapper { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { color: var(--text-muted); font-size: 0.85rem; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .admin-table td { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.03); color: #f5e6c8; }
        
        .book-cell { display: flex; flex-direction: column; gap: 4px; }
        .b-title { font-weight: 700; font-family: 'Playfair Display', serif; }
        .b-author { font-size: 0.85rem; color: var(--secondary); opacity: 0.7; }
        
        .qr-cell { display: flex; align-items: center; gap: 15px; }
        .table-qr { width: 60px; height: 60px; background: white; padding: 4px; border-radius: 8px; }
        .qr-code-text { font-size: 0.75rem; color: var(--text-muted); opacity: 0.5; font-family: monospace; }
        
        .btn-sm { padding: 6px 12px; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
