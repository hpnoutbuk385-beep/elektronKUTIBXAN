from django.contrib import admin
from .models import Reward, Purchase

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('name', 'points_cost', 'stock', 'organization', 'is_active')
    list_filter = ('organization', 'is_active')

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'reward', 'purchase_date', 'is_claimed')
    list_filter = ('is_claimed',)
