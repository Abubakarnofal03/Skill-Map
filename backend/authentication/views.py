from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer
from authentication.models import CustomUser
# Remove this line: from django.contrib.auth.models import User
from .models import Admin
from rest_framework.generics import ListAPIView
import logging

# Add a logger for debugging
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to register
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to login
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')

        print(f"Login attempt: {username}, role: {role}")  # Debug print

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # In your LoginView class, modify the admin authentication part:
        
        if role == 'admin':
            try:
                # Print all admin emails for debugging
                all_admins = Admin.objects.all()
                print(f"All admin emails in database: {[a.email for a in all_admins]}")
                
                # Try to get the admin with case-insensitive query
                admin = Admin.objects.filter(email__iexact=username).first()
                
                if not admin:
                    print(f"Admin not found with email: {username}")
                    return Response({'error': 'Admin not found'}, status=status.HTTP_400_BAD_REQUEST)
                
                print(f"Admin found: {admin.email}")
                
                # Check if the password is valid against the hashed password
                is_valid = check_password(password, admin.password)
                print(f"Password validation result: {is_valid}")
                
                if is_valid:
                    return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"Error during admin authentication: {str(e)}")
                return Response({'error': 'Authentication error'}, status=status.HTTP_400_BAD_REQUEST)

        # The issue is in the employee authentication part of your LoginView
        # After the admin authentication block, you have:
        
        # For employee authentication, add more debugging:
        print(f"Attempting to authenticate employee: {username}")
        
        # Check if the user exists first
        try:
            user_exists = CustomUser.objects.filter(username=username).exists()
            print(f"User exists check: {user_exists}")
            
            if user_exists:
                user_obj = CustomUser.objects.get(username=username)
                print(f"Found user: {user_obj.username}, is_active: {user_obj.is_active}")
                print(f"Password in DB starts with: {user_obj.password[:20]}...")  # Print first part of hashed password
            
            # Try authentication with Django's built-in authenticate
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                print(f"User authenticated: {user.username}")
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                print(f"Authentication failed for {username}")
                
                # Additional debugging to check if password is hashed correctly
                if user_exists:
                    # Check if password is being stored correctly
                    from django.contrib.auth.hashers import make_password
                    test_hash = make_password(password)
                    print(f"Test hash for provided password: {test_hash[:20]}...")
                    print(f"Actual stored hash: {user_obj.password[:20]}...")
                    
                    # Try direct comparison (not recommended for production)
                    # This is just for debugging
                    if password == user_obj.password:
                        print("WARNING: Plain text password matches stored value!")
                
                return Response({'error': 'Invalid credentials - authentication failed'}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Error during employee authentication: {str(e)}")
            return Response({'error': f'Authentication error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class EmployeeDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get username from header or authenticated user
        username = request.headers.get('X-Username')
        
        if not username and request.user.is_authenticated:
            username = request.user.username
            
        if not username:
            return Response({"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = CustomUser.objects.get(username=username)
            employee_data = {
                'username': user.username,
                'name': user.username,
                'email': user.email,
                'skill': getattr(user, 'skill', ''),
                'status': getattr(user, 'status', 'Active'),
            }
            return Response(employee_data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
class AllEmployeesView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all() 
    serializer_class = UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    print(f"User details requested for: {user.username}")  # Debug print
    
    return Response({
        'username': user.username,
        'name': user.username,
        'email': user.email,
        'status': getattr(user, 'status', 'Active'),
        'designation': getattr(user, 'designation', ''),
        'skill': getattr(user, 'skill', '')
    })