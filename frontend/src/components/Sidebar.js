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

  const menuItems = [
    { name: t('dashboard'), href: "/", icon: "📊" },
    { name: t('library_title'), href: "/library", icon: "📚" },
    { name: t('my_books'), href: "/books", icon: "📖" },
    { name: t('leaderboard'), href: "/leaderboard", icon: "🏆" },
    { name: t('rewards'), href: "/rewards", icon: "🎁" },
    { name: t('profile'), href: "/profile", icon: "👤" },
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
          
          <button className="menu-item logout-btn" onClick={logout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Chiqish</span>
          </button>
        </nav>

        <style jsx>{`
          .sidebar {
            width: var(--sidebar-width);
            height: calc(100vh - 40px);
            position: sticky;
            top: 20px;
            left: 0;
            display: flex;
            flex-direction: column;
            padding: 30px 20px;
            margin-left: 20px;
            z-index: 1000;
            transition: all 0.4s ease;
            background: rgba(13, 13, 33, 0.8) !important;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 50px;
            padding-left: 10px;
          }
          .logo-icon { font-size: 24px; }
          .logo-text { font-size: 1.1rem; color: white; font-weight: 800; }

          .menu-nav {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .menu-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 15px;
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.5); /* Asl holatda kulrang */
            transition: all 0.3s ease;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            border-bottom: 2px solid transparent;
          }

          .menu-item:hover {
            color: white;
            background: rgba(255, 255, 255, 0.05);
          }

          /* FAQAT ACTIVE BO'LGANDA BINAFSHARANG VA UNDERLINE BO'LADI */
          .menu-item.active {
            color: #a855f7 !important; 
            background: rgba(168, 85, 247, 0.1);
            font-weight: 700;
            border-bottom: 2px solid #a855f7;
            text-decoration: underline;
          }

          .logout-btn {
            background: none; border: none; cursor: pointer; width: 100%; text-align: left;
            margin-top: 20px; color: rgba(255, 255, 255, 0.4);
          }
          .logout-btn:hover { color: #f87171; }

          @media (max-width: 1024px) {
            .sidebar {
              position: fixed; top: 0; left: 0; height: 100vh; margin: 0;
              border-radius: 0 24px 24px 0;
              transform: translateX(-100%);
            }
            .sidebar.mobile-open { transform: translateX(0); }
          }
        `}</style>
      </aside>
    </>
  );
}
