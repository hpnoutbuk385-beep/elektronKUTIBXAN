from django.core.management.base import BaseCommand
from accounts.models import Organization


class Command(BaseCommand):
    help = "Seed initial organizations (schools) into the database"

    def handle(self, *args, **kwargs):
        # Create Superuser if it doesn't exist
        from accounts.models import CustomUser
        if not CustomUser.objects.filter(username="Admin").exists():
            CustomUser.objects.create_superuser("Admin", "admin@example.com", "xx63blk")
            self.stdout.write(self.style.SUCCESS("✅ Superuser 'Admin' created successfully!"))

        if Organization.objects.exists():
            self.stdout.write(self.style.WARNING("Organizations already exist. Skipping organization seed."))
            return

        # Create Ministry (root)
        ministry = Organization.objects.create(
            name="Xalq ta'limi vazirligi",
            org_type="MINISTRY"
        )

        # Regions
        tashkent = Organization.objects.create(
            name="Toshkent shahri",
            org_type="REGION",
            parent=ministry,
            region_name="Toshkent sh."
        )
        samarkand = Organization.objects.create(
            name="Samarqand viloyati",
            org_type="REGION",
            parent=ministry,
            region_name="Samarqand vil."
        )
        fergana = Organization.objects.create(
            name="Farg'ona viloyati",
            org_type="REGION",
            parent=ministry,
            region_name="Farg'ona vil."
        )
        namangan = Organization.objects.create(
            name="Namangan viloyati",
            org_type="REGION",
            parent=ministry,
            region_name="Namangan vil."
        )
        andijan = Organization.objects.create(
            name="Andijon viloyati",
            org_type="REGION",
            parent=ministry,
            region_name="Andijon vil."
        )
        bukhara = Organization.objects.create(
            name="Buxoro viloyati",
            org_type="REGION",
            parent=ministry,
            region_name="Buxoro vil."
        )

        # Districts under Tashkent
        yunusobod = Organization.objects.create(
            name="Yunusobod tumani",
            org_type="DISTRICT",
            parent=tashkent,
            region_name="Toshkent sh.",
            district_name="Yunusobod t."
        )
        chilonzor = Organization.objects.create(
            name="Chilonzor tumani",
            org_type="DISTRICT",
            parent=tashkent,
            region_name="Toshkent sh.",
            district_name="Chilonzor t."
        )
        mirzo_ulugbek = Organization.objects.create(
            name="Mirzo Ulug'bek tumani",
            org_type="DISTRICT",
            parent=tashkent,
            region_name="Toshkent sh.",
            district_name="Mirzo Ulug'bek t."
        )

        # Schools under Yunusobod
        schools_yunusobod = [
            "1-sonli maktab", "2-sonli maktab", "5-sonli maktab",
            "12-sonli maktab", "34-sonli maktab", "56-sonli maktab",
        ]
        for name in schools_yunusobod:
            Organization.objects.create(
                name=f"Yunusobod {name}",
                org_type="SCHOOL",
                parent=yunusobod,
                region_name="Toshkent sh.",
                district_name="Yunusobod t."
            )

        # Schools under Chilonzor
        schools_chilonzor = [
            "7-sonli maktab", "11-sonli maktab", "23-sonli maktab",
            "45-sonli maktab", "67-sonli maktab",
        ]
        for name in schools_chilonzor:
            Organization.objects.create(
                name=f"Chilonzor {name}",
                org_type="SCHOOL",
                parent=chilonzor,
                region_name="Toshkent sh.",
                district_name="Chilonzor t."
            )

        # Schools under Mirzo Ulugbek
        schools_mirzo = [
            "3-sonli maktab", "8-sonli maktab", "15-sonli maktab",
            "28-sonli maktab",
        ]
        for name in schools_mirzo:
            Organization.objects.create(
                name=f"Mirzo Ulug'bek {name}",
                org_type="SCHOOL",
                parent=mirzo_ulugbek,
                region_name="Toshkent sh.",
                district_name="Mirzo Ulug'bek t."
            )

        # Samarkand schools (direct under region)
        samarkand_schools = [
            "Samarqand 1-maktab", "Samarqand 2-maktab",
            "Samarqand 10-maktab", "Samarqand 25-maktab",
        ]
        for name in samarkand_schools:
            Organization.objects.create(
                name=name,
                org_type="SCHOOL",
                parent=samarkand,
                region_name="Samarqand vil."
            )

        # Fergana schools
        fergana_schools = [
            "Farg'ona 1-maktab", "Farg'ona 4-maktab",
            "Farg'ona 9-maktab", "Farg'ona 17-maktab",
        ]
        for name in fergana_schools:
            Organization.objects.create(
                name=name,
                org_type="SCHOOL",
                parent=fergana,
                region_name="Farg'ona vil."
            )

        self.stdout.write(self.style.SUCCESS(
            f"✅ Successfully seeded {Organization.objects.count()} organizations!"
        ))
