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
    phone = models.CharField(max_length=20, blank=True)
    points = models.IntegerField(default=0)
    qr_code = models.CharField(max_length=255, unique=True, null=True, blank=True)
    qr_code_image = models.ImageField(upload_to='user_qrcodes/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            import uuid
            self.qr_code = f"USER-{self.username}-{uuid.uuid4().hex[:8]}"
        
        if not self.qr_code_image:
            from library.utils import generate_qr_code
            filename = f"user_qr_{self.username}.png"
            qr_file = generate_qr_code(self.qr_code, filename)
            self.qr_code_image.save(filename, qr_file, save=False)

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
