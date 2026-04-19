from django.db import models
from accounts.models import CustomUser, Organization
from exams.models import Quiz

class Competition(models.Model):
    LEVEL_CHOICES = (
        ('SCHOOL', 'School Level'),
        ('DISTRICT', 'District Level'),
        ('REGION', 'Region Level'),
        ('NATIONAL', 'National Level'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='SCHOOL')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, help_text="Null for national competitions")
    associated_quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.get_level_display()})"

class Participant(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='competition_participations')
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='participants')
    registration_date = models.DateTimeField(auto_now_add=True)
    final_score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'competition')

    def __str__(self):
        return f"{self.user.username} in {self.competition.title}"
