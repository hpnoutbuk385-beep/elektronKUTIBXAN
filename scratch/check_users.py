import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser

users = CustomUser.objects.all()
print(f"Total users: {users.count()}")
for user in users:
    print(f"Username: {user.username}, Role: {user.role}, Is Superuser: {user.is_superuser}")
