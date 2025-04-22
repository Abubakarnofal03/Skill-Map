from django.contrib.auth.models import User

def create_users():
    users_data = [
        {'username': 'user1', 'password': 'pass123'},
        {'username': 'user2', 'password': 'pass456'},
        {'username': 'user3', 'password': 'pass789'}
    ]

    for user_data in users_data:
        if not User.objects.filter(username=user_data['username']).exists():
            User.objects.create_user(username=user_data['username'], password=user_data['password'])
            print(f"Created user: {user_data['username']}")
        else:
            print(f"User {user_data['username']} already exists.")

if __name__ == '__main__':
    create_users()
