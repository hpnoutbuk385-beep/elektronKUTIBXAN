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

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    setIsLoggedIn(!!token);
    
    // Tizimga kirmagan bo'lsa va login/register bo'lmasa -> /library ga yuborish
    if (!token && !["/login", "/register", "/library"].includes(pathname)) {
      router.replace("/library");
    }
  }, [pathname, router]);

  const isAuthPage = ["/login", "/register"].includes(pathname);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          <div className="app-container">
            {/* Cinematic Background hamma joyda bir xil */}
            <div className="fixed-bg"></div>

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
            --primary: #818cf8;
            --primary-glow: rgba(129, 140, 248, 0.3);
            --bg-dark: #030712;
            --card-bg: rgba(17, 24, 39, 0.7);
            --text-main: #f9fafb;
            --text-muted: rgba(255, 255, 255, 0.5);
          }

          body {
            margin: 0;
            background: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
          }

          .fixed-bg {
            position: fixed;
            inset: 0;
            background: #020617;
            z-index: -1;
            overflow: hidden;
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
            background: rgba(13, 13, 33, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            transition: all 0.3s ease;
          }

          .glass-card:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }

          .gradient-text {
            background: linear-gradient(135deg, #fff 0%, #818cf8 100%);
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
