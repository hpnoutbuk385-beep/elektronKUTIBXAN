"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function CompetitionsManagementPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", start_date: "", end_date: "" });

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      const res = await fetchApi('/competitions/');
      if (res.ok) {
        const data = await res.json();
        setCompetitions(data.results || data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/competitions/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: "", description: "", start_date: "", end_date: "" });
        loadCompetitions();
      }
    } catch (err) { alert("Xatolik"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    const res = await fetchApi(`/competitions/${id}/`, { method: 'DELETE' });
    if (res.ok) loadCompetitions();
  };

  return (
    <div className="dashboard-content animate-fade" style={{ padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 className="gradient-text">Musobaqalar boshqaruvi</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Yangi Musobaqa</button>
      </header>

      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? <p>Yuklanmoqda...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px' }}>Nomi</th>
                <th style={{ padding: '15px' }}>Muddati</th>
                <th style={{ padding: '15px' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px' }}>{item.title}</td>
                  <td style={{ padding: '15px' }}>{item.end_date} gacha</td>
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
            <h2>Yangi Musobaqa</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input type="text" placeholder="Nomi" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }} />
              <textarea placeholder="Tavsif" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }} />
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="date" placeholder="Boshlanish" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }} />
                <input type="date" placeholder="Tugash" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }} />
              </div>
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
