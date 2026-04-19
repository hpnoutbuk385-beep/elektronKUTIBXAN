
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

## ⚙️ O'rnatish va Ishga tushirish

### Docker orqali (Tavsiya etiladi):
```bash
docker-compose up --build
```
Sayt [http://localhost:3000](http://localhost:3000) manzilida, API esa [http://localhost:8000](http://localhost:8000) manzilida ishlaydi.

### Qo'lda ishga tushirish:
1. **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔑 Ma'muriyat (Admin)
- **Admin panel:** [http://localhost:8000/admin](http://localhost:8000/admin)
- *(Tizim xavfsizligini ta'minlash maqsadida standart parol ko'rsatilmagan. Iltimos, o'z adminingizni django orqali yarating).*

## 📘 Funksiyalar
- **QR Skaner**: Kitob berish va qaytarish uchun tezkor QR tizimi.
- **Gamifikatsiya**: Testlar orqali bilim ballarini to'plash va mukofotlar do'koni.
- **Analitika**: Maktab faoliyati bo'yicha avtomatlashtirilgan PDF hisobotlar.
- **Ierarxiya**: Vazirlik, Viloyat, Tuman va Maktab darajasidagi nazorat panellari.
- **Xavfsizlik**: `TenantSecurityMiddleware` orqali maktablararo ma'lumotlar isolate qilingan.
- **Integratsiya**: HEMIS va eMaktab uchun Mock SSO autentifikatsiya tizimi.

## 📈 Amalga oshirilgan ishlar (Bosqichma-bosqich)

### 1-bosqich: Rejalashtirish
- SRS va loyiha arxitekturasi ishlab chiqildi.
- Texnologik stack (Django + Next.js) tasdiqlandi.

### 2-bosqich: MVP (Minimal Ishchi Mahsulot)
- Ierarxik tashkilotlar va foydalanuvchilar bazasi yaratildi.
- Kitoblar va tranzaksiyalar uchun QR tizimi joriy etildi.
- Premium "Glassmorphism" dizayn tizimi frontendga integratsiya qilindi.

### 3-bosqich: Kengaytirish
- Testlar/Viktorinalar va bilim ballari tizimi qo'shildi.
- Mukofotlar do'koni (Marketplace) interfeysi va logikasi yaratildi.
- Avtomatlashtirilgan PDF hisobotlar tizimi ishga tushirildi.

### 4-bosqich: Integratsiya va Testlar
- HEMIS/eMaktab uchun Mock SSO autentifikatsiya moduli yaratildi.
- Ma'lumotlar xavfsizligi uchun maxsus middleware yozildi.
- Yuklama testi (Locust) skriptlari tayyorlandi.

### 5-bosqich: Ishga tushirish qismi
- Loyiha to'liq Docker-konteynerlariga yig'ildi.
- Foydalanish bo'yicha batafsil qo'llanmalar (README, User Guide) yaratildi.

### 6-bosqich: Kengaytirish v1.2.0 (Yangi Yangilanish)
- **Ko'p tilli tizim (i18n):** Sayt to'liq uch tilga o'girildi (O'zbek, Rus, Ingliz). Foydalanuvchilar Navbar orqali tillarni tanlashlari mumkin va u brauzer keshida (`localStorage`) mudofaa etiladi.
- **Yangi Admin Panel:** Django'ning standart zerikarli paneli o'rniga zamonaviy `django-jazzmin` tizimi o'rnatildi.
- **Ro'yxatdan O'tish Mantiqiy Yangilanishi:** Foydalanuvchi tizimga kirmagan bo'lsa darhol `Register` sahifasiga o'tadi va barcha tillarni integratsiya qildi.

## 🚀 Kelgusida Rivojlantirish (Roadmap)
Loyihani kelajakda yanada mukammallashtirish uchun quyidagi imkoniyatlarni bosqichma-bosqich qo‘shish rejalashtirilgan:

- **v1.3.0 - Jonli qidiruv tizimi (Live Search):** Foydalanuvchi qidiruvda (Navbar'da) yozishni boshlaganda kitoblarni real vaqt rejimida chiqarib beruvchi backend ulanishi va API qo'shilishi.
- **v1.4.0 - QR shtrix-kod Generatsiyasi:** Adminlar uchun minglab kitoblarga printerda chiqarishga moslashtirilgan PDF formatidagi stiker-kodlarni bir paytning o'zida generatsiya qilish moduli.
- **v1.5.0 - Shaxsiy Avatarlar:** Foydalanuvchilarga o'z profil rasmlarini (avatar) yuklash va tahrirlash imkoniyatini taqdim etuvchi tizim.

- **v1.7.0 - Mavzular (Themes):** Hozirgi "Tungi (Dark)" glassmorphism dizaynidan tashqari, maxsus tugma orqali yorqin va "Kunduzgi (Light)" rejimiga o'tish mexanizmi.

---
**Versiya:** v1.2.0 | **Xavfsizlik & Tillar yangilanishi**
© 2026 Raqamli Kutubxona. Barcha huquqlar himoyalangan.
