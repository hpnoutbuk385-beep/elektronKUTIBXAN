from django.db import migrations

def seed_books(apps, schema_editor):
    Book = apps.get_model('library', 'Book')
    Category = apps.get_model('library', 'Category')
    Organization = apps.get_model('accounts', 'Organization')
    
    # Qoraqalpog'iston viloyat tashkilotini topamiz (yoki yaratamiz)
    qoraqalpoq_reg, _ = Organization.objects.get_or_create(
        name="Qoraqalpog'iston Respublikasi",
        defaults={'org_type': 'REGION'}
    )
    
    badiiy, _ = Category.objects.get_or_create(name="Badiiy adabiyot")
    tarixiy, _ = Category.objects.get_or_create(name="Tarixiy")
    bolalar, _ = Category.objects.get_or_create(name="Bolalar adabiyoti")
    psixologiya, _ = Category.objects.get_or_create(name="Psixologiya")
    moliya, _ = Category.objects.get_or_create(name="Moliya")
    rivojlanish, _ = Category.objects.get_or_create(name="Shaxsiy rivojlanish")
    darslik, _ = Category.objects.get_or_create(name="Darsliklar")

    books_data = [
        {
            "title": "O'tkan kunlar", "author": "Abdulla Qodiriy", "category": badiiy,
            "description": "O'zbek adabiyotining durdonasi. Kumush va Otabekning fojiaviy muhabbati va Turkistonning og'ir damlari haqida.",
            "image": "https://images.uzum.uz/cl9v365ennt1543387mg/original.jpg"
        },
        {
            "title": "Mehrobdan chayon", "author": "Abdulla Qodiriy", "category": badiiy,
            "description": "Anvar va Ra'noning pokiza muhabbati, diniy ulamolar orasidagi ziddiyatlar va adolat haqida tarixiy asar.",
            "image": "https://images.uzum.uz/cl9v5klennt1543387sg/original.jpg"
        },
        {
            "title": "Kecha va kunduz", "author": "Cho'lpon", "category": badiiy,
            "description": "Milliy uyg'onish davri adabiyotining eng yirik asarlaridan biri. Mustamlaka davri hayoti va inson taqdiri.",
            "image": "https://images.uzum.uz/cl9v765ennt1543387ug/original.jpg"
        },
        {
            "title": "Yulduzli tunlar", "author": "Pirimqul Qodirov", "category": tarixiy,
            "description": "Bobur Mirzo hayoti va faoliyatiga bag'ishlangan eng mashhur tarixiy roman. Temuriylar saltanatining so'nggi yillari.",
            "image": "https://images.uzum.uz/cl9v955ennt15433880g/original.jpg"
        },
        {
            "title": "Dunyoning ishlari", "author": "O'tkir Hoshimov", "category": badiiy,
            "description": "Insoniylik, mehr-oqibat va onaga bo'lgan yuksak muhabbat haqidagi hikoyalar to'plami.",
            "image": "https://images.uzum.uz/cl9vbclennt15433882g/original.jpg"
        },
        {
            "title": "Sariq devni minib", "author": "Xudoyberdi To'xtaboyev", "category": bolalar,
            "description": "O'zbek bolalar adabiyotining shoh asari. Hoshimjonning sarguzashtlari va sehrli sholcha haqida qiziqarli qissa.",
            "image": "https://images.uzum.uz/cl9vd55ennt15433884g/original.jpg"
        },
        {
            "title": "Atom odatlar", "author": "James Clear", "category": psixologiya,
            "description": "Kichik o'zgarishlar orqali katta natijalarga erishish va yaxshi odatlarni shakllantirish bo'yicha dunyo bestselleri.",
            "image": "https://images.uzum.uz/cl9vf5lennt15433886g/original.jpg"
        },
        {
            "title": "Boy ota, kambag'al ota", "author": "Robert Kiyosaki", "category": moliya,
            "description": "Moliyaviy savodxonlikni oshirish va boy bo'lish sirlari haqidagi eng mashhur kitoblardan biri.",
            "image": "https://images.uzum.uz/cl9vh55ennt15433888g/original.jpg"
        },
        {
            "title": "Diqqat", "author": "Cal Newport", "category": rivojlanish,
            "description": "Chalg'ituvchi dunyoda diqqatni jamlash va yuqori natijali ishlarni amalga oshirish san'ati.",
            "image": "https://images.uzum.uz/cl9vj55ennt1543388ag/original.jpg"
        },
        {
            "title": "Psixologiya", "author": "Sh. Do'stmuhamedova", "category": darslik,
            "description": "Oliy va o'rta maxsus ta'lim muassasalari uchun psixologiya fanining asosiy tushunchalari bayon etilgan darslik.",
            "image": "https://images.uzum.uz/cl9vl55ennt1543388cg/original.jpg"
        }
    ]

    for b in books_data:
        Book.objects.update_or_create(
            title=b["title"],
            organization=qoraqalpoq_reg,
            defaults={
                "author": b["author"],
                "category": b["category"],
                "description": b["description"],
                "image": b["image"],
                "total_copies": 10,
                "available_copies": 10,
                "qr_code": f"BOOK-{b['title'][:5].upper()}"
            }
        )

def remove_books(apps, schema_editor):
    Book = apps.get_model('library', 'Book')
    Book.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('library', '0004_book_description'),
        ('accounts', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(seed_books, remove_books),
    ]
