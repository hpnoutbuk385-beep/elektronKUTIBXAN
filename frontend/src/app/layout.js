"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthPage = ["/login"].includes(pathname);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    setIsLoggedIn(!!token);
    
    // Agar foydalanuvchi tizimga kirmagan bo'lsa va auth sahifasida bo'lmasa, login'ga yo'naltirish
    if (!token && !isAuthPage) {
      router.push("/login");
    }
  }, [pathname, isAuthPage, router]);

  return (
    <html lang="uz" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <div className="app-container">
            {/* Warm Library Background */}
            <div className="fixed-bg">
              <div className="bg-bookshelf-pattern"></div>
              <div className="bg-warm-glow"></div>
              <div className="bg-dust-particles"></div>
            </div>

            {!isAuthPage ? (
              <div className="main-layout">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="content-area">
                  <Navbar onMenuClick={toggleSidebar} />
                  <main className="page-content">
                    {children}
                  </main>
                </div>
              </div>
            ) : (
              <main className="auth-layout">
                {children}
              </main>
            )}
          </div>
        </LanguageProvider>

        <style jsx global>{`
          :root {
            --sidebar-width: 280px;
            --primary: #8B4513;
            --primary-light: #A0522D;
            --primary-glow: rgba(139, 69, 19, 0.35);
            --secondary: #DAA520;
            --accent: #C19A6B;
            --bg-dark: #1a120b;
            --bg-warm: #2a1f14;
            --card-bg: rgba(42, 31, 20, 0.75);
            --text-main: #f5e6c8;
            --text-muted: rgba(196, 168, 130, 0.7);
          }

          body {
            margin: 0;
            background: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Lora', 'Georgia', serif;
            overflow-x: hidden;
          }

          .fixed-bg {
            position: fixed;
            inset: 0;
            background: #1a120b;
            z-index: -1;
            overflow: hidden;
          }

          .bg-bookshelf-pattern {
            position: absolute;
            inset: 0;
            opacity: 0.03;
            background-image:
              repeating-linear-gradient(
                90deg,
                rgba(193, 154, 107, 0.3) 0px,
                rgba(193, 154, 107, 0.3) 2px,
                transparent 2px,
                transparent 60px
              );
          }

          .bg-warm-glow {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse at 20% 20%, rgba(218, 165, 32, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(139, 69, 19, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 0%, rgba(212, 165, 55, 0.05) 0%, transparent 40%);
            animation: ambientPulse 12s infinite alternate ease-in-out;
          }

          @keyframes ambientPulse {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
          }

          .bg-dust-particles {
            position: absolute;
            inset: 0;
            background-image:
              radial-gradient(1px 1px at 10% 30%, rgba(218, 165, 32, 0.3), transparent),
              radial-gradient(1px 1px at 40% 60%, rgba(193, 154, 107, 0.2), transparent),
              radial-gradient(1px 1px at 70% 20%, rgba(218, 165, 32, 0.25), transparent),
              radial-gradient(1px 1px at 90% 70%, rgba(193, 154, 107, 0.15), transparent),
              radial-gradient(1px 1px at 30% 90%, rgba(218, 165, 32, 0.2), transparent);
            animation: dustFloat 20s infinite linear;
          }

          @keyframes dustFloat {
            0% { transform: translateY(0); }
            100% { transform: translateY(-20px); }
          }

          .main-layout {
            display: flex;
            min-height: 100vh;
            padding: 20px 0;
          }

          .content-area {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: 0 40px 40px 20px;
            overflow-x: hidden;
          }

          .page-content {
            margin-top: 20px;
            flex-grow: 1;
          }

          .glass-panel {
            background: rgba(42, 31, 20, 0.75);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(218, 165, 32, 0.12);
            border-radius: 20px;
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(218, 165, 32, 0.08);
          }

          .glass-card {
            background: rgba(193, 154, 107, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(218, 165, 32, 0.08);
            border-radius: 14px;
            transition: all 0.35s ease;
          }

          .glass-card:hover {
            background: rgba(193, 154, 107, 0.1);
            border-color: rgba(218, 165, 32, 0.2);
            transform: translateY(-2px);
          }

          .gradient-text {
            background: linear-gradient(135deg, #f5e6c8 0%, #DAA520 60%, #C19A6B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @media (max-width: 1024px) {
            .content-area {
              padding: 0 20px 20px 20px;
              max-width: 100vw;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
