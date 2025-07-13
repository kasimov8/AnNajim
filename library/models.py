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
    discount = models.BigIntegerField(blank=True, default=0)

    def __str__(self):
        return f"{self.title}"



class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=200, blank=True, default='Yetkazilyapti...')

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

    @property
    def total_price(self):
        return self.price * self.quantity