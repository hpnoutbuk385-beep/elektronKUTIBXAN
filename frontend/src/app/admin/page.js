"use client";
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
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
        const orgRes = await fetchApi('/organizations/');
        const orgData = await orgRes.json();
        
        // This is a simplified mockup of how admin stats might be fetched
        // In a real app, you'd have a dedicated stats endpoint.
        const booksRes = await fetchApi('/books/');
        const booksData = await booksRes.json();

        setStats([
          { label: t('total_students'), value: "850", trend: "+12%" },
          { label: t('book_fund'), value: booksData.count || "0", trend: `+50 ${t('new_suffix')}` },
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
      `}</style>
    </div>
  );
}
