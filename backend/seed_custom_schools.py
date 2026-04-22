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
        
        books_data = [
            {
                "title": "O'tkan kunlar", "author": "Abdulla Qodiriy", 
                "category": "Badiiy adabiyot", 
                "description": "O'zbek adabiyotining durdonasi. Kumush va Otabekning fojiaviy muhabbati va Turkistonning og'ir damlari haqida.",
                "image": "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg",
                "quantity": 5
            },
            {
                "title": "Mehrobdan chayon", "author": "Abdulla Qodiriy", 
                "category": "Badiiy adabiyot", 
                "description": "Anvar va Ra'noning pokiza muhabbati, diniy ulamolar orasidagi ziddiyatlar va adolat haqida tarixiy asar.",
                "image": "https://images.uzum.uz/cl9v5klennt1543387sg/original.jpg",
                "quantity": 3
            },
            {
                "title": "Kecha va kunduz", "author": "Cho'lpon", 
                "category": "Badiiy adabiyot", 
                "description": "Milliy uyg'onish davri adabiyotining eng yirik asarlaridan biri. Mustamlaka davri hayoti va inson taqdiri.",
                "image": "https://images.uzum.uz/cl9v765ennt1543387ug/original.jpg",
                "quantity": 4
            },
            {
                "title": "Yulduzli tunlar", "author": "Pirimqul Qodirov", 
                "category": "Tarixiy", 
                "description": "Bobur Mirzo hayoti va faoliyatiga bag'ishlangan eng mashhur tarixiy roman. Temuriylar saltanatining so'nggi yillari.",
                "image": "https://images.uzum.uz/cl9v955ennt15433880g/original.jpg",
                "quantity": 6
            },
            {
                "title": "Dunyoning ishlari", "author": "O'tkir Hoshimov", 
                "category": "Badiiy adabiyot", 
                "description": "Insoniylik, mehr-oqibat va onaga bo'lgan yuksak muhabbat haqidagi hikoyalar to'plami.",
                "image": "https://images.uzum.uz/cl9vbclennt15433882g/original.jpg",
                "quantity": 7
            },
            {
                "title": "Sariq devni minib", "author": "Xudoyberdi To'xtaboyev", 
                "category": "Bolalar adabiyoti", 
                "description": "O'zbek bolalar adabiyotining shoh asari. Hoshimjonning sarguzashtlari va sehrli sholcha haqida qiziqarli qissa.",
                "image": "https://images.uzum.uz/cl9vd55ennt15433884g/original.jpg",
                "quantity": 4
            },
            {
                "title": "Atom odatlar", "author": "James Clear", 
                "category": "Psixologiya", 
                "description": "Kichik o'zgarishlar orqali katta natijalarga erishish va yaxshi odatlarni shakllantirish bo'yicha dunyo bestselleri.",
                "image": "https://images.uzum.uz/cl9vf5lennt15433886g/original.jpg",
                "quantity": 5
            },
            {
                "title": "Boy ota, kambag'al ota", "author": "Robert Kiyosaki", 
                "category": "Moliya", 
                "description": "Moliyaviy savodxonlikni oshirish va boy bo'lish sirlari haqidagi eng mashhur kitoblardan biri.",
                "image": "https://images.uzum.uz/cl9vh55ennt15433888g/original.jpg",
                "quantity": 3
            },
            {
                "title": "Diqqat", "author": "Cal Newport", 
                "category": "Shaxsiy rivojlanish", 
                "description": "Chalg'ituvchi dunyoda diqqatni jamlash va yuqori natijali ishlarni amalga oshirish san'ati.",
                "image": "https://images.uzum.uz/cl9vj55ennt1543388ag/original.jpg",
                "quantity": 5
            },
            {
                "title": "Psixologiya", "author": "Sh. Do'stmuhamedova", 
                "category": "Darsliklar", 
                "description": "Oliy va o'rta maxsus ta'lim muassasalari uchun psixologiya fanining asosiy tushunchalari bayon etilgan darslik.",
                "image": "https://images.uzum.uz/cl9vl55ennt1543388cg/original.jpg",
                "quantity": 10
            }
        ]
        
        books_created = 0
        for b in books_data:
            cat, _ = Category.objects.get_or_create(name=b["category"])
            book, created = Book.objects.update_or_create(
                title=b["title"],
                organization=qoraqalpoq_reg,
                defaults={
                    "author": b["author"],
                    "category": cat,
                    "description": b["description"],
                    "image": b["image"],
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
