from django.contrib import admin
from .models import Quiz, Question, Attempt

class QuestionInline(admin.TabularInline):
    model = Quiz.questions.through
    extra = 3

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'q_type', 'points_value')
    search_fields = ('text',)

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'passing_score', 'created_at')
    inlines = [QuestionInline]
    exclude = ('questions',)

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'is_passed', 'date_attempted')
    list_filter = ('is_passed', 'quiz')
    readonly_fields = ('date_attempted',)
