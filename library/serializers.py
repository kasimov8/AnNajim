from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser, Book, Aksessuar


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
        fields = ['username', 'phone', 'email']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class AksessuarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aksessuar
        fields = '__all__'