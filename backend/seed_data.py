import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization, CustomUser
from library.models import Category

def seed_data():
    print("Seeding initial data...")
    
    # 1. Organizations
    ministry = Organization.objects.get_or_create(
        name="O'zbekiston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='MINISTRY'
    )[0]
    
    toshkent_reg = Organization.objects.get_or_create(
        name="Toshkent shahar boshqarmasi",
        org_type='REGION',
        parent=ministry,
        region_name="Toshkent sh."
    )[0]
    
    yunusobod_dist = Organization.objects.get_or_create(
        name="Yunusobod tumani bo'limi",
        org_type='DISTRICT',
        parent=toshkent_reg,
        region_name="Toshkent sh.",
        district_name="Yunusobod t."
    )[0]
    
    sample_school = Organization.objects.get_or_create(
        name="235-IDUM",
        org_type='SCHOOL',
        parent=yunusobod_dist,
        region_name="Toshkent sh.",
        district_name="Yunusobod t."
    )[0]
    
    # 2. Categories
    categories = ["Badiiy adabiyot", "Ilmiy-ommabop", "Darsliklar", "Tarixiy", "Psixologiya"]
    for cat_name in categories:
        Category.objects.get_or_create(name=cat_name)
    
    # 3. Create a School Admin (Librarian)
    librarian, created = CustomUser.objects.get_or_create(
        username="librarian1",
        email="lib@school.uz",
        role='SCHOOL_ADMIN',
        organization=sample_school
    )
    if created:
        librarian.set_password("admin123")
        librarian.save()
        print(f"Librarian created: {librarian.username}")

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
