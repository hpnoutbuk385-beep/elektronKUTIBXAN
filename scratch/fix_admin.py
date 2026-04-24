import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser

user = CustomUser.objects.filter(username='adminrdx123').first()
if user:
    user.set_password('xx63blk')
    user.is_staff = True
    user.is_superuser = True
    user.role = 'SUPERADMIN'
    user.save()
    print("Password for adminrdx123 has been set to xx63blk and permissions verified.")
else:
    CustomUser.objects.create_superuser('adminrdx123', 'admin@example.com', 'xx63blk', role='SUPERADMIN')
    print("User adminrdx123 was not found, so it was created as superuser with password xx63blk.")
