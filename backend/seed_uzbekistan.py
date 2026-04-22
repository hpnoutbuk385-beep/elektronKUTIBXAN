import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import Organization

def seed_uzbekistan_data():
    print("O'zbekiston Respublikasi maktablarini bazaga qo'shish boshlandi...")
    
    ministry = Organization.objects.get_or_create(
        name="O'zbekiston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
        org_type='MINISTRY'
    )[0]

    regions_data = {
        "Toshkent shahri": ["Mirobod tumani", "Yunusobod tumani", "Mirzo Ulug'bek tumani", "Chilonzor tumani", "Yashnobod tumani", "Sirg'ali tumani", "Uchtepa tumani", "Shayxontohur tumani", "Olmazor tumani", "Yakkasaroy tumani", "Bektemir tumani"],
        "Toshkent viloyati": ["Bo'stonliq tumani", "Qibray tumani", "Zangiota tumani", "Yangiyo'l tumani", "Oqqo'rg'on tumani", "Ohangaron tumani", "Parkent tumani", "Piskent tumani", "Chinoz tumani", "O'rta Chirchiq tumani", "Quyi Chirchiq tumani", "Yuqori Chirchiq tumani", "Chirchiq shahri", "Angren shahri", "Bekobod shahri", "Olmaliq shahri"],
        "Andijon viloyati": ["Andijon shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo'z tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Marhamat tumani", "Oltinko'l tumani", "Paxtaobod tumani", "Qo'rg'ontepa tumani", "Shahrixon tumani", "Ulug'nor tumani", "Xo'jaobod tumani"],
        "Buxoro viloyati": ["Buxoro shahri", "Buxoro tumani", "G'ijduvon tumani", "Jondor tumani", "Kogon tumani", "Olot tumani", "Peshku tumani", "Qorako'l tumani", "Qorovulbozor tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],
        "Farg'ona viloyati": ["Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", "Beshariq tumani", "Bog'dod tumani", "Buvayda tumani", "Dang'ara tumani", "Farg'ona tumani", "Furqat tumani", "Qo'shtepa tumani", "Quva tumani", "Rishton tumani", "So'x tumani", "Toshloq tumani", "Uchko'prik tumani", "Yozyovon tumani"],
        "Jizzax viloyati": ["Jizzax shahri", "Arnasoy tumani", "Baxmal tumani", "Do'stlik tumani", "Forish tumani", "G'allaorol tumani", "Mirzacho'l tumani", "Paxtakor tumani", "Zafarobod tumani", "Zarbdor tumani", "Zomin tumani"],
        "Xorazm viloyati": ["Urganch shahri", "Bog'ot tumani", "Gurlan tumani", "Qo'shko'pir tumani", "Xazarasp tumani", "Xiva tumani", "Xonqa tumani", "Shovot tumani", "Yangiariq tumani", "Yangibozor tumani"],
        "Namangan viloyati": ["Namangan shahri", "Chortoq tumani", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Namangan tumani", "Norin tumani", "Pop tumani", "To'raqo'rg'on tumani", "Uchqo'rg'on tumani", "Uychi tumani", "Yangiqo'rg'on tumani"],
        "Navoiy viloyati": ["Navoiy shahri", "Zarafshon shahri", "Karmana tumani", "Konimex tumani", "Navbahor tumani", "Nurota tumani", "Qiziltepa tumani", "Tomdi tumani", "Uchquduq tumani", "Xatirchi tumani"],
        "Qashqadaryo viloyati": ["Qarshi shahri", "Chiroqchi tumani", "Dehqonobod tumani", "G'uzor tumani", "Kamashi tumani", "Kasbi tumani", "Kitob tumani", "Koson tumani", "Mirishkor tumani", "Muborak tumani", "Nishon tumani", "Qarshi tumani", "Shakhrisabz tumani", "Yakkabog' tumani"],
        "Samarqand viloyati": ["Samarqand shahri", "Bulung'ur tumani", "Ishtixon tumani", "Jomboy tumani", "Kattaqo'rg'on tumani", "Narpay tumani", "Nurobod tumani", "Oqdaryo tumani", "Paxtachi tumani", "Payariq tumani", "Pastdarg'om tumani", "Qo'shrabot tumani", "Samarqand tumani", "Toyloq tumani", "Urgut tumani"],
        "Sirdaryo viloyati": ["Guliston shahri", "Boyovut tumani", "Oqoltin tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani", "Xovos tumani", "Mirzaobod tumani"],
        "Surxondaryo viloyati": ["Termiz shahri", "Angor tumani", "Bandixon tumani", "Boysun tumani", "Denov tumani", "Jarqo'rg'on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Qiziriq tumani", "Qumqo'rg'on tumani", "Sariosiyo tumani", "Sherobod tumani", "Sho'rchi tumani", "Termiz tumani", "Uzun tumani"]
    }

    # Optimizing by creating lists of objects and using bulk_create if needed, 
    # but since it's hierarchical, we do it carefully.
    
    total_schools_created = 0

    for region_name, districts in regions_data.items():
        region_obj, _ = Organization.objects.get_or_create(
            name=f"{region_name} boshqarmasi",
            org_type='REGION',
            parent=ministry,
            region_name=region_name
        )
        
        print(f"[OK] {region_name} boshlandi...")
        
        for district_name in districts:
            district_obj, _ = Organization.objects.get_or_create(
                name=f"{district_name} bo'limi",
                org_type='DISTRICT',
                parent=region_obj,
                region_name=region_name,
                district_name=district_name
            )
            
            # Use bulk_create for schools to speed up creation
            existing_schools = Organization.objects.filter(parent=district_obj).values_list('name', flat=True)
            existing_set = set(existing_schools)
            
            schools_to_create = []
            for i in range(1, 51):
                maktab_name = f"{i}-maktab"
                if maktab_name not in existing_set:
                    schools_to_create.append(
                        Organization(
                            name=maktab_name,
                            org_type='SCHOOL',
                            parent=district_obj,
                            region_name=region_name,
                            district_name=district_name
                        )
                    )
            
            if schools_to_create:
                Organization.objects.bulk_create(schools_to_create)
                total_schools_created += len(schools_to_create)
                
        print(f"[OK] {region_name} hududida tumanlar va maktablar yaratildi.")

    print(f"\nBarcha ma'lumotlar kiritildi! Jami yangi qo'shilgan maktablar: {total_schools_created}")

if __name__ == "__main__":
    seed_uzbekistan_data()
