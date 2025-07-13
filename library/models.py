from django.contrib.auth.models import AbstractUser
from django.db import models



class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    phone = models.CharField(max_length=20, unique=True)


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['phone', 'email']

    def __str__(self):
        return self.phone


class Book(models.Model):
    title = models.CharField(max_length=50, unique=True)
    author = models.CharField(max_length=50)
    image = models.ImageField()
    description = models.TextField()
    price = models.FloatField()
    numberOfbooks = models.BigIntegerField()
    category = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.title}"


class Aksessuar(models.Model):
    title = models.CharField(max_length=50, unique=True)
    price = models.FloatField()
    image = models.ImageField()
    numberOfAksessuars = models.BigIntegerField()
    category = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.title}"


