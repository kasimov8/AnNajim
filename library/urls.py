from django.urls import path
from library import views as library_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/', library_views.register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', library_views.ProfileView.as_view(), name='user-profile'),
    path('delete/', library_views.DeleteUserView.as_view(), name='delete-account'),
    path('books/',  library_views.BookView.as_view(), name='books'),
    path('add_books/',  library_views.add_book, name='add-books'),
    path('booksdetail/<int:pk>/', library_views.BookDetailView.as_view(), name='book-detail'),
    path('orders/', library_views.OrderCreateView.as_view(), name='order'),
    path('orders/list/', library_views.OrderListView.as_view(), name='list-orders'),
    path('orders/my/', library_views.MyOrdersView.as_view(), name='my-orders'),
    path('discountedbooks/', library_views.DiscountedBooks.as_view(), name='discounted-books'),
]