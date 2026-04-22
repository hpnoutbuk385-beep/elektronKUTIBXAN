import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization

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
    
    print(f"\nBarcha ishlar bajarildi! Jami yangi qo'shilgan maktablar: {created_count}")

if __name__ == "__main__":
    seed_custom_schools()
