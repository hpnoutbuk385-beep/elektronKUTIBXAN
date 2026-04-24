"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a120b', color: '#f5e6c8', fontFamily: 'serif' }}>
      <p>Yo'naltirilmoqda...</p>
    </div>
  );
}
