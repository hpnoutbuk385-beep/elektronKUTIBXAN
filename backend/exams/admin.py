from django.contrib import admin
from .models import Quiz, Question, Attempt

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'q_type', 'points_value')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'passing_score', 'created_at')

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'is_passed', 'date_attempted')
    list_filter = ('is_passed', 'quiz')
