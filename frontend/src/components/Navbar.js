"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { language, changeLanguage, t } = useLanguage();

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

  const toggleLanguage = () => {
    const langs = ['uz', 'ru', 'en'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    changeLanguage(langs[nextIndex]);
  };

  return (
    <header className="navbar glass-panel animate-fade">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder={t('search_placeholder')} className="search-input" />
      </div>

      <div className="nav-actions">
        <div className="lang-switcher" onClick={toggleLanguage} title="Change Language">
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="notification-bell glass-card">
          🔔
          <span className="notification-dot"></span>
        </div>
        <div className="user-profile">
          <div className="avatar-glow">
            <div className="avatar">{user?.username ? user.username[0].toUpperCase() : 'U'}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: var(--header-height);
          margin: 20px 20px 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          border-radius: 16px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 10px 20px;
          border-radius: 12px;
          width: 400px;
          border: 1px solid var(--border);
        }

        .search-input {
          background: none;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-bell {
          padding: 10px;
          cursor: pointer;
          position: relative;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid var(--bg-dark);
        }

        .avatar-glow {
          padding: 3px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 50%;
        }

        .avatar {
          width: 35px;
          height: 35px;
          background: var(--bg-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }
      `}</style>
    </header>
  );
}
