# 📚 Raqamli Kutubxona Platformasi (Digital Library)

O'zbekiston ta'lim muassasalari uchun mo'ljallangan zamonaviy va premium elektron kutubxona platformasi.

## 🚀 So'nggi Yangilanishlar (v2.1 - 24.04.2026)

### 🏫 Maktablar va Sinflar To'liq Qo'shildi
- **139 ta maktab** bazaga kiritildi:
  - Nukus shahri — 60 ta maktab
  - Xo'jayli tumani — 44 ta maktab
  - Nukus tumani — 35 ta maktab
- **4587 ta sinf** har bir maktabga qo'shildi:
  - 1-A sinf — O'zbek tili
  - 1-B sinf — Rus tili
  - 1-V sinf — Qoraqalpoq tili
  - ... (jami 11-sinfgacha barcha tillarda)

### 🔧 API va Ro'yxatdan O'tish Tuzatishlari
- Ro'yxatdan o'tish sahifasida faqat **SCHOOL** turdagi tashkilotlar ko'rsatiladi.
- Maktab tanlagandan keyin **sinflar avtomatik yuklanadi**.
- API `organizations/` va `classes/` endpointlari **autentifikatsiyasiz** ochiq.
- `seed-all` endpointi orqali production bazani istalgan vaqt to'ldirish mumkin.

### 🌐 Production va Persistence (Railway)
- **Ma'lumotlar saqlanishi (Persistence)**: Dockerfile `CMD` buyrug'iga seed skripti qo'shildi, natijada Railway serveri har safar qayta yonganda maktab/sinf ma'lumotlari avtomatik tiklanadi.
- **Dinamik API**: Frontend endi o'zi turgan domenga qarab localhost yoki Railway backend'ga avtomatik ulanadi.

---

## 🚀 Oxirgi yangilanishlar (v2.0)
- **Yopiq tizim**: Ro'yxatdan o'tish butunlay to'xtatildi. Endi faqat adminlar o'quvchi qo'sha oladi.
- **Loglar va Parollar**: Adminlar uchun barcha login va parollarni ko'rish va chop etish bo'limi qo'shildi.
- **Shaxsiy Ma'lumotlar**: O'quvchilarning ism-familiyasi va boshqa ma'lumotlarini alohida "papka"da boshqarish imkoniyati.
- **Smart Login**: Ism-familiya yoki username orqali tezkor kirish tizimi.
 (Qoraqalpoq, O'zbek, Rus) bo'yicha guruhlash imkoniyati.
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

