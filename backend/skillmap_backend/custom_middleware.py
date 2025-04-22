from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from authentication.models import CustomUser

class SimpleAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Check if username is in the request headers
        username = request.headers.get('X-Username')
        
        if username:
            # Try to get the user by username
            try:
                user = CustomUser.objects.get(username=username)
                request.user = user
            except CustomUser.DoesNotExist:
                pass
        
        return None