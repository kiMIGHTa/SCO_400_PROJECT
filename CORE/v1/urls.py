from django.urls import path, include
from .views import Hello
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('', Hello.as_view(), name='hello API'),
    path('auth/', include("v1.auth.urls")),
    path('restaurants/', include("v1.restaurant.urls")),
    path('order/', include("v1.order.urls")),
    path('cart/', include("v1.cart.urls")),
    path('food/', include("v1.food.urls")),
    path('mpishi/', include("v1.payment.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)