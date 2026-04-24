"use client";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/Sidebar";

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", 
    email: "", phone: "", role: "STUDENT", 
    school_class: "", subject: "", password: "User123!"
  });
  const [classes, setClasses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setCurrentUser(JSON.parse(userData));
    loadUsers();
  }, []);

  useEffect(() => {
    if (showModal && currentUser?.organization) {
      loadClasses(currentUser.organization);
    }
  }, [showModal, currentUser]);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetchApi('/users/');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.results || data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function loadClasses(orgId) {
    try {
      const res = await fetchApi(`/classes/?organization=${orgId}`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.results || data);
      }
    } catch (err) { console.error(err); }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetchApi('/users/', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          organization: currentUser?.organization
        })
      });
      if (res.ok) {
        setShowModal(false);
        loadUsers();
        setFormData({ ...formData, username: "", first_name: "", last_name: "", email: "", phone: "", school_class: "", subject: "" });
      } else {
        const data = await res.json();
        setError(Object.values(data).flat().join(", ") || "Xatolik");
      }
    } catch (err) { setError("Server xatosi"); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetchApi(`/users/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        loadUsers();
      } else {
        alert("O'chirishda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server bilan bog'lanib bo'lmadi");
    }
  };

  return (
    <div className="dashboard-content animate-fade">
      <header className="page-header animate-fade">
        <div>
          <h1 className="gradient-text">Login va Parollar</h1>
          <p className="subtitle">O'quvchi va o'qituvchilarga login/parol berish bo'limi</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>➕</span> Yangi Foydalanuvchi qo'shish
        </button>
      </header>

      <div className="glass-panel table-container animate-slide-up">
        {loading ? (
          <div className="loader">Yuklanmoqda...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>F.I.SH</th>
                <th>Login</th>
                <th>Rol</th>
                <th>Sinf / Fan</th>
                <th>Ball</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="user-cell">
                    <div className="user-avatar">{u.first_name?.[0]}{u.last_name?.[0]}</div>
                    <div>{u.first_name} {u.last_name}</div>
                  </td>
                  <td><code>{u.username}</code></td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === 'TEACHER' ? 'O\'qituvchi' : u.role === 'STUDENT' ? 'O\'quvchi' : u.role}
                    </span>
                  </td>
                  <td>{u.role === 'STUDENT' ? u.school_class_details?.name : u.subject || '-'}</td>
                  <td className="points-cell">{u.points} 🪙</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" title="Parolni o'zgartirish" onClick={() => {
                        const newPass = prompt(`${u.username} uchun yangi parol:`, "User123!");
                        if (newPass) {
                          fetchApi(`/users/${u.id}/change-password/`, {
                            method: 'POST',
                            body: JSON.stringify({ password: newPass })
                          }).then(res => res.ok ? alert("Muvaffaqiyatli o'zgartirildi") : alert("Xatolik"));
                        }
                      }}>🔑</button>
                      <button className="icon-btn delete" title="O'chirish" onClick={() => handleDeleteUser(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-panel animate-scale">
              <div className="modal-header">
                <h2>Yangi foydalanuvchi qo'shish</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="error-msg">{error}</div>}
                <div className="form-grid">
                  <div className="input-group">
                    <label>Ism</label>
                    <input type="text" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Familiya</label>
                    <input type="text" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Login (Username)</label>
                  <input type="text" required placeholder="Masalan: ali_valiyev" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Rol</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="STUDENT">O'quvchi</option>
                      <option value="TEACHER">O'qituvchi</option>
                      {currentUser?.role === 'SUPERADMIN' && <option value="SCHOOL_ADMIN">Maktab Admin</option>}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Telefon</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {formData.role === 'STUDENT' ? (
                  <div className="input-group">
                    <label>Sinf</label>
                    <select required value={formData.school_class} onChange={e => setFormData({...formData, school_class: e.target.value})}>
                      <option value="">Tanlang</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.language_display})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="input-group">
                    <label>Fan</label>
                    <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </div>
                )}

                <div className="input-group">
                  <label>Parol (Boshlang'ich)</label>
                  <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
                  <button type="submit" className="btn-primary">Saqlash</button>
                </div>
              </form>
            </div>
          </div>
        )}
      <style jsx>{`
        .action-btns { display: flex; gap: 8px; }
        .icon-btn.delete { color: #e57373; background: rgba(229, 115, 115, 0.05); border-radius: 6px; padding: 4px; }
        .icon-btn.delete:hover { background: rgba(229, 115, 115, 0.1); }
        .dashboard-layout { display: flex; min-height: 100vh; background: #0f0a07; color: #f5e6c8; }
        .main-content { flex: 1; padding: 40px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .subtitle { color: rgba(196, 168, 130, 0.5); font-family: 'Lora', serif; }
        
        .table-container { padding: 0; overflow: hidden; border-radius: 20px; }
        .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
        .custom-table th { background: rgba(218, 165, 32, 0.1); padding: 18px 25px; font-weight: 700; color: #DAA520; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .custom-table td { padding: 15px 25px; border-bottom: 1px solid rgba(218, 165, 32, 0.08); font-size: 0.95rem; }
        .custom-table tr:hover { background: rgba(218, 165, 32, 0.03); }
        
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #8B4513, #DAA520); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #fff; }
        
        .role-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .role-badge.STUDENT { background: rgba(33, 150, 243, 0.1); color: #2196f3; }
        .role-badge.TEACHER { background: rgba(76, 175, 80, 0.1); color: #4caf50; }
        
        .points-cell { font-weight: 700; color: #DAA520; }
        .icon-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.6; transition: 0.3s; }
        .icon-btn:hover { opacity: 1; transform: scale(1.2); }

        .btn-primary { background: linear-gradient(135deg, #8B4513, #DAA520); color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(139, 69, 19, 0.4); }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { width: 100%; max-width: 550px; padding: 30px; position: relative; background: #1a120b !important; border: 1px solid rgba(218, 165, 32, 0.2) !important; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .modal-header h2 { color: #DAA520; font-family: 'Playfair Display', serif; }
        .modal-header button { background: none; border: none; color: #f5e6c8; font-size: 1.5rem; cursor: pointer; }
        
        .modal-form { display: flex; flex-direction: column; gap: 15px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 0.8rem; color: rgba(196, 168, 130, 0.6); }
        .input-group input, .input-group select { background: rgba(255,255,255,0.03); border: 1px solid rgba(218, 165, 32, 0.1); color: #f5e6c8; padding: 10px 15px; border-radius: 10px; outline: none; }
        .input-group input:focus { border-color: #DAA520; }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #f5e6c8; border: 1px solid rgba(218, 165, 32, 0.2); padding: 10px 20px; border-radius: 10px; cursor: pointer; }
        .error-msg { background: rgba(229, 115, 115, 0.1); color: #e57373; padding: 10px; border-radius: 8px; font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
