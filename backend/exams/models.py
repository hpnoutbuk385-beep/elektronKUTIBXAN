from django.db import models
from accounts.models import CustomUser

class Question(models.Model):
    QUESTION_TYPES = (
        ('MCQ', 'Multiple Choice'),
        ('TF', 'True/False'),
    )
    text = models.TextField()
    q_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='MCQ')
    choice_a = models.CharField(max_length=255, blank=True)
    choice_b = models.CharField(max_length=255, blank=True)
    choice_c = models.CharField(max_length=255, blank=True)
    choice_d = models.CharField(max_length=255, blank=True)
    correct_answer = models.CharField(max_length=1, help_text='A, B, C, or D')
    points_value = models.IntegerField(default=5)

    def __str__(self):
        return self.text[:50]

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    questions = models.ManyToManyField(Question, related_name='quizzes')
    passing_score = models.IntegerField(default=70) # Percentage
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Attempt(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField()
    is_passed = models.BooleanField(default=False)
    date_attempted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} ({self.score}%)"
