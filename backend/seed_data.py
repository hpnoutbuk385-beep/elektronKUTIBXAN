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
    
    # 3. Create the Main Admin (Superuser)
    admin_user, created = CustomUser.objects.get_or_create(
        username="adminrdx123",
        defaults={
            'email': "admin@example.com",
            'first_name': "Admin",
            'last_name': "Kutubxona",
            'role': 'SUPERADMIN',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if not created:
        admin_user.first_name = "Admin"
        admin_user.last_name = "Kutubxona"
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()

    if created or admin_user.check_password("xx63blk") == False:
        admin_user.set_password("xx63blk")
        admin_user.save()
        print(f"Main Admin created/updated: {admin_user.username} (Admin Kutubxona)")

    # 4. Create a School Admin (Librarian)
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
