"use client";
import { useEffect, useState, Suspense } from 'react';
import { fetchApi } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function DashboardContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [stats, setStats] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const searchParams = useSearchParams();
  const query = searchParams.get('search');

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetchApi('/auth/profile/');
        const userData = await userRes.json();
        setUser(userData);

        setStats([
          { label: t('stat_books'), value: "24", icon: "📖", color: "var(--primary)" },
          { label: t('stat_points'), value: userData.points?.toLocaleString() || "0", icon: "🌟", color: "var(--accent)" },
          { label: t('stat_rank'), value: "3", icon: "🏆", color: "var(--secondary)" },
        ]);

        const transRes = await fetchApi('/transactions/');
        const transData = await transRes.json();
        const results = Array.isArray(transData) ? transData : transData.results || [];
        
        const activeBooks = results
          .filter(t => t.status === 'BORROWED')
          .slice(0, 3)
          .map(tx => ({
            id: tx.id,
            title: tx.book_details.title,
            author: tx.book_details.author,
            progress: Math.floor(Math.random() * 60) + 10,
            cover: tx.book_details.image || "📒",
            isImage: !!tx.book_details.image
          }));
        
        setCurrentBooks(activeBooks);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [t]);

  useEffect(() => {
    async function performSearch() {
      if (!query) {
          setSearchResults([]);
          return;
      }
      setSearching(true);
      try {
          const res = await fetchApi(`/books/?search=${query}`);
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
          console.error("Search error", err);
      } finally {
          setSearching(false);
      }
    }
    performSearch();
  }, [query]);

  if (loading) return <div className="flex-center h-full">{t('loading')}</div>;

  return (
    <div className="dashboard animate-fade">
      {query ? (
          <div className="search-results-section glass-panel">
              <div className="flex-between">
                <h3 className="section-title">🔍 "{query}" {t('search_results')}</h3>
                <Link href="/" className="link text-small">X {t('clear')}</Link>
              </div>
              {searching ? (
                  <p>{t('searching')}</p>
              ) : (
                  <div className="books-grid-mini">
                      {searchResults.length > 0 ? searchResults.map(book => (
                          <div key={book.id} className="book-card-mini glass-card">
                              <div className="mini-cover">📚</div>
                              <div className="mini-details">
                                  <h4>{book.title}</h4>
                                  <p>{book.author}</p>
                                  <span className={`status-pill ${book.available_copies > 0 ? 'success' : 'danger'}`}>
                                      {book.available_copies > 0 ? t('available_status') : t('unavailable_status')}
                                  </span>
                              </div>
                          </div>
                      )) : <p className="text-muted">{t('no_results')}</p>}
                  </div>
              )}
          </div>
      ) : (
        <>
            <div className="welcome-section">
                <h1 className="welcome-title">{t('welcome')}, <span className="gradient-text">{user?.username || t('student_role')}!</span> 👋</h1>
                <p className="welcome-subtitle">{t('welcome_subtitle')}</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat) => (
                <div key={stat.label} className="stat-card glass-panel">
                    <div className="stat-icon" style={{ backgroundColor: stat.color }}>{stat.icon}</div>
                    <div className="stat-info">
                    <p className="stat-label">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                    </div>
                </div>
                ))}
            </div>

            <div className="main-grid">
                <div className="reading-list glass-panel">
                <h3 className="section-title">{t('reading_now')}</h3>
                <div className="book-list">
                    {currentBooks.length > 0 ? currentBooks.map((book) => (
                    <div key={book.id || book.title} className="book-item glass-card">
                        <div className="book-cover">
                        {book.isImage ? <img src={book.cover} alt={book.title} className="cover-img" /> : book.cover}
                        </div>
                        <div className="book-details">
                        <h4 className="book-title">{book.title}</h4>
                        <p className="book-author">{book.author}</p>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${book.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{book.progress}% {t('read')}</span>
                        </div>
                    </div>
                    )) : <p className="text-muted">{t('no_reading')}</p>}
                </div>
                </div>

                <div className="actions-section">
                <div className="qr-card glass-panel flex-center flex-col">
                    <div className="qr-icon-big">🔳</div>
                    <h3>{t('book_action')}</h3>
                    <p>{t('scan_qr')}</p>
                    <Link href="/scanner" className="btn-primary-link mt-20">{t('start_scan')}</Link>
                </div>
                
                <div className="rank-card glass-panel mt-20">
                    <h3 className="section-title">{t('top_readers')}</h3>
                    <div className="rank-list">
                    <div className="rank-item">
                        <span className="rank-num">1</span>
                        <span className="rank-name">Azizbek R.</span>
                        <span className="rank-pts">1,540 PTS</span>
                    </div>
                    <div className="rank-item">
                        <span className="rank-num">2</span>
                        <span className="rank-name">Madina S.</span>
                        <span className="rank-pts">1,320 PTS</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>
      )}

      <style jsx>{`
        .dashboard { display: flex; flex-direction: column; gap: 30px; }
        .welcome-title { font-size: 2.2rem; margin-bottom: 5px; }
        .welcome-subtitle { color: var(--text-muted); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stat-card { padding: 25px; display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; }
        .stat-value { font-size: 1.5rem; margin-top: 2px; }
        .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        
        @media (max-width: 1024px) {
            .stats-grid { grid-template-columns: 1fr; }
            .main-grid { grid-template-columns: 1fr; }
            .welcome-title { font-size: 1.6rem; }
            .stat-card { padding: 15px; }
            .reading-list { padding: 20px; }
            .book-item { padding: 15px; gap: 15px; }
        }

        .section-title { margin-bottom: 20px; font-size: 1.2rem; }
        .reading-list { padding: 30px; }
        .book-list { display: flex; flex-direction: column; gap: 15px; }
        .book-item { padding: 20px; display: flex; gap: 20px; }
        .book-cover { font-size: 40px; background: rgba(255, 255, 255, 0.05); width: 70px; height: 90px; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; }
        .cover-img { width: 100%; height: 100%; object-fit: cover; }
        .book-details { flex-grow: 1; }
        .book-author { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px; }
        .progress-container { height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; margin-bottom: 8px; }
        .progress-bar { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 3px; }
        .progress-text { font-size: 0.75rem; color: var(--text-muted); }
        .actions-section { display: flex; flex-direction: column; }
        .qr-card { padding: 40px 20px; text-align: center; }
        .qr-icon-big { font-size: 60px; margin-bottom: 15px; color: var(--primary); }
        .rank-card { padding: 25px; }
        .rank-list { display: flex; flex-direction: column; gap: 12px; }
        .rank-item { display: flex; align-items: center; gap: 15px; padding: 10px; }
        .rank-num { font-weight: 800; color: var(--primary); width: 20px; }
        .rank-name { flex-grow: 1; }
        .rank-pts { font-weight: 600; color: var(--accent); }
        .mt-20 { margin-top: 20px; }
        .flex-col { flex-direction: column; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .text-muted { color: var(--text-muted); }
        .text-small { font-size: 0.8rem; }
        
        .search-results-section { padding: 30px; min-height: 400px; }
        .books-grid-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .book-card-mini { padding: 15px; display: flex; gap: 15px; align-items: center; }
        .mini-cover { font-size: 30px; background: rgba(255,255,255,0.05); width: 50px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .mini-details h4 { font-size: 0.95rem; margin-bottom: 3px; }
        .mini-details p { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; }
        .status-pill { padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
        .status-pill.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <DashboardContent />
    </Suspense>
  );
}
