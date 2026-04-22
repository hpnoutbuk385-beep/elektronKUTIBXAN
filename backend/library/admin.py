from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Book, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'organization', 'available_copies', 'has_ebook', 'qr_code_preview')
    list_filter = ('category', 'organization')
    search_fields = ('title', 'author', 'isbn', 'qr_code')
    readonly_fields = ('qr_code_preview',)

    def has_ebook(self, obj):
        return bool(obj.file)
    has_ebook.boolean = True
    has_ebook.short_description = 'E-kitob'

    def qr_code_preview(self, obj):
        if obj.qr_code_image:
            return format_html('<img src="{}" width="150" height="150" style="border: 1px solid #ccc; border-radius: 8px;" />', obj.qr_code_image.url)
        return "No QR Code"
    qr_code_preview.short_description = 'QR Code'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'status', 'borrow_date', 'due_date')
    list_filter = ('status', 'borrow_date')
