from django.urls import path
from .views import RegisterView, LoginView, LogoutView, EmployeeDetailsView, AllEmployeesView, get_user_details

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('employee/details/', EmployeeDetailsView.as_view(), name='employee-details'),
    path('employee/all/', AllEmployeesView.as_view(), name='all-employees'),  # New endpoint
    path('auth/user/', get_user_details, name='user_details'),
]
