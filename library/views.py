from aiohttp import request
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListCreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
# from .serializers import PhoneTokenObtainPairSerializer

from .models import CustomUser, Book, Order
from .serializers import RegisterSerializer, ProfileSerializer, BookSerializer, OrderSerializer


@api_view(['POST', 'GET'])
def register_user(request):
    if request.method == 'GET':
        users = CustomUser.objects.all()
        serializer = RegisterSerializer(users, many=True)  # ← serialize qilyapmiz
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Foydalanuvchi muvaffaqiyatli yaratildi"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class BookView(APIView):

    def get(self, request):
        books = Book.objects.filter(discount__exact=0)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def add_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=400)

class BookDetailView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response({"detail": "Book deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        orders_data = request.data.get('orders', [])
        location = request.data.get('location', '')

        if not location:
            return Response({'error': 'Manzil kiritilishi kerak.'}, status=400)

        for item in orders_data:
            book_id = item.get('book')
            quantity = item.get('quantity', 1)

            try:
                book = Book.objects.get(id=book_id)

                if book.numberOfbooks < quantity:
                    return Response({'error': f"'{book.title}' kitobidan {quantity} dona qolmagan."}, status=400)

                book.numberOfbooks -= quantity
                book.save()

                Order.objects.create(
                    user=request.user,
                    book=book,
                    quantity=quantity,
                    location=location,
                    price=book.price,
                )

            except Book.DoesNotExist:
                return Response({'error': f'Book ID {book_id} topilmadi.'}, status=400)

        return Response({'message': 'Buyurtmalar saqlandi!'}, status=201)


class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)


class DiscountedBooks(APIView):
    def get(self, request):
        books = Book.objects.filter(discount__gt=0)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
