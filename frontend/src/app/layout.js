"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    
    // Tizimga kirmagan foydalanuvchi → kutubxonani ko'rsin
    if (pathname === "/" && !token) {
      router.replace("/library");
      return;
    }

    // If logged in and at auth pages -> force to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      router.replace("/");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPublicPage = ["/login", "/register", "/library"].includes(pathname);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change
  }, [pathname]);

  if (loading && pathname === "/") {
    return (
      <html lang="uz">
        <body className="flex-center h-screen bg-dark">
          <div style={{color: 'white'}}>Yuklanmoqda...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          {!isPublicPage ? (
            <div className={`layout-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <div className="main-content">
                <Navbar onMenuClick={toggleSidebar} />
                <main className="page-container">
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <main className="public-layout">{children}</main>
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}

