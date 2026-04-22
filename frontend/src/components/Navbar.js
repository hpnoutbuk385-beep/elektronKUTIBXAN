"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, changeLanguage, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const toggleLanguage = () => {
    const langs = ['uz', 'ru', 'en'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    changeLanguage(langs[nextIndex]);
  };

  return (
    <header className="navbar glass-panel animate-fade">
      <div className="nav-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>☰</button>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              className="search-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-actions">
        <div className="lang-switcher" onClick={toggleLanguage}>
          <span>{language.toUpperCase()}</span>
        </div>

        {user ? (
          /* RO'YXATDAN O'TGANLAR UCHUN */
          <div className="user-nav">
            <div className="notification-bell glass-card">
              🔔 <span className="notification-dot"></span>
            </div>
            <Link href="/profile" className="user-profile-link">
              <div className="avatar-glow">
                <div className="avatar">{user.username[0].toUpperCase()}</div>
              </div>
            </Link>
          </div>
        ) : (
          /* MEHMONLAR UCHUN */
          <div className="guest-nav">
            <button className="btn-login-mini" onClick={() => router.push('/login')}>Kirish</button>
            <button className="btn-register-mini" onClick={() => router.push('/register')}>Ro'yxatdan o'tish</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar { height: 70px; margin: 20px 20px 20px 0; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-radius: 16px; }
        .nav-left { display: flex; align-items: center; gap: 15px; flex-grow: 1; }
        .menu-toggle-btn { display: none; background: none; border: 1px solid rgba(255,255,255,0.1); color: white; font-size: 20px; padding: 8px 12px; border-radius: 10px; cursor: pointer; }
        .search-bar { display: flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.05); padding: 10px 20px; border-radius: 12px; width: 350px; border: 1px solid rgba(255,255,255,0.08); }
        .search-input { background: none; border: none; color: white; width: 100%; outline: none; }
        .nav-actions { display: flex; align-items: center; gap: 15px; }
        .user-nav { display: flex; align-items: center; gap: 15px; }
        .notification-bell { padding: 10px; cursor: pointer; position: relative; }
        .notification-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; }
        .avatar-glow { padding: 3px; background: linear-gradient(135deg, #818cf8, #a855f7); border-radius: 50%; }
        .avatar { width: 35px; height: 35px; background: #020617; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .lang-switcher { cursor: pointer; color: #818cf8; font-weight: 700; border: 1px solid rgba(129, 140, 248, 0.2); padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; }
        
        .guest-nav { display: flex; gap: 10px; }
        .btn-login-mini { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
        .btn-register-mini { background: #818cf8; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }

        @media (max-width: 1024px) {
          .navbar { margin: 15px; padding: 0 15px; }
          .menu-toggle-btn { display: block; }
          .search-bar { display: none; }
          .guest-nav { gap: 5px; }
          .btn-login-mini, .btn-register-mini { padding: 6px 10px; font-size: 0.75rem; }
        }
      `}</style>
    </header>
  );
}
