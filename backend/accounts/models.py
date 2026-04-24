from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Organization(models.Model):
    ORG_TYPES = (
        ('MINISTRY', 'Ministry'),
        ('REGION', 'Region'),
        ('DISTRICT', 'District'),
        ('SCHOOL', 'School'),
    )
    name = models.CharField(max_length=255)
    org_type = models.CharField(max_length=20, choices=ORG_TYPES)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    region_name = models.CharField(max_length=100, blank=True) # e.g. "Toshkent sh."
    district_name = models.CharField(max_length=100, blank=True) # e.g. "Yunusobod t."

    def __str__(self):
        return f"{self.name} ({self.get_org_type_display()})"

    class Meta:
        verbose_name = _('Tashkilot')
        verbose_name_plural = _('Tashkilotlar')

class SchoolClass(models.Model):
    LANG_CHOICES = (
        ('kk', 'Qaraqalpaq'),
        ('uz', 'O\'zbek'),
        ('ru', 'Rus'),
    )
    name = models.CharField(max_length=50) # e.g. "9-A"
    language = models.CharField(max_length=10, choices=LANG_CHOICES, default='kk')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='classes')

    def __str__(self):
        return f"{self.name} ({self.get_language_display()}) - {self.organization.name}"

    class Meta:
        verbose_name = _('Sinf/Sinfxon')
        verbose_name_plural = _('Sinf/Sinfxonlar')

class CustomUser(AbstractUser):
    ROLES = (
        ('SUPERADMIN', 'Ministry Admin'),
        ('REGION_ADMIN', 'Region Admin'),
        ('DISTRICT_ADMIN', 'District Admin'),
        ('SCHOOL_ADMIN', 'Principal/Librarian'),
        ('TEACHER', 'Teacher'),
        ('STUDENT', 'Student'),
    )
    role = models.CharField(max_length=20, choices=ROLES, default='STUDENT')
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    school_class = models.ForeignKey(SchoolClass, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    subject = models.CharField(max_length=100, blank=True, null=True) # For Teachers
    phone = models.CharField(max_length=20, blank=True)
    plain_password = models.CharField(max_length=128, blank=True, null=True, help_text="Adminlar ko'rishi uchun vaqtinchalik saqlanadigan parol")
    points = models.IntegerField(default=0)
    qr_code = models.CharField(max_length=255, unique=True, null=True, blank=True)
    qr_code_image = models.ImageField(upload_to='user_qrcodes/', null=True, blank=True)
    dynamic_qr_secret = models.CharField(max_length=32, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            import uuid
            self.qr_code = f"USER-{self.username}-{uuid.uuid4().hex[:8]}"
        
        if not self.dynamic_qr_secret:
            import secrets
            self.dynamic_qr_secret = secrets.token_hex(16)

        if not self.qr_code_image:
            from library.utils import generate_qr_code
            filename = f"user_qr_{self.username}.png"
            qr_file = generate_qr_code(self.qr_code, filename)
            self.qr_code_image.save(filename, qr_file, save=False)

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('Foydalanuvchi')
        verbose_name_plural = _('Foydalanuvchilar')

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    def get_dynamic_qr(self):
        """Generates a dynamic QR code string that changes every minute"""
        import hashlib
        import time
        minute_timestamp = int(time.time() / 120)
        hash_input = f"{self.qr_code}{minute_timestamp}{self.dynamic_qr_secret}"
        dynamic_hash = hashlib.sha256(hash_input.encode()).hexdigest()[:10]
        return f"DYN-{self.qr_code}-{dynamic_hash}"

class UserCredentials(CustomUser):
    class Meta:
        proxy = True
        verbose_name = 'Loglar va Parol'
        verbose_name_plural = 'Loglar va Parollar'
