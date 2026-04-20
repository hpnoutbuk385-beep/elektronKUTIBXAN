"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
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
    { name: t('my_books'), href: "/books", icon: "📚" },
    { name: t('profile'), href: "/profile", icon: "👤" },
    { name: t('leaderboard'), href: "/leaderboard", icon: "🏆" },
    { name: t('rewards'), href: "/rewards", icon: "🎁" },
    { name: t('admin_panel'), href: "/admin", icon: "🛡️" },
  ];

  return (
    <aside className="sidebar glass-panel animate-fade">
      <div className="logo-section">
        <span className="logo-icon">📖</span>
        <h2 className="logo-text">Raqamli <span className="gradient-text">Kutubxona</span></h2>
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
          <p className="mini-name">{user?.username || 'Foydalanuvchi'}</p>
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
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 50px;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo-text {
          font-size: 1.25rem;
          color: white;
        }

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
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .menu-item.active {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          box-shadow: 0 4px 15px var(--primary-glow);
        }

        .logout-btn:hover {
          color: #ef4444;
        }

        .menu-icon {
          font-size: 20px;
        }

        .user-card-mini {
          margin-top: auto;
          display: flex;
          align-items: center;
          padding: 15px;
          gap: 10px;
        }

        .mini-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .mini-points {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 700;
        }
      `}</style>
    </aside>
  );
}
