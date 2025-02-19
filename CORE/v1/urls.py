from django.urls import path, include
from .views import Hello
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('', Hello.as_view(), name='hello API'),
    path('auth/', include("v1.auth.urls")),
    path('restaurant/', include("v1.restaurant.urls")),
    path('food/', include("v1.food.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)