from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ['email']

class Job(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    ]
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    min_experience = models.IntegerField(default=0, null = False)  # New: For filtering
    max_experience = models.IntegerField(default=1, null = False)   # New
    min_salary = models.IntegerField(default=0, null = False)      # New: Replace CharField
    max_salary = models.IntegerField(default=0, null = False)      # New
    requirements = models.TextField()
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Open')  # New
    datePosted = models.DateTimeField(auto_now_add=True)
    updateDate = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updateDate', '-datePosted']

    def __str__(self):
        return self.title
    
class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applied_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        unique_together = ('user', 'job')  # prevent applying twice
