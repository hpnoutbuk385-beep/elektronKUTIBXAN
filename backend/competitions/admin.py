from django.contrib import admin
from .models import Competition, Participant

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'start_date', 'end_date', 'is_active')
    list_filter = ('level', 'is_active')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'competition', 'final_score', 'rank')
    list_filter = ('competition',)
