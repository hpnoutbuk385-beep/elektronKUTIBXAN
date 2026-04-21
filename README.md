# Raqamli Kutubxona - Milliy Platforma

Ushbu loyiha O'zbekistondagi maktablar va oliy ta'lim muassasalari uchun mo'ljallangan, ierarxik boshqaruv va gamifikatsiya elementlariga ega bo'lgan raqamli kutubxona boshqaruv tizimidir.

## 🚀 Texnologiyalar
- **Backend:** Django + Django REST Framework
- **Frontend:** Next.js (App Router) + Vanilla CSS (Premium Design)
- **Ma'lumotlar bazasi:** PostgreSQL (Ishlab chiqish rejimi uchun SQLite)
- **Konteynerizatsiya:** Docker & Docker Compose

## 📂 Loyiha tuzilmasi
- `/backend`: Django API va ma'lumotlar bazasi logikasi.
- `/frontend`: Next.js foydalanuvchi interfeysi.
- `docker-compose.yml`: Loyihani bitta buyruq bilan ishga tushirish uchun sozlamalar.
- `start.py`: Mahalliy ishga tushirish uchun yagona skript.

## ⚙️ O'rnatish va Ishga tushirish

### Mahalliy ishga tushirish (Tavsiya etiladi):
Endi ikkita terminal ochish shart emas. Loyihaning ildiz (root) papkasida turib quyidagi buyruqni bering:
```bash
python start.py
```
Ushbu skript avtomatik ravishda:
- Band bo'lgan portlarni tozalaydi (Windowsda 3000 va 8000 portlar band bo'lishi muammosini hal qiladi).
- Backend (Django) va Frontend (Next.js) serverlarini parallel ishga tushiradi.

### Docker orqali:
```bash
docker-compose up --build
```
Sayt [http://localhost:3000](http://localhost:3000) manzilida ishlaydi.

## 🌍 Serverda (Railway) Ishga tushirish
Loyiha Railway-da **ikki xizmatli (Two-service)** arxitektura asosida sozlangan:
1. **Backend Service**: `backend/Dockerfile` orqali ishlaydi.
2. **Frontend Service**: `frontend/Dockerfile` orqali ishlaydi.

**Muhim!** Frontend ishlashi uchun Railway-dagi `Variables` bo'limida `NEXT_PUBLIC_API_URL` o'zgaruvchisini Backend-ning manzili (masalan: `https://.../api`) qilib sozlash va **Redeploy** qilish shart.

## 🔑 Ma'muriyat (Admin)
- **Admin panel:** [http://localhost:8000/admin](http://localhost:8000/admin)
- **Login:** `Admin`
- **Parol:** `xx63blk`

## 📈 Amalga oshirilgan Stage-lar

### 1-9 Bosqichlar:
- SRS, MVP, Gamifikatsiya, Analitika, Integratsiya, i18n, QR Skaner va UI barqarorligi (v1.6.1).

### 10-bosqich: Cloud Deployment & Environment Unification v1.7.0
- **Unified Startup:** Mahalliy ishlab chiqishni osonlashtirish uchun `start.py` skripti yaratildi.
- **Railway Optimization:** Monorepo tuzilmasi uchun Dockerfayllar optimallashtirildi va Railway serverida alohida Backend/Frontend xizmatlari sifatida muvaffaqiyatli ishga tushirildi.
- **Connectivity Fix:** `NEXT_PUBLIC_API_URL` va CORS sozlamalari ishlab chiqish va ishlab chiqarish (production) muhitlari uchun sinxronlashtirildi.

---
**Versiya:** v1.7.0 | **Cloud Deployment & Environment Unification**
© 2026 Raqamli Kutubxona. Barcha huquqlar himoyalangan.
