from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# @csrf_exempt
# def login_view(request):
#     if request.method == 'POST':
#         try:
#             # Parse the JSON data from the request body
#             data = json.loads(request.body)
#             username = data.get('username')
#             password = data.get('password')

#             # Authenticate the user
#             user = authenticate(username=username, password=password)
#             if user is not None:
#                 # return JsonResponse({'success': True, 'message': 'Login successful'})
#             else:
#                 return JsonResponse({'success': False, 'message': 'Invalid username or password'})
#         except json.JSONDecodeError:
#             return JsonResponse({'success': False, 'message': 'Invalid JSON payload'}, status=400)
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)
