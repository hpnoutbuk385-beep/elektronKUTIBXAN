from django.contrib import admin
from .models import Category, Book, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'organization', 'available_copies')
    list_filter = ('category', 'organization')
    search_fields = ('title', 'author', 'isbn')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'status', 'borrow_date', 'due_date')
    list_filter = ('status', 'borrow_date')
