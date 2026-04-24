# 📚 Raqamli Kutubxona Platformasi (Digital Library)

O'zbekiston ta'lim muassasalari uchun mo'ljallangan zamonaviy va premium elektron kutubxona platformasi.

## 🚀 So'nggi Yangilanishlar (v2.1 - 24.04.2026)

### 🏫 Maktablar va Sinflar To'liq Qo'shildi
- **104 ta maktab** bazaga kiritildi:
  - Nukus shahri — 60 ta maktab (1-maktab — Nukus ... 60-maktab — Nukus)
  - Xo'jayli tumani — 44 ta maktab (1-maktab — Xo'jayli ... 44-maktab — Xo'jayli)
- **3432 ta sinf** har bir maktabga qo'shildi:
  - 1-A sinf — O'zbek tili
  - 1-B sinf — Rus tili
  - 1-V sinf — Qaraqalpoq tili
  - ... (2-A, 2-B, 2-V dan 11-A, 11-B, 11-V gacha)

### 🔧 API va Ro'yxatdan O'tish Tuzatishlari
- Ro'yxatdan o'tish sahifasida faqat **SCHOOL** turdagi tashkilotlar ko'rsatiladi
- Maktab tanlagandan keyin **sinflar avtomatik yuklanadi**
- API `organizations/` va `classes/` endpointlari **autentifikatsiyasiz** ochiq (ro'yxatdan o'tish uchun)
- `seed-all` endpointi orqali jonli serverga maktab va sinflarni yuklash imkoniyati

### 🌐 Production API Tuzatishlari
- Frontend API manzili Railway serverida to'g'ri ishlaydi
- Eski tokenlar bilan 401 xatosi avtomatik hal qilinadi
- `getBaseUrl()` dinamik ravishda localhost yoki production manzilni aniqlaydi

---

## 📋 Oldingi Yangilanishlar (v2.0 - Cinematic Release)

*   **🏫 Maktab Sinflari Tizimi**: O'quv maskanlari uchun sinflar va ta'lim tillari (Qoraqalpoq, O'zbek, Rus) bo'yicha guruhlash imkoniyati.
*   **👤 Rolga asoslangan Ro'yxatdan o'tish**: O'quvchilar (sinfni tanlash) va O'qituvchilar (fanini kiritish) uchun alohida ro'yxatdan o'tish jarayoni.
*   **📷 Kutubxonachi Skaneri**: Adminlar uchun o'quvchi QR-kodini skanerlash orqali kitoblarni tezkor topshirish va qabul qilish tizimi.
*   **🛡️ Dinamik QR-kodlar**: Xavfsizlikni ta'minlash maqsadida har daqiqada yangilanib turuvchi dinamik QR-kodlar tizimi (skrinshotlardan himoya).
*   **📱 Mobil Optimizatsiya va Qulaylik**: "Back" tugmalari, ixcham Dashbord va barcha qurilmalar uchun mukammal moslashuvchanlik.

## 🛠 Texnologiyalar

*   **Frontend**: Next.js 16, React 19, CSS (Cinematic Glassmorphism)
*   **Backend**: Django 6.0, Django REST Framework
*   **Ma'lumotlar bazasi**: SQLite (dev) / PostgreSQL (production)
*   **Deployment**: Railway / Docker

## 📥 O'rnatish va Ishga tushirish

1.  Repozitoriyani klon qiling: `git clone https://github.com/hpnoutbuk385-beep/elektronKUTIBXAN.git`
2.  Backendni ishga tushiring: `cd backend && python manage.py migrate && python manage.py runserver`
3.  Ma'lumotlarni yuklang: `python seed_classes_and_schools.py`
4.  Frontendni ishga tushiring: `cd frontend && npm install && npm run dev`
5.  Brauzerda `localhost:3000` ni oching.

## 🔗 Production Havolalar

- **Frontend**: https://elektronkutibxan-production-7949.up.railway.app
- **Backend API**: https://elektronkutibxan-production.up.railway.app/api/

## 📄 Litsenziya
Ushbu loyiha o'quv va ma'rifiy maqsadlar uchun yaratilgan.

