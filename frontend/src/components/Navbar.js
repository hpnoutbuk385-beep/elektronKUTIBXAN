"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, changeLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

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
        {pathname !== '/' && (
          <button className="back-btn glass-card" onClick={() => router.back()}>←</button>
        )}
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
          <span>🌐 {language.toUpperCase()}</span>
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
            <button className="btn-register-mini" onClick={() => router.push('/register')}>Ro'yxat</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar {
          height: 68px; margin: 20px 20px 20px 0; display: flex; align-items: center;
          justify-content: space-between; padding: 0 28px; border-radius: 16px;
          background: rgba(30, 20, 12, 0.85) !important;
          border: 1px solid rgba(218, 165, 32, 0.1) !important;
        }
        .nav-left { display: flex; align-items: center; gap: 15px; flex-grow: 1; }
        .menu-toggle-btn {
          display: none; background: none; border: 1px solid rgba(218, 165, 32, 0.2);
          color: #DAA520; font-size: 20px; padding: 8px 12px; border-radius: 10px; cursor: pointer;
        }
        .back-btn {
          background: rgba(193, 154, 107, 0.1); color: #DAA520;
          border: 1px solid rgba(218, 165, 32, 0.2); padding: 8px 14px;
          border-radius: 10px; cursor: pointer; transition: 0.3s;
          font-size: 1.1rem; font-weight: bold;
        }
        .back-btn:hover { background: rgba(218, 165, 32, 0.15); transform: translateX(-3px); }

        .search-bar {
          display: flex; align-items: center; gap: 12px;
          background: rgba(193, 154, 107, 0.06); padding: 10px 20px; border-radius: 12px;
          width: 350px; border: 1px solid rgba(218, 165, 32, 0.1);
          transition: all 0.3s ease;
        }
        .search-bar:focus-within {
          border-color: rgba(218, 165, 32, 0.3);
          background: rgba(193, 154, 107, 0.1);
          box-shadow: 0 0 15px rgba(218, 165, 32, 0.1);
        }
        .search-input {
          background: none; border: none; color: #f5e6c8; width: 100%; outline: none;
          font-family: 'Lora', serif; font-size: 0.9rem;
        }
        .search-input::placeholder { color: rgba(196, 168, 130, 0.4); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .user-nav { display: flex; align-items: center; gap: 12px; }
        .notification-bell { padding: 10px; cursor: pointer; position: relative; border-radius: 10px; }
        .notification-dot {
          position: absolute; top: 8px; right: 8px; width: 7px; height: 7px;
          background: #DAA520; border-radius: 50%; box-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
        }
        .avatar-glow {
          padding: 2px;
          background: linear-gradient(135deg, #8B4513, #DAA520);
          border-radius: 50%;
        }
        .avatar {
          width: 36px; height: 36px; background: #1a120b; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #DAA520; font-weight: 700; font-family: 'Playfair Display', serif;
          font-size: 1rem;
        }
        .lang-switcher {
          cursor: pointer; color: #DAA520; font-weight: 600;
          border: 1px solid rgba(218, 165, 32, 0.2); padding: 6px 12px;
          border-radius: 8px; font-size: 0.8rem; transition: 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .lang-switcher:hover { background: rgba(218, 165, 32, 0.1); }
        
        .guest-nav { display: flex; gap: 8px; }
        .btn-login-mini {
          background: rgba(193, 154, 107, 0.08); color: #f5e6c8;
          border: 1px solid rgba(218, 165, 32, 0.15); padding: 8px 16px;
          border-radius: 10px; cursor: pointer; font-size: 0.85rem;
          font-family: 'Lora', serif; transition: 0.3s;
        }
        .btn-login-mini:hover { background: rgba(193, 154, 107, 0.15); border-color: rgba(218, 165, 32, 0.3); }
        .btn-register-mini {
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: #f5e6c8; border: none; padding: 8px 16px; border-radius: 10px;
          cursor: pointer; font-size: 0.85rem; font-weight: 600;
          font-family: 'Lora', serif; transition: 0.3s;
          box-shadow: 0 3px 10px rgba(139, 69, 19, 0.3);
        }
        .btn-register-mini:hover { transform: translateY(-1px); box-shadow: 0 5px 15px rgba(139, 69, 19, 0.4); }

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
