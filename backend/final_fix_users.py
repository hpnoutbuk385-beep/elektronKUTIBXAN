import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser

def fix():
    users = [
        ('adminrdx123', 'xx63blk'),
        ('adminrdx1', 'xx63blk'),
        ('user1', 'parol1'),
        ('user2', 'parol2'),
        ('user3', 'parol3'),
    ]
    
    for username, password in users:
        u = CustomUser.objects.filter(username=username).first()
        if not u:
            u = CustomUser.objects.create(username=username, is_superuser=True, is_staff=True, role='SUPERADMIN')
        
        u.set_password(password)
        u.plain_password = password
        u.save()
        print(f"Fixed user: {username}")

if __name__ == '__main__':
    fix()
