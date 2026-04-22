"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  // MEHMONLAR UCHUN FAQAT KERAKLI MENULAR
  const menuItems = user ? [
    { name: t('dashboard'), href: "/", icon: "📊" },
    { name: t('library_title'), href: "/library", icon: "📚" },
    { name: t('my_books'), href: "/books", icon: "📖" },
    { name: t('leaderboard'), href: "/leaderboard", icon: "🏆" },
    { name: t('rewards'), href: "/rewards", icon: "🎁" },
    { name: t('profile'), href: "/profile", icon: "👤" },
  ] : [
    { name: t('dashboard'), href: "/", icon: "📊" },
    { name: t('library_title'), href: "/library", icon: "📚" },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar glass-panel ${isOpen ? 'mobile-open' : ''}`}>
        <div className="logo-section">
          <span className="logo-icon">📖</span>
          <h2 className="logo-text">Raqamli Kutubxona</h2>
          <button className="mobile-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <nav className="menu-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.name}</span>
              </Link>
            );
          })}
          
          {user && (
            <button className="menu-item logout-btn" onClick={logout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Chiqish</span>
            </button>
          )}
        </nav>

        <style jsx>{`
          .sidebar {
            width: 280px; height: calc(100vh - 40px); position: sticky; top: 20px; left: 0;
            display: flex; flex-direction: column; padding: 30px 20px; margin-left: 20px;
            z-index: 1000; transition: 0.4s; background: rgba(13, 13, 33, 0.8) !important;
          }
          .logo-section { display: flex; align-items: center; gap: 12px; margin-bottom: 50px; }
          .logo-text { font-size: 1.1rem; color: white; font-weight: 800; }
          .mobile-close-btn { display: none; }

          .menu-nav { display: flex; flex-direction: column; gap: 8px; }
          .menu-item {
            display: flex; align-items: center; gap: 15px; padding: 12px 15px; border-radius: 12px;
            color: rgba(255, 255, 255, 0.5); transition: 0.3s; text-decoration: none;
          }
          .menu-item:hover { color: white; background: rgba(255, 255, 255, 0.05); }
          .menu-item.active { color: #818cf8 !important; background: rgba(129, 140, 248, 0.1); font-weight: 700; }
          
          .logout-btn { background: none; border: none; cursor: pointer; width: 100%; margin-top: 20px; }
          .logout-btn:hover { color: #f87171; }

          @media (max-width: 1024px) {
            .sidebar { position: fixed; top: 0; left: 0; height: 100vh; margin: 0; border-radius: 0 24px 24px 0; transform: translateX(-100%); }
            .sidebar.mobile-open { transform: translateX(0); }
            .mobile-close-btn { display: block; background: none; border: none; color: white; font-size: 20px; margin-left: auto; }
          }
        `}</style>
      </aside>
    </>
  );
}
