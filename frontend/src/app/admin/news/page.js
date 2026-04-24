"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewsManagementPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const router = useRouter();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await fetchApi('/news/');
      if (res.ok) {
        const data = await res.json();
        setNews(data.results || data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/news/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: "", content: "" });
        loadNews();
      }
    } catch (err) { alert("Xatolik"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    const res = await fetchApi(`/news/${id}/`, { method: 'DELETE' });
    if (res.ok) loadNews();
  };

  return (
    <div className="dashboard-content animate-fade" style={{ padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 className="gradient-text">Yangiliklar boshqaruvi</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Yangi qo'shish</button>
      </header>

      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? <p>Yuklanmoqda...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px' }}>Sarlavha</th>
                <th style={{ padding: '15px' }}>Sana</th>
                <th style={{ padding: '15px' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {news.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px' }}>{item.title}</td>
                  <td style={{ padding: '15px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justify_content: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '30px', width: '100%', maxWidth: '500px' }}>
            <h2>Yangi Yangilik</h2>
            <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input type="text" placeholder="Sarlavha" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }} />
              <textarea placeholder="Mazmuni" required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', minHeight: '150px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white' }}>Bekor qilish</button>
                <button type="submit" className="btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
