from django.urls import path, include
from .views import Hello


urlpatterns = [
    path('', Hello.as_view(), name='hello API'),
    path('auth/', include("v1.auth.urls")),
]