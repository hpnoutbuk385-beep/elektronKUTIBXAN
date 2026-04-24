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
    { name: t('my_books'), href: "/books", icon: "📖", locked: !user },
    { name: "Yangiliklar", href: "/news", icon: "📰" },
    { name: t('leaderboard'), href: "/leaderboard", icon: "🏆", locked: !user },
    { name: t('classes'), href: "/classes", icon: "🏫", locked: !user, hidden: user?.role === 'STUDENT' },
    { name: "Loglar va Parollar", href: "/admin/passwords", icon: "🔑", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user?.role) },
    { name: "Shaxsiy Ma'lumotlar", href: "/admin/users", icon: "📂", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user?.role) },
    { name: "Kitoblar boshqaruvi", href: "/admin/books", icon: "📚", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user?.role) },
    { name: "Yangiliklar boshqaruvi", href: "/admin/news", icon: "✍️", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user?.role) },
    { name: "Musobaqalar boshqaruvi", href: "/admin/competitions", icon: "🏆", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user?.role) },
    { name: t('rewards'), href: "/rewards", icon: "🎁", locked: !user },
    { name: t('profile'), href: "/profile", icon: "👤", locked: !user },
    { name: "Skaner", href: "/admin/scan", icon: "📷", hidden: !['SUPERADMIN', 'SCHOOL_ADMIN', 'ADMIN'].includes(user?.role) },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar glass-panel ${isOpen ? 'mobile-open' : ''}`}>
        {/* Library Logo Section */}
        <div className="logo-section">
          <div className="logo-emblem">
            <span className="logo-book">📖</span>
          </div>
          <div className="logo-text-group">
            <h2 className="logo-text">Kutubxona</h2>
            <span className="logo-subtitle">Raqamli Bilim Markazi</span>
          </div>
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="user-quick-info glass-card">
            <div className="user-role-badge">
              {user.role === 'SUPERADMIN' ? '👑 Super Admin' : 
               user.role === 'SCHOOL_ADMIN' ? '🏛️ Maktab Admin' : 
               user.role === 'TEACHER' ? '🎓 O\'qituvchi' : '📖 O\'quvchi'}
            </div>
            <div className="user-name-small">{user.first_name} {user.last_name}</div>
          </div>
        )}

        {/* Decorative Divider */}
        <div className="ornament-divider">
          <span className="ornament-line"></span>
          <span className="ornament-symbol">✦</span>
          <span className="ornament-line"></span>
        </div>
        
        <nav className="menu-nav">
          {menuItems.filter(item => !item.hidden).map((item) => {
            const isActive = pathname === item.href;
            if (item.locked) {
              return (
                <div key={item.href} className="menu-item locked" title="Kirish kerak">
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.name}</span>
                  <span className="lock-badge">🔒</span>
                </div>
              );
            }
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.name}</span>
                {isActive && <span className="active-dot"></span>}
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

        {/* Bottom decoration */}
        <div className="sidebar-footer">
          <div className="footer-quote">
            <span className="quote-mark">❝</span>
            <p>Kitob — eng yaxshi do'st</p>
          </div>
        </div>

        <style jsx>{`
          .sidebar {
            width: 280px; height: calc(100vh - 40px); position: sticky; top: 20px; left: 0;
            display: flex; flex-direction: column; padding: 28px 20px; margin-left: 20px;
            z-index: 1000; transition: 0.4s;
            background: rgba(30, 20, 12, 0.9) !important;
            border: 1px solid rgba(218, 165, 32, 0.12) !important;
          }

          .logo-section { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
          .logo-emblem {
            width: 44px; height: 44px; border-radius: 12px;
            background: linear-gradient(135deg, #8B4513, #DAA520);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
          }
          .logo-book { font-size: 22px; }
          .logo-text-group { display: flex; flex-direction: column; }
          .logo-text { font-size: 1.15rem; color: #f5e6c8; font-weight: 800; font-family: 'Playfair Display', serif; letter-spacing: 0.03em; }
          .logo-subtitle { font-size: 0.65rem; color: rgba(218, 165, 32, 0.6); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
          .mobile-close-btn { display: none; }

          .ornament-divider {
            display: flex; align-items: center; gap: 10px; margin-bottom: 25px; padding: 0 5px;
          }
          .ornament-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent); }
          .ornament-symbol { color: rgba(218, 165, 32, 0.4); font-size: 0.7rem; }
          
          .user-quick-info {
            padding: 12px 15px; margin-bottom: 20px; border-radius: 14px;
            background: rgba(218, 165, 32, 0.04) !important;
            border: 1px solid rgba(218, 165, 32, 0.1) !important;
          }
          .user-role-badge {
            font-size: 0.7rem; color: #DAA520; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;
          }
          .user-name-small {
            font-size: 0.85rem; color: #f5e6c8; font-weight: 500; font-family: 'Lora', serif;
          }

          .menu-icon {
            font-size: 1.2rem;
            width: 24px;
            display: flex;
            justify-content: center;
          }
          .menu-item.locked { 
            opacity: 0.4; 
            cursor: not-allowed; 
            filter: grayscale(0.5);
          }
          .lock-badge { font-size: 0.75rem; opacity: 0.6; margin-left: 8px; }
          
          .logout-btn { background: none; border: none; cursor: pointer; width: 100%; margin-top: 15px; }
          .logout-btn:hover { color: #e57373 !important; }

          .sidebar-footer {
            margin-top: auto; padding-top: 20px;
            border-top: 1px solid rgba(218, 165, 32, 0.1);
          }
          .footer-quote { text-align: center; padding: 10px 0; }
          .quote-mark { color: rgba(218, 165, 32, 0.3); font-size: 1.3rem; }
          .footer-quote p {
            color: rgba(196, 168, 130, 0.4); font-size: 0.8rem;
            font-family: 'Playfair Display', serif; font-style: italic;
            margin-top: 4px;
          }

          @media (max-width: 1024px) {
            .sidebar { position: fixed; top: 0; left: 0; height: 100vh; margin: 0; border-radius: 0 24px 24px 0; transform: translateX(-100%); }
            .sidebar.mobile-open { transform: translateX(0); }
            .mobile-close-btn { display: block; background: none; border: none; color: #f5e6c8; font-size: 20px; margin-left: auto; }
          }
        `}</style>
      </aside>
    </>
  );
}
