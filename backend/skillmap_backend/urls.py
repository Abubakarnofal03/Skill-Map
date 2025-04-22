from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('csrf/', get_csrf_token),
    path('api/', include('authentication.urls')),
    path('api/', include('projects.urls')),  # Ensure this line is correct
]
