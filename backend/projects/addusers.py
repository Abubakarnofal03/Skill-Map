import requests
import random

# List of possible skills
SKILLS = ["UI/UX", "Frontend", "Backend", "Database", "AI/ML", "DevOps", "QA"]

# Base URL
BASE_URL = "http://localhost:8000/api/register/"

# Existing users (already in your script) are not repeated.
users = [
    {"username": f"alice{i}", "email": f"alice{i}@gmail.com", "password": f"alice{i*1111}", "status": "free"}
    for i in range(5, 55)
] + [
    {"username": f"bob{i}", "email": f"bob{i}@gmail.com", "password": f"bob{i*1111}", "status": "free"}
    for i in range(5, 55)
] + [
    {"username": f"charlie{i}", "email": f"charlie{i}@gmail.com", "password": f"charlie{i*1111}", "status": "free"}
    for i in range(5, 15)
] + [
    {"username": f"dave{i}", "email": f"dave{i}@gmail.com", "password": f"dave{i*1111}", "status": "free"}
    for i in range(5, 15)
]

# You now have:
# - alice5 to alice54 (50 users)
# - bob5 to bob54 (50 users)
# - charlie5 to charlie14 (10 users)
# - dave5 to dave14 (10 users)
# Total = 120 additional users (more than 100, so you can trim if needed)

# Add users to your API
for user in users:
    user["skill"] = random.choice(SKILLS)  # Assign a random skill
    user["designation"] = random.choice(["junior_developer", "mid_developer", "senior_developer"])  # Assign a random designation
    response = requests.post(BASE_URL, json=user)
    print(f"Added user {user['username']}: {response.status_code}")
