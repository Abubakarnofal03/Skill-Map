from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.hashers import make_password


class CustomUser(AbstractUser):
    # Existing fields
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    # New Fields
    skill = models.CharField(max_length=255, blank=True, null=True)  # Skill of the employee
    STATUS_CHOICES = [
        ('free', 'Free'),
        ('busy', 'Busy'),
        ('on_leave', 'On Leave'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='free')

    DESIGNATION_CHOICES = [
        ('senior_developer', 'Senior Developer'),
        ('mid_developer', 'Mid Developer'),
        ('junior_developer', 'Junior Developer'),
    ]
    designation = models.CharField(max_length=20, choices=DESIGNATION_CHOICES, default='junior_developer')

    def __str__(self):
        return f"{self.username} ({self.designation})"


class Admin(models.Model):
    email = models.EmailField(verbose_name='Email Address', unique=True)
    password = models.CharField(verbose_name='Password', max_length=128)
    
    def save(self, *args, **kwargs):
        # Hash the password if it's not already hashed
        if not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
    @classmethod
    def check_admin_exists(cls, email):
        """Helper method to check if an admin exists with case-insensitive email matching"""
        return cls.objects.filter(email__iexact=email).exists()
    



   