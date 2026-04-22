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

  const adminRoles = ['SUPERADMIN', 'REGION_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'];
  if (user && adminRoles.includes(user.role)) {
    menuItems.push({ name: t('admin_panel'), href: "/admin", icon: "🛡️" });
  }

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
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`menu-item ${pathname === item.href ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.name}</span>
            </Link>
          ))}
          
          <button className="menu-item logout-btn" onClick={logout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-label">{t('logout')}</span>
          </button>
        </nav>

        <div className="user-card-mini glass-card">
          <div className="mini-info">
            <p className="mini-name">{user?.first_name || user?.username || t('user_label')}</p>
            <p className="mini-points">🌟 {user?.points || 0} PTS</p>
          </div>
        </div>

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
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(13, 13, 33, 0.7) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(20px);
            border-radius: 24px;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 50px;
          }
          .logo-icon { font-size: 24px; }
          .logo-text { font-size: 1.1rem; color: white; font-weight: 700; line-height: 1.2; }

          .menu-nav {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex-grow: 1;
          }

          .menu-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 18px;
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
          }

          .menu-item:hover {
            color: white;
            background: rgba(255, 255, 255, 0.05);
          }

          .menu-item.active {
            color: #818cf8;
            background: rgba(129, 140, 248, 0.1);
            font-weight: 600;
          }

          .logout-btn {
            background: none; border: none; cursor: pointer; width: 100%; text-align: left;
            margin-top: 10px;
          }
          .logout-btn:hover { color: #f87171; }

          .user-card-mini {
            margin-top: auto;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
          }
          .mini-name { color: white; font-weight: 600; font-size: 0.9rem; }
          .mini-points { color: #fbbf24; font-size: 0.8rem; font-weight: 700; margin-top: 2px; }

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
