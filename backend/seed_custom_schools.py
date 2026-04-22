import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization, CustomUser
from library.models import Book, Category

def seed_custom_schools():
    print("Mavhum maktablarni tozalash boshlandi...")
    
    # Qoraqalpog'iston maktablarini topamiz
    qoraqalpoq_schools = Organization.objects.filter(org_type='SCHOOL', region_name="Qoraqalpog'iston Resp.")
    
    deleted_count = 0
    # Faqat nomi "maktab" bilan tugaydigan yoki boshlanadigan, lekin "—" belgi qatnashmaganlarini o'chiramiz
    for school in qoraqalpoq_schools:
        if "—" not in school.name:
            school.delete()
            deleted_count += 1
            
    print(f"Barcha tuman noma'lum bo'lgan {deleted_count} ta maktab o'chirildi.")
    
    print("Xo'jayli va Nukus maktablarini qo'shish boshlandi...")
    
    # Qoraqalpog'iston viloyatini topamiz yoki yaratamiz
    ministry = Organization.objects.filter(org_type='MINISTRY').first()
    qoraqalpoq_reg, _ = Organization.objects.get_or_create(
        name="Qoraqalpog'iston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='REGION',
        parent=ministry,
        region_name="Qoraqalpog'iston Resp."
    )
    
    # Xo'jayli tumanini topamiz yoki yaratamiz
    xojayli_dist, _ = Organization.objects.get_or_create(
        name="Xo'jayli tumani bo'limi",
        org_type='DISTRICT',
        parent=qoraqalpoq_reg,
        region_name="Qoraqalpog'iston Resp.",
        district_name="Xo'jayli tumani"
    )
    
    # Nukus shahrini topamiz yoki yaratamiz
    nukus_dist, _ = Organization.objects.get_or_create(
        name="Nukus shahri bo'limi",
        org_type='DISTRICT',
        parent=qoraqalpoq_reg,
        region_name="Qoraqalpog'iston Resp.",
        district_name="Nukus shahri"
    )
    
    created_count = 0
    
    # Xo'jayli maktablari (1 dan 44 gacha)
    for i in range(1, 45):
        maktab_name = f"{i}-maktab — Xo'jayli"
        org, created = Organization.objects.get_or_create(
            name=maktab_name,
            org_type='SCHOOL',
            parent=xojayli_dist,
            region_name="Qoraqalpog'iston Resp.",
            district_name="Xo'jayli tumani"
        )
        if created:
            created_count += 1
            
    print("[OK] Xo'jayli uchun 44 ta maktab qo'shildi.")
    
    # Nukus maktablari (1 dan 60 gacha)
    for i in range(1, 61):
        maktab_name = f"{i}-maktab — Nukus"
        org, created = Organization.objects.get_or_create(
            name=maktab_name,
            org_type='SCHOOL',
            parent=nukus_dist,
            region_name="Qoraqalpog'iston Resp.",
            district_name="Nukus shahri"
        )
        if created:
            created_count += 1
            
    print("[OK] Nukus shahri uchun 60 ta maktab qo'shildi.")
    
    # Superuser (Admin) yaratish
    admin_username = os.environ.get("ADMIN_USERNAME", "adminrdx123")
    admin_password = os.environ.get("ADMIN_PASSWORD", "xx63blk")
    
    admin_user, created = CustomUser.objects.get_or_create(
        username=admin_username,
        defaults={
            'email': os.environ.get("ADMIN_EMAIL", "admin@example.com"),
            'first_name': "Asosiy",
            'last_name': "Admin",
            'role': 'SUPERADMIN',
            'is_staff': True,
            'is_superuser': True
        }
    )

    if created:
        admin_user.set_password(admin_password)
        admin_user.save()
        print(f"[OK] Admin yaratildi: {admin_user.username}")
    else:
        admin_user.set_password(admin_password)
        admin_user.save()
    print(f"[OK] Admin paroli yangilandi: {admin_user.username}")
        
    # 10 ta kitob qo'shish — viloyat tashkilotiga (hammaga ko'rinsin)
    if qoraqalpoq_reg:
        print("Kitoblarni qo'shish boshlandi...")
        badiiy, _ = Category.objects.get_or_create(name="Badiiy adabiyot")
        darslik, _ = Category.objects.get_or_create(name="Darsliklar")
        
        books_data = [
            {"title": "O'tkan kunlar", "author": "Abdulla Qodiriy", "isbn": "978-9943-00-123-4", "category": badiiy, "quantity": 5},
            {"title": "Mehrobdan chayon", "author": "Abdulla Qodiriy", "isbn": "978-9943-00-124-1", "category": badiiy, "quantity": 3},
            {"title": "Shum bola", "author": "G'afur G'ulom", "isbn": "978-9943-00-125-8", "category": badiiy, "quantity": 7},
            {"title": "Sariq devni minib", "author": "Xudoyberdi To'xtaboyev", "isbn": "978-9943-00-126-5", "category": badiiy, "quantity": 4},
            {"title": "Yulduzli tunlar", "author": "Pirimqul Qodirov", "isbn": "978-9943-00-127-2", "category": badiiy, "quantity": 6},
            {"title": "Matematika 5-sinf", "author": "M. Mirzaahmedov", "isbn": "978-9943-00-201-9", "category": darslik, "quantity": 20},
            {"title": "Ona tili 5-sinf", "author": "N. Mahmudov", "isbn": "978-9943-00-202-6", "category": darslik, "quantity": 25},
            {"title": "Tarix 5-sinf", "author": "A. Muhammadjonov", "isbn": "978-9943-00-203-3", "category": darslik, "quantity": 15},
            {"title": "Fizika 7-sinf", "author": "P. Habibullayev", "isbn": "978-9943-00-204-0", "category": darslik, "quantity": 10},
            {"title": "Informatika 7-sinf", "author": "T. Tayloqov", "isbn": "978-9943-00-205-7", "category": darslik, "quantity": 12},
        ]
        
        books_created = 0
        for b in books_data:
            book, created = Book.objects.get_or_create(
                title=b["title"],
                organization=qoraqalpoq_reg,
                defaults={
                    "author": b["author"],
                    "isbn": b["isbn"],
                    "category": b["category"],
                    "total_copies": b["quantity"],
                    "available_copies": b["quantity"],
                }
            )
            if created:
                books_created += 1
                
        print(f"[OK] {books_created} ta kitob kutubxonaga qo'shildi.")
    
    print(f"\nBarcha ishlar bajarildi! Jami yangi qo'shilgan maktablar: {created_count}")

if __name__ == "__main__":
    seed_custom_schools()
