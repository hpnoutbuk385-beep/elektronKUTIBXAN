import csv
from django.core.management.base import BaseCommand
from library.models import Book, Category
from accounts.models import Organization

class Command(BaseCommand):
    help = 'Imports books from a CSV file (title, author, isbn, page_count, category_name)'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str)
        parser.add_argument('school_id', type=int)

    def handle(self, *args, **options):
        file_path = options['csv_file']
        school_id = options['school_id']
        
        try:
            school = Organization.objects.get(id=school_id)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"School ID {school_id} not found"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                category, _ = Category.objects.get_or_create(name=row['category_name'])
                
                Book.objects.get_or_create(
                    title=row['title'],
                    author=row['author'],
                    isbn=row.get('isbn', ''),
                    organization=school,
                    defaults={
                        'category': category,
                        'page_count': int(row.get('page_count', 0)),
                        'available_copies': 1,
                        'total_copies': 1
                    }
                )
                count += 1
            
            self.stdout.write(self.style.SUCCESS(f"Successfully imported {count} books to {school.name}"))
