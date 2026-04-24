"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function PasswordListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", role: "STUDENT" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchApi('/users/');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.results || data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetchApi('/users/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ username: "", password: "", role: "STUDENT" });
        loadUsers();
      } else {
        const data = await res.json();
        setError(Object.values(data).flat().join(", ") || "Xatolik");
      }
    } catch (err) { setError("Server xatosi"); }
  };

  return (
    <div className="dashboard-content animate-fade" style={{ padding: '40px' }}>
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Loglar va Parollar</h1>
          <p className="subtitle">O'quvchilarga beriladigan login va parollar ro'yxati</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-secondary" onClick={() => setShowModal(true)}>➕ Yangi Login Yaratish</button>
          <button className="btn-primary" onClick={() => window.print()}>🖨️ Chop etish (PDF)</button>
        </div>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up">
            <h2>🔑 Yangi Login Yaratish</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Login (Username)</label>
                <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Parol</label>
                <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="STUDENT">O'quvchi</option>
                  <option value="TEACHER">O'qituvchi</option>
                </select>
              </div>
              {error && <p className="error-text">{error}</p>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary">Yaratish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-panel table-container animate-slide-up">
        {loading ? (
          <div className="loader">Yuklanmoqda...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>F.I.SH</th>
                <th>Rol</th>
                <th>Login (Username)</th>
                <th>Parol</th>
                <th>Sinf</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="user-cell">
                    <div className="user-avatar">{u.first_name?.[0]}{u.last_name?.[0]}</div>
                    <div>{u.first_name} {u.last_name}</div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === 'TEACHER' ? 'O\'qituvchi' : u.role === 'STUDENT' ? 'O\'quvchi' : u.role}
                    </span>
                  </td>
                  <td><code style={{ background: 'rgba(218,165,32,0.1)', padding: '5px 10px', borderRadius: '5px' }}>{u.username}</code></td>
                  <td><code style={{ background: 'rgba(76,175,80,0.1)', color: '#4caf50', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>{u.plain_password || '********'}</code></td>
                  <td>{u.school_class_details?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .subtitle { color: rgba(196, 168, 130, 0.5); font-family: 'Lora', serif; }
        .table-container { padding: 0; overflow: hidden; border-radius: 20px; }
        .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
        .custom-table th { background: rgba(218, 165, 32, 0.1); padding: 18px 25px; font-weight: 700; color: #DAA520; font-size: 0.85rem; text-transform: uppercase; }
        .custom-table td { padding: 15px 25px; border-bottom: 1px solid rgba(218, 165, 32, 0.08); font-size: 0.95rem; }
        .custom-table tr:hover { background: rgba(218, 165, 32, 0.03); }
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #8B4513, #DAA520); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #fff; }
        .role-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .role-badge.STUDENT { background: rgba(33, 150, 243, 0.1); color: #2196f3; }
        .role-badge.TEACHER { background: rgba(76, 175, 80, 0.1); color: #4caf50; }
        .btn-primary { background: linear-gradient(135deg, #8B4513, #DAA520); color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .btn-secondary { background: rgba(218, 165, 32, 0.1); color: #DAA520; border: 1px solid rgba(218, 165, 32, 0.2); padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-secondary:hover { background: rgba(218, 165, 32, 0.2); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .modal-content { width: 100%; max-width: 450px; padding: 30px; border-radius: 24px; }
        .modal-content h2 { margin-bottom: 25px; color: #DAA520; font-family: 'Playfair Display', serif; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { color: rgba(196, 168, 130, 0.7); font-size: 0.85rem; }
        .form-group input, .form-group select { background: rgba(193, 154, 107, 0.05); border: 1px solid rgba(218, 165, 32, 0.15); padding: 12px 18px; border-radius: 12px; color: #f5e6c8; outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
        .modal-actions button[type="button"] { background: none; border: none; color: rgba(196, 168, 130, 0.6); cursor: pointer; }
        .error-text { color: #e57373; font-size: 0.85rem; margin-top: 10px; }
        
        @media print {
          .btn-primary, .sidebar, .navbar { display: none !important; }
          .dashboard-content { padding: 0 !important; }
          .glass-panel { border: none !important; box-shadow: none !important; background: white !important; color: black !important; }
          .custom-table th { color: black !important; border-bottom: 2px solid black !important; }
          .custom-table td { color: black !important; border-bottom: 1px solid #ddd !important; }
          .gradient-text { background: none !important; -webkit-text-fill-color: black !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
