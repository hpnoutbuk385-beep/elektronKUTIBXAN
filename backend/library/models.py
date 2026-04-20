from django.db import models
from accounts.models import Organization, CustomUser

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=20, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='books')
    qr_code = models.CharField(max_length=255, unique=True)
    qr_code_image = models.ImageField(upload_to='qrcodes/', null=True, blank=True)
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)
    page_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='books/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            import uuid
            self.qr_code = f"BOOK-{uuid.uuid4().hex[:8]}"
            
        # Generate QR image if it doesn't exist
        if not self.qr_code_image:
            from .utils import generate_qr_code
            qr_file = generate_qr_code(self.qr_code, f"{self.qr_code}.png")
            self.qr_code_image.save(f"{self.qr_code}.png", qr_file, save=False)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.organization.name}"

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('BORROWED', 'Borrowed'),
        ('RETURNED', 'Returned'),
        ('OVERDUE', 'Overdue'),
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions')
    borrow_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='BORROWED')
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"
