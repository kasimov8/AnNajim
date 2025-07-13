from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from library.models import CustomUser, Order
from library.models import Book

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price')
    search_fields = ('title', 'author')


admin.site.register(Book, BookAdmin)
admin.site.register(Order)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # model = CustomUser
    # add_form = CustomUserCreationForm
    # form = CustomUserChangeForm
    list_display = ['username', 'email', 'is_staff', 'phone', 'date_joined', 'id']
    list_display_links = ['username', 'phone', 'id']

    fieldsets = UserAdmin.fieldsets + (
        ("Additional info", {'fields': ('phone',)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'phone', 'password1', 'password2')}
         ),
    )

#admin.site.register([CustomUser, CustomUserAdmin])
