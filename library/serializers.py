from decimal import Decimal, ROUND_HALF_UP

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser, Book, Order


# class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
#     phone = serializers.CharField()
#     password = serializers.CharField()
#
#     def validate(self, attrs):
#         print('Keldi', attrs)
#
#         phone = attrs.get("phone")
#         password = attrs.get("password")
#
#
#
#         try:
#             user = CustomUser.objects.get(phone=phone)
#         except CustomUser.DoesNotExist:
#             raise serializers.ValidationError("Telefon raqam hali registratsiyadan o'tmagan!")
#
#         user = authenticate(username=user.username, password=password)
#
#         if user is None:
#             raise serializers.ValidationError("Parol noto‘g‘ri")
#
#         refresh = RefreshToken.for_user(user)
#
#         return {
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'username': user.username,
#             'phone': user.phone
#         }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'email', 'phone', 'password']

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone']
        )
        user.set_password(validated_data['password'])
        user.is_active = True
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'phone', 'email', 'is_staff', 'is_superuser']

class BookSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_discounted_price(self, obj):
        if obj.discount > 0:
            discounted = obj.price - (obj.price * obj.discount / 100)
            return discounted
        return obj.price

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    phone_number = serializers.CharField(source='user.phone')
    book = serializers.CharField(source='book.title')
    book_image = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'phone_number', 'book', 'price', 'quantity', 'total_price', 'location', 'created_at', 'book_image']


    def get_user(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def get_total_price(self, obj):
        return obj.total_price

    def get_book_image(self, obj):
        request = self.context.get('request')
        if obj.book.image and request:
            return request.build_absolute_uri(obj.book.image.url)
        return None

