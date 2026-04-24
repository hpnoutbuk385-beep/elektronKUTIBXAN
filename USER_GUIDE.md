# Foydalanish bo'yicha qo'llanma (User Guide)
> **Versiya:** v1.6.1 (Security, UI & Stability Update)

Ushbu qo'llanma "Raqamli Kutubxona" platformasidan foydalanuvchilarning turli rollari uchun mo'ljallangan. Tizim to'liq **3 ta tilda** (O'zbek, Rus, Ingliz) ishlaydi va har qanday sahifada tilni yuqoridagi menyudan almashtirish mumkin. Endilikda barcha animatsiyalar yanada barqarorlashtirilgan.

---

## 👨‍🎓 O'quvchilar uchun

### 🔐 O'quvchilarni tizimga qo'shish (Adminlar uchun)

1.  **Login yaratish**: "Loglar va Parollar" bo'limiga kiring va "➕ Yangi Login Yaratish" tugmasini bosing. Faqat Login va Parol kiriting.
2.  **Parolni tarqatish**: Ro'yxatdan o'quvchining parolini oling (yoki PDF qilib chop eting) va o'quvchiga bering.
3.  **Ma'lumotlarni to'ldirish**: "Shaxsiy Ma'lumotlar" bo'limiga o'tib, o'sha o'quvchining ism-familiyasi, telefoni va sinfini kiritib qo'ying.
  Bu sizning reytingingizni sinfingiz bilan bog'laydi.

### 2. O'quvchining tizimdagi huquqlari (RBAC)
- **Faqat o'qish (Read-only):** O'quvchilar tizimga kirganda kitoblarni qidirish, o'qish, va musobaqalarda ishtirok etish huquqiga ega xolos.
- **Cheklovlar:** O'quvchilarda hech qanday ma'lumot (kitob, yangilik, musobaqa) qo'shish, o'zgartirish yoki o'chirish huquqi yo'q. Boshqaruv (Admin) bo'limlari ulardan butunlay yashirilgan.
- **Dinamik QR-kod:** Xavfsizlikni eng yuqori darajaga ko'tarish uchun profilingizdagi QR-kod **tizimga har gal kirganingizda (login)** to'liq yangilanadi va o'zgaradi. Eski skrinshotlar bilan kitob olish umuman imkonsiz!

### 2. Kitob olish va qaytarish
- Kutubxonaga boring, kitobni tanlang va profilingizdagi **dinamik QR-kodni** kutubxonachiga ko'rsating.
- Kitob qaytarilganda profilingizga avtomatik ravishda **Bilim ballari** qo'shiladi.

---

## 👨‍🏫 O'qituvchilar uchun

### 1. Ro'yxatdan o'tish
- "O'qituvchi" rolini tanlang va o'z faningizni kiriting.
- O'qituvchilar o'quvchilarning o'qish faolligini kuzatish va ularga tavsiyalar berish imkoniyatiga ega.

---

## 📚 Kutubxonachilar uchun

### 1. Skanerlash tizimi (Yangi!)
- Menyudagi **"Skaner"** bo'limiga o'ting.
- Kamerani o'quvchi ko'rsatgan QR-kodga qarating.
- Tizim o'quvchini aniqlagandan so'ng, berilayotgan kitobni ro'yxatdan tanlang va "Kitobni topshirish" tugmasini bosing.

### 2. Tranzaksiyalar xavfsizligi
Dinamik QR tizimi tufayli eski yoki o'zganing QR-kodi bilan kitob olish imkonsiz. Tizimga qayta kirilganda QR-kod yangilanadi va skaner faqat haqiqiy, eng yangi kodlarni qabul qiladi.

### 3. Maktab Administratori (mek-admin) Huquqlari
- **Tashkilot chegarasi:** Maktab ma'muriyati (Maktab Admini) **faqatgina o'zi ishlayotgan maktabga** tegishli bo'lgan o'quvchilar, kitoblar, yangiliklar va musobaqalarni ko'radi va boshqaradi. Boshqa maktab ma'lumotlariga aralasha olmaydi.
- **To'liq boshqaruv:** O'z maktabi doirasida barcha qo'shish, tahrirlash va o'chirish (CRUD) amallarini bajara oladi.

### 4. Hisobotlar
Oylik yoki haftalik hisobotlarni PDF formatida yuklab oling va maktab ma'muriyatiga taqdim eting.

---

## 🏫 Direktorlar va Ma'murlar uchun

### 1. Monitoring
Maktabdagi umumiy o'qish faolligini, eng ko'p o'qilayotgan kitoblarni va faol o'quvchilarni real vaqt rejimida kuzatib boring.

### 2. Musobaqalar tashkil etish
Maktab miqyosida yangi musobaqalar va viktorinalar yarating. Eng yaxshi natija ko'rsatgan o'quvchilarni tizim orqali rag'batlantiring.

---

## 🛠 Texnik qo'llab-quvvatlash
Agar tizimda muammolar yuzaga kelsa, iltimos, hududiy metodistga yoki platforma administratoriga murojaat qiling.
