from accounts.models import Organization
from library.models import Book
from django.utils import timezone

# Tozalash
Organization.objects.all().delete()
Book.objects.all().delete()

# Tashkilot
reg = Organization.objects.create(
    name="Nukus shahri bo'limi", 
    org_type='DISTRICT', 
    region_name="Qoraqalpog'iston Resp."
)

# Kitoblar
books = [
    ("O'tkan kunlar", "Abdulla Qodiriy", "https://kitobxon.com/img_u/b/887.jpg"),
    ("Mehrobdan chayon", "Abdulla Qodiriy", "https://kitobxon.com/img_u/b/1500.jpg"),
    ("Kecha va kunduz", "Cho'lpon", "https://kitobxon.com/img_u/b/2034.jpg"),
    ("Yulduzli tunlar", "Pirimqul Qodirov", "https://kitobxon.com/img_u/b/2012.jpg"),
    ("Dunyoning ishlari", "O'tkir Hoshimov", "https://kitobxon.com/img_u/b/814.jpg"),
    ("Sariq devni minib", "X. To'xtaboyev", "https://kitobxon.com/img_u/b/263.jpg")
]

for idx, (t, a, i) in enumerate(books):
    Book.objects.create(
        title=t,
        author=a,
        image=i,
        organization=reg,
        total_copies=10,
        available_copies=10,
        qr_code=f"BK-{idx}"
    )

print("Seeded 6 books successfully!")
