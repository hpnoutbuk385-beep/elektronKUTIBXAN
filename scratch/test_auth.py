import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser
from django.contrib.auth import authenticate

username = 'adminrdx123'
password = 'xx63blk'

user = authenticate(username=username, password=password)

if user:
    print(f"Authentication SUCCESS for {username}")
    print(f"Role: {user.role}, Is Staff: {user.is_staff}, Is Superuser: {user.is_superuser}")
else:
    print(f"Authentication FAILED for {username}")
    u = CustomUser.objects.filter(username=username).first()
    if u:
        print(f"User {username} exists, but password check failed.")
    else:
        print(f"User {username} does not exist.")
