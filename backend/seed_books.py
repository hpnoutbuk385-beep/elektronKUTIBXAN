"""
10 ta namuna kitob qo'shadigan skript.
Ishga tushirish: python manage.py shell < seed_books.py
yoki: python seed_books.py
"""
import os
import sys
import django

# Django sozlamalari
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from accounts.models import Organization
from library.models import Book, Category

print("=== 10 ta kitob qo'shilmoqda ===")

# Birinchi tashkilotni olish
org = Organization.objects.first()
if not org:
    print("XATO: Tashkilot topilmadi! Avval tashkilotlarni qo'shing.")
    sys.exit(1)

print(f"Tashkilot: {org.name}")

# Kategoriyalarni yaratish
cats = {}
for name in ["Adabiyot", "Fan", "Tarix", "Matematika", "Ingliz tili"]:
    cat, _ = Category.objects.get_or_create(name=name)
    cats[name] = cat

print("Kategoriyalar tayyor.")

# 10 ta kitob
BOOKS = [
    {
        "title": "O'tkan kunlar",
        "author": "Abdulla Qodiriy",
        "isbn": "978-9943-01-001-1",
        "category": cats["Adabiyot"],
        "total_copies": 5,
        "available_copies": 5,
        "page_count": 432,
    },
    {
        "title": "Mehrobdan chayon",
        "author": "Abdulla Qodiriy",
        "isbn": "978-9943-01-002-2",
        "category": cats["Adabiyot"],
        "total_copies": 4,
        "available_copies": 4,
        "page_count": 368,
    },
    {
        "title": "Sarob",
        "author": "Abdulla Qahhor",
        "isbn": "978-9943-01-003-3",
        "category": cats["Adabiyot"],
        "total_copies": 3,
        "available_copies": 3,
        "page_count": 290,
    },
    {
        "title": "Algebra va matematika tahlili",
        "author": "A. N. Kolmogorov",
        "isbn": "978-9943-01-004-4",
        "category": cats["Matematika"],
        "total_copies": 6,
        "available_copies": 6,
        "page_count": 512,
    },
    {
        "title": "Fizika — 9-sinf",
        "author": "A. Xoliqov",
        "isbn": "978-9943-01-005-5",
        "category": cats["Fan"],
        "total_copies": 8,
        "available_copies": 8,
        "page_count": 280,
    },
    {
        "title": "O'zbekiston tarixi",
        "author": "N. Qoraboyev",
        "isbn": "978-9943-01-006-6",
        "category": cats["Tarix"],
        "total_copies": 5,
        "available_copies": 5,
        "page_count": 350,
    },
    {
        "title": "Ingliz tili — 10-sinf",
        "author": "R. Abdullayeva",
        "isbn": "978-9943-01-007-7",
        "category": cats["Ingliz tili"],
        "total_copies": 7,
        "available_copies": 7,
        "page_count": 240,
    },
    {
        "title": "Biologiya — 8-sinf",
        "author": "T. Toshmatov",
        "isbn": "978-9943-01-008-8",
        "category": cats["Fan"],
        "total_copies": 5,
        "available_copies": 5,
        "page_count": 320,
    },
    {
        "title": "Kimyo — 11-sinf",
        "author": "A. Numonov",
        "isbn": "978-9943-01-009-9",
        "category": cats["Fan"],
        "total_copies": 4,
        "available_copies": 4,
        "page_count": 390,
    },
    {
        "title": "Jahon tarixi",
        "author": "B. Eshov",
        "isbn": "978-9943-01-010-0",
        "category": cats["Tarix"],
        "total_copies": 3,
        "available_copies": 3,
        "page_count": 480,
    },
]

created = 0
skipped = 0

for book_data in BOOKS:
    existing = Book.objects.filter(isbn=book_data["isbn"], organization=org).first()
    if existing:
        print(f"  MAVJUD: {book_data['title']}")
        skipped += 1
        continue

    Book.objects.create(
        title=book_data["title"],
        author=book_data["author"],
        isbn=book_data["isbn"],
        category=book_data["category"],
        organization=org,
        total_copies=book_data["total_copies"],
        available_copies=book_data["available_copies"],
        page_count=book_data["page_count"],
    )
    print(f"  + Qo'shildi: {book_data['title']}")
    created += 1

print(f"\n=== Tayyor: {created} ta yangi kitob qo'shildi, {skipped} ta mavjud edi ===")
print(f"Jami kitoblar: {Book.objects.filter(organization=org).count()}")
