"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function BookManagementPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "", author: "", total_copies: 1, description: ""
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      if (!['SUPERADMIN', 'SCHOOL_ADMIN'].includes(user.role)) {
        router.push("/");
      }
    } else {
      router.push("/login");
    }
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await fetchApi('/books/');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.results || data);
      }
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/books/', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          available_copies: formData.total_copies
        })
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: "", author: "", total_copies: 1, description: "" });
        loadBooks();
      } else {
        const data = await res.json();
        alert(JSON.stringify(data));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm("Haqiqatan ham bu kitobni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetchApi(`/books/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        loadBooks();
      } else {
        alert("O'chirishda xatolik");
      }
    } catch (err) {
      alert("Server xatosi");
    }
  };

  return (
    <div className="dashboard-content animate-fade">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Kitoblar Boshqaruvi</h1>
          <p className="subtitle">Maktab kutubxonasidagi kitoblarni boshqarish</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>➕</span> Yangi Kitob qo'shish
        </button>
      </header>

      <div className="glass-panel table-container">
        {loading ? (
          <div className="loader">Yuklanmoqda...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Muqova</th>
                <th>Nomi</th>
                <th>Muallif</th>
                <th>Soni</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>
                    <img src={book.image || "/book-placeholder.png"} alt="cover" className="table-thumb" />
                  </td>
                  <td className="font-bold">{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.available_copies} / {book.total_copies}</td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDeleteBook(book.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-slide-up">
            <h3>Yangi Kitob Qo'shish</h3>
            <form onSubmit={handleAddBook} className="admin-form">
              <div className="input-group">
                <label>Kitob nomi</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Muallif</label>
                <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Umumiy soni</label>
                <input type="number" required value={formData.total_copies} onChange={e => setFormData({...formData, total_copies: parseInt(e.target.value)})} />
              </div>
              <div className="input-group">
                <label>Tavsif</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-text" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .subtitle { color: rgba(196, 168, 130, 0.6); }
        .table-container { padding: 20px; overflow-x: auto; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table th { text-align: left; padding: 15px; color: rgba(255,255,255,0.4); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .users-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .table-thumb { width: 40px; height: 60px; object-fit: cover; border-radius: 4px; }
        .btn-primary { 
          background: linear-gradient(135deg, #8B4513, #DAA520); color: white; border: none; 
          padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer;
        }
        .btn-icon.delete { background: rgba(229, 115, 115, 0.1); color: #e57373; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-card { width: 100%; max-width: 500px; padding: 30px; }
        .admin-form { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        input, textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 8px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
        .btn-text { background: none; border: none; color: white; cursor: pointer; }
      `}</style>
    </div>
  );
}
