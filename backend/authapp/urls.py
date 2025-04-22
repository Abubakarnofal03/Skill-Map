from .views import login_view
from django.contrib import admin
from django.urls import path, include
urlpatterns = [
    # path('login/', login_view, name='login'),
    path('api/', include('authapp.urls')), 
]
