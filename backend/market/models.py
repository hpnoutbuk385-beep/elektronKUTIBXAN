from django.db import models
from accounts.models import CustomUser, Organization

class Reward(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    points_cost = models.IntegerField()
    image = models.ImageField(upload_to='rewards/', null=True, blank=True)
    stock = models.IntegerField(default=0)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='rewards')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.points_cost} PTS)"

class Purchase(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='purchases')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE, related_name='purchases')
    purchase_date = models.DateTimeField(auto_now_add=True)
    is_claimed = models.BooleanField(default=False)
    claim_code = models.CharField(max_length=50, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.claim_code:
            import uuid
            self.claim_code = f"REC-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} bought {self.reward.name}"
