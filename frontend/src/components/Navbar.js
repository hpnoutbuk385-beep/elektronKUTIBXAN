"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
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
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
        router.push(`/?search=${searchQuery}`);
    }
  };

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
              onKeyUp={handleSearch}
          />
        </div>
      </div>

      <div className="nav-actions">
        <div className="lang-switcher" onClick={toggleLanguage} title="Change Language">
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="notification-bell glass-card">
          🔔
          <span className="notification-dot"></span>
        </div>
        <Link href="/profile" className="user-profile-link">
            <div className="user-profile">
                <div className="avatar-glow">
                    <div className="avatar">{user?.username ? user.username[0].toUpperCase() : 'U'}</div>
                </div>
            </div>
        </Link>
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
          gap: 15px;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-grow: 1;
        }

        .menu-toggle-btn {
          display: none;
          background: none;
          border: 1px solid var(--border);
          color: white;
          font-size: 20px;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        @media (max-width: 1024px) {
          .navbar {
            margin: 15px;
            padding: 0 15px;
          }
          .menu-toggle-btn {
            display: block;
          }
          .search-bar {
            width: 100% !important;
          }
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
          transition: 0.3s;
        }
        .search-bar:focus-within {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--primary);
            box-shadow: 0 0 15px var(--primary-glow);
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
          transition: 0.3s;
        }
        .avatar-glow:hover {
            transform: scale(1.1);
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
        .user-profile-link { text-decoration: none; }
      `}</style>
    </header>
  );
}
