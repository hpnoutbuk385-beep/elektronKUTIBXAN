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
- **Admin panel:** [https://elektronkutibxan-production.up.railway.app/admin](https://elektronkutibxan-production.up.railway.app/admin)
- **Ma'lumot:** Admin login va paroli xavfsizlik yuzasidan GitHub'dan olib tashlandi. Uni loyiha egasidan so'rang.

## 📈 Amalga oshirilgan Stage-lar

### 1-9 Bosqichlar:
- SRS, MVP, Gamifikatsiya, Analitika, Integratsiya, i18n, QR Skaner va UI barqarorligi (v1.6.1).

### 10-bosqich: Cloud Deployment & Environment Unification v1.7.0
- **Unified Startup:** Mahalliy ishlab chiqishni osonlashtirish uchun `start.py` skripti yaratildi.
- **Railway Optimization:** Monorepo tuzilmasi uchun Dockerfayllar optimallashtirildi va Railway serverida alohida Backend/Frontend xizmatlari sifatida muvaffaqiyatli ishga tushirildi.

### 11-bosqich: Production Connectivity & Optimization v1.8.1
- **Hardcoded Production API:** Railway'da environment o'zgaruvchilari muammosini hal qilish uchun Backend manzilini kodga biriktirildi.
- **Mobile Responsive UI:** Telefon va planshetlar uchun interfeys to'liq moslashtirildi (Sidebar toggle va Layout fix).
- **Admin Access:** CSRF xavfsizlik sozlamalari yakunlandi va xavfsiz muhit parametrlari (env) o'rnatildi.

### 12-bosqich: Data Seeding & API Filtering v1.9.0
- **Tashkilotlar Filtri:** Ro'yxatdan o'tish (Register) sahifasida faqat maktablarni (SCHOOL) ko'rsatish uchun API Endpoint (`?org_type=SCHOOL`) va Backend ko'rinishlari (ViewSet) takomillashtirildi.
- **Aniq Maktablar Ro'yxati:** Qoraqalpog'istonning Xo'jayli va Nukus shahri uchun mijoz talabi bo'yicha maxsus 104 ta maktab qo'shildi.
- **Custom Seeding Script:** Railway serverida ushbu maktablarni jonli bazaga qo'shish uchun `backend/seed_custom_schools.py` skripti yaratildi.

### 13-bosqich: Elektron Kutubxona & Raqamli Ijara v2.0.0 (So'nggi)
- **Ochiq Kutubxona Sahifasi (`/library`):** Barcha tashrif buyuruvchilar (ro'yxatdan o'tmagan ham) kitoblar ro'yxatini ko'ra oladi. Zamonaviy dizayn, qidiruv, kategoriya bo'yicha filtrlash imkoniyatlari mavjud.
- **Raqamli Ijara Tizimi:** Foydalanuvchilar kitobni "Ijaraga olish" tugmasi orqali olishlari mumkin. Ro'yxatdan o'tmagan foydalanuvchilar avtomatik ravishda ro'yxatdan o'tish sahifasiga yo'naltiriladi.
- **Elektron Kitob (E-book):** `Book` modeliga `file` maydoni qo'shildi — adminlar PDF yoki boshqa format fayllarni yuklashi mumkin. Foydalanuvchilar kitobni brauzerda onlayn o'qiy oladi.
- **Mening Kitoblarim (`/books`):** Foydalanuvchi ijaraga olgan kitoblar shaxsiy sahifada ko'rinadi. "O'qish" (PDF ochish) va "Qaytarish" (kitobni bazaga qaytarish) tugmalari mavjud.
- **Digital Loan/Return API:** Yangi `digital-loan` va `digital-return` endpointlari qo'shildi.
- **Admin Panel Yangilanishi:** Kitob qo'shishda E-kitob mavjudligi ko'rinishi va QR kod orqali qidirish imkoniyati qo'shildi.

---
**Versiya:** v2.0.0 | **Elektron Kutubxona & Raqamli Ijara**
© 2026 Raqamli Kutubxona. Barcha huquqlar himoyalangan.
