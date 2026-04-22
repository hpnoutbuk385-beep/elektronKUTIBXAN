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
    { name: t('profile'), href: "/profile", icon: "👤" },
    { name: t('leaderboard'), href: "/leaderboard", icon: "🏆" },
    { name: t('rewards'), href: "/rewards", icon: "🎁" },
  ];

  // Only show Admin Panel to authorized roles
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
          <h2 className="logo-text">{t('digital_library')}</h2>
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
            <p className="mini-name">{user?.username || t('user_label')}</p>
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
          }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 999;
          }

          .mobile-close-btn {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          }

          @media (max-width: 1024px) {
            .sidebar {
              position: fixed;
              height: 100vh;
              top: 0;
              margin: 0;
              border-radius: 0 24px 24px 0;
              transform: translateX(-100%);
              width: 280px;
              background: #0a0a0f !important; /* Solid dark background for mobile */
              box-shadow: 10px 0 50px rgba(0, 0, 0, 0.8);
              padding-top: 40px;
            }
            .sidebar.mobile-open {
              transform: translateX(0);
            }
            .mobile-close-btn {
              display: block;
              margin-left: auto;
              padding: 10px;
            }
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 50px;
          }

          .logo-icon { font-size: 24px; }
          .logo-text { font-size: 1.25rem; color: white; }

          .menu-nav {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex-grow: 1;
          }

          .menu-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 18px;
            border-radius: 12px;
            color: var(--text-muted);
            transition: all 0.3s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            text-decoration: none;
          }

          .menu-item:hover { background: rgba(255, 255, 255, 0.05); color: white; }
          .menu-item.active { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; box-shadow: 0 4px 15px var(--primary-glow); }
          .logout-btn:hover { color: #ef4444; }
          .menu-icon { font-size: 20px; }

          .user-card-mini { margin-top: auto; display: flex; align-items: center; padding: 15px; gap: 10px; }
          .mini-name { font-weight: 600; font-size: 0.9rem; }
          .mini-points { font-size: 0.8rem; color: var(--accent); font-weight: 700; }
        `}</style>
      </aside>
    </>
  );
}
