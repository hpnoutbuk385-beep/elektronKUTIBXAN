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
    
    // 1. If at root and no token -> force to register
    if (pathname === "/" && !token) {
      router.replace("/register");
      return;
    }

    // 2. If logged in and at auth pages -> force to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      router.replace("/");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  const isPublicPage = ["/login", "/register"].includes(pathname);

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
            <div className="layout-wrapper">
              <Sidebar />
              <div className="main-content">
                <Navbar />
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
