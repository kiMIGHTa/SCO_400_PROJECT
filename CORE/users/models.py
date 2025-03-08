from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# Create your models here.

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:  # Only set password if provided
            user.set_password(password)
        else:
            user.set_unusable_password()  # Prevent login if no password
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    contact = models.CharField(max_length=20, blank=True, null=True)
    deleted = models.BooleanField(default=False)
 
    has_restaurant = models.BooleanField(default=False)  # True if user owns a restaurant

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def is_vendor(self):
        """Check if the user owns a restaurant."""
        return self.has_restaurant

