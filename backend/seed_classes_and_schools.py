import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization, SchoolClass

def seed():
    print("Maktablar va sinflarni qo'shish boshlandi...")

    # Qoraqalpog'iston viloyatini topamiz
    ministry = Organization.objects.filter(org_type='MINISTRY').first()
    qoraqalpoq_reg, _ = Organization.objects.get_or_create(
        name="Qoraqalpog'iston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='REGION',
        parent=ministry,
        region_name="Qoraqalpog'iston Resp."
    )

    # Tumanlar / Shaharlar
    xojayli_dist, _ = Organization.objects.get_or_create(
        name="Xo'jayli tumani bo'limi",
        org_type='DISTRICT',
        parent=qoraqalpoq_reg,
        region_name="Qoraqalpog'iston Resp.",
        district_name="Xo'jayli tumani"
    )
    
    nukus_city, _ = Organization.objects.get_or_create(
        name="Nukus shahri bo'limi",
        org_type='DISTRICT',
        parent=qoraqalpoq_reg,
        region_name="Qoraqalpog'iston Resp.",
        district_name="Nukus shahri"
    )

    nukus_dist, _ = Organization.objects.get_or_create(
        name="Nukus tumani bo'limi",
        org_type='DISTRICT',
        parent=qoraqalpoq_reg,
        region_name="Qoraqalpog'iston Resp.",
        district_name="Nukus tumani"
    )

    districts_info = [
        (xojayli_dist, "Xo'jayli", 44),
        (nukus_city, "Nukus", 60),
        (nukus_dist, "Nukus tumani", 35) # Taxminan 35 ta maktab qo'shildi
    ]

    classes_to_create = []
    for i in range(1, 12):
        classes_to_create.extend([
            (f"{i}-A", 'uz'),
            (f"{i}-B", 'ru'),
            (f"{i}-V", 'kk')
        ])

    schools_count = 0
    classes_count = 0

    print("Kuting, bu biroz vaqt olishi mumkin...")

    for dist, suffix, count in districts_info:
        for i in range(1, count + 1):
            maktab_name = f"{i}-maktab — {suffix}"
            org, created = Organization.objects.get_or_create(
                name=maktab_name,
                org_type='SCHOOL',
                parent=dist,
                region_name="Qoraqalpog'iston Resp.",
                district_name=dist.district_name
            )
            if created:
                schools_count += 1

            # Mavjud sinflarni tekshiramiz
            existing_classes = set(org.classes.values_list('name', flat=True))
            
            # Yangi sinflarni tayyorlaymiz
            new_classes = []
            for cls_name, lang in classes_to_create:
                if cls_name not in existing_classes:
                    new_classes.append(SchoolClass(name=cls_name, language=lang, organization=org))
            
            # Agar yangi sinflar bo'lsa, ularni birdaniga saqlaymiz (tezroq ishlashi uchun)
            if new_classes:
                SchoolClass.objects.bulk_create(new_classes)
                classes_count += len(new_classes)

    print(f"[OK] {schools_count} ta yangi maktab qo'shildi.")
    print(f"[OK] {classes_count} ta yangi sinf qo'shildi.")
    print("Muvaffaqiyatli yakunlandi!")

if __name__ == "__main__":
    seed()
