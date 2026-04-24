import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization
from library.models import Category, Book

def seed_qoraqalpoq_data():
    print("Qoraqalpog'iston Respublikasi ma'lumotlarini bazaga qo'shish boshlandi...")
    
    # 1. Vazirlik (Parent for the region)
    ministry = Organization.objects.get_or_create(
        name="O'zbekiston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='MINISTRY'
    )[0]

    # 2. Qoraqalpog'iston Respublikasi
    qoraqalpoq_reg = Organization.objects.get_or_create(
        name="Qoraqalpog'iston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='REGION',
        parent=ministry,
        region_name="Qoraqalpog'iston Resp."
    )[0]

    # 3. Tumanlar (Districts & Cities)
    tumanlar = [
        "Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Bo'zatov tumani",
        "Chimboy tumani", "Ellikqal'a tumani", "Kegeyli tumani", "Mo'ynoq tumani",
        "Nukus tumani", "Qanliko'l tumani", "Qorao'zak tumani", "Shumanay tumani",
        "Taxiatosh tumani", "Taxtako'pir tumani", "To'rtko'l tumani", "Xo'jayli tumani"
    ]

    # 4. Tumanlar va ularning maktablarini yaratish
    nukus_1_maktab = None
    
    for tuman in tumanlar:
        dist_obj = Organization.objects.get_or_create(
            name=f"{tuman} bo'limi",
            org_type='DISTRICT',
            parent=qoraqalpoq_reg,
            region_name="Qoraqalpog'iston Resp.",
            district_name=tuman
        )[0]
        
        # Har bir tuman uchun 50 ta maktab yaratamiz
        for i in range(1, 51):
            maktab_name = f"{i}-maktab"
            school = Organization.objects.get_or_create(
                name=maktab_name,
                org_type='SCHOOL',
                parent=dist_obj,
                region_name="Qoraqalpog'iston Resp.",
                district_name=tuman
            )[0]
            
            # Nukus shahri 1-maktabni kitoblar qo'shish uchun saqlab qolamiz
            if tuman == "Nukus shahri" and i == 1:
                nukus_1_maktab = school
                
        print(f"[OK] {tuman} uchun maktablar yaratildi.")

    print("\nMaktablar muvaffaqiyatli yaratildi. Endi kitoblar qo'shiladi...")

    # 5. Kitoblarni qo'shish (Nukus shahri 1-maktab uchun)
    if nukus_1_maktab:
        badiiy = Category.objects.filter(name="Badiiy adabiyot").first() or Category.objects.create(name="Badiiy adabiyot")
        tarixiy = Category.objects.filter(name="Tarixiy").first() or Category.objects.create(name="Tarixiy")
        darslik = Category.objects.filter(name="Darsliklar").first() or Category.objects.create(name="Darsliklar")
        
        books_data = [
            {"title": "O'tkan kunlar", "author": "Abdulla Qodiriy", "category": badiiy},
            {"title": "Mehrobdan chayon", "author": "Abdulla Qodiriy", "category": badiiy},
            {"title": "Sariq devni minib", "author": "Xudoyberdi To'xtaboyev", "category": badiiy},
            {"title": "Ufq (trilogiya)", "author": "Said Ahmad", "category": badiiy},
            {"title": "Temur tuzuklari", "author": "Amir Temur", "category": tarixiy},
            {"title": "Qutadg'u bilig", "author": "Yusuf Xos Hojib", "category": tarixiy},
            {"title": "Informatika va AT 10-sinf", "author": "Ta'lim Vazirligi", "category": darslik},
            {"title": "Algebra 11-sinf", "author": "Ta'lim Vazirligi", "category": darslik},
            {"title": "O'zbek tili 10-sinf", "author": "Ta'lim Vazirligi", "category": darslik},
            {"title": "Yulduzli tunlar", "author": "Pirimqul Qodirov", "category": tarixiy},
        ]
        
        added_books = 0
        for b_data in books_data:
            # Check if book exists to avoid duplicates
            book, created = Book.objects.get_or_create(
                title=b_data["title"],
                organization=nukus_1_maktab,
                defaults={
                    "author": b_data["author"],
                    "category": b_data["category"],
                    "total_copies": random.randint(5, 20),
                    "available_copies": random.randint(2, 5),
                    "page_count": random.randint(150, 400),
                }
            )
            if created:
                added_books += 1
                
        print(f"[OK] {nukus_1_maktab.name} ({nukus_1_maktab.district_name}) kutubxonasiga {added_books} ta kitob qo'shildi.")

    print("\nBarcha ma'lumotlar muvaffaqiyatli kiritildi!")

if __name__ == "__main__":
    seed_qoraqalpoq_data()
