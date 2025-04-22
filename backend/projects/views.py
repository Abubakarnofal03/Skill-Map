from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Task, TeamMember
from .serializers import ProjectSerializer, TaskSerializer
from django.shortcuts import get_object_or_404
import re
from authentication.models import CustomUser
import google.generativeai as genai
import json
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer

# Function to generate tasks using Gemini AI based on project description
def get_gemini_tasks(project_description, startdate, enddate):
    API_KEY = "AIzaSyC1q4axvbgU-dZGWw1A3HXHkpu0sXUBOJE"
    genai.configure(api_key=API_KEY)

    prompt = f"""
    Based on the following **project description**, generate a structured JSON response:
    
    **Project Description:**
    "{project_description}"

    **Project Start Date:** {startdate}
    **Project End Date:** {enddate}

    ### **Instructions:**
    - Identify **key tasks** required for this project.
    - Categorize each task into a **task type** (e.g., "UI/UX", "Frontend", "Backend", "Database", "AI/ML","DevOps","QA").
    - Assign **one** designation per task. **Only use the following exact values:**
      - "Junior Developer"
      - "Mid Developer"
      - "Senior Developer"
    - Ensure **detailed and relevant** task descriptions.
    - Assign a **due date** for each task, ensuring:
      - Due dates are evenly distributed between `{startdate}` and `{enddate}`.
      - Dates are in the format **YYYY-MM-DD**.

    ### **Expected JSON Output Format:**
    ```json
    {{
        "tasklist": [
            "Task 1 description",
            "Task 2 description"
        ],
        "tasktypelist": [
            "Category 1",
            "Category 2"
        ],
        "designationlist": [
            "Senior Developer",
            "Junior Developer"
        ],
        "duedatelist": [
            "YYYY-MM-DD",
            "YYYY-MM-DD"
        ]
    }}
    ```
    ### **Rules to Avoid Similar Tasks:**
    1. If the project is **small (single-page or basic functionality)**:  
        - **Allow only one** frontend-related task.  
        - **Avoid redundant backend tasks**.  
    2. If the project is **large (full-stack, multiple features, API integrations)**:  
        - Allow multiple frontend/backend tasks **but ensure different sub-tasks**  
        (e.g., "Frontend UI Design", "Frontend API Integration").  
    3. Ensure **task descriptions are unique** and do not repeat the same responsibilities.  


    **Rules:**
    - The **tasklist, tasktypelist, designationlist, and duedatelist must have the same length**.
    - The **designationlist must contain only one of the three allowed values** ("Junior Developer", "Mid Developer", "Senior Developer").
    - Ensure the JSON is **valid and contains no extra text**.
    - Do NOT include placeholder values like "Task 1"—provide real, meaningful tasks.

    **Return only the JSON object—do not include any other text.**
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        output = response.text.strip()

        print("Raw Gemini API output:", output)  # Debugging

        json_match = re.search(r"\{.*\}", output, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                data = json.loads(json_str)
                tasklist = data.get("tasklist", [])
                tasktypelist = data.get("tasktypelist", [])
                designationlist = data.get("designationlist", [])
                duedatelist = data.get("duedatelist", [])

                # Map designations to match CustomUser model format
                designation_mapping = {
                    "Junior Developer": "junior_developer",
                    "Mid Developer": "mid_developer",
                    "Senior Developer": "senior_developer"
                }
                
                # Convert designations and validate
                allowed_designations = {"junior_developer", "mid_developer", "senior_developer"}
                designationlist = [
                    designation_mapping.get(d, "junior_developer")  # Default to junior
                    for d in designationlist
                ]

                # Convert due dates to Date format
                duedatelist = [datetime.strptime(d, "%Y-%m-%d").date() for d in duedatelist]

                return tasklist, tasktypelist, designationlist, duedatelist
            except json.JSONDecodeError as e:
                print("Error parsing JSON:", e)
                return [], [], [], []
        else:
            print("Error: Failed to extract JSON from response.")
            return [], [], [], []
    except Exception as e:
        print("Error in Gemini API call:", e)
        return [], [], [], []

# Get all projects
@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

# Add a new project
@api_view(['POST'])
def add_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Generate and assign tasks based on project description
@api_view(['GET'])
def segregate_tasks(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    tasklist, tasktypelist, designationlist, duedatelist = get_gemini_tasks(
        project.description, project.startdate, project.enddate
    )

    if not tasklist or not tasktypelist or not designationlist or not duedatelist or len(tasklist) != len(tasktypelist) or len(tasklist) != len(designationlist) or len(tasklist) != len(duedatelist):
        return Response({"error": "Failed to generate tasks"}, status=status.HTTP_400_BAD_REQUEST)

    for title, tasktype, designation, duedate in zip(tasklist, tasktypelist, designationlist, duedatelist):
        task_instance, created = Task.objects.get_or_create(
            title=title,
            status='Pending',
            description=f"Category: {tasktype}",
            designation=designation,
            duedate=duedate
        )

        project.tasks.add(task_instance)

    project.save()
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)

class TeamFormationView(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        tasks = project.tasks.all()
        available_users = CustomUser.objects.filter(status="free")

        assigned_users = []
        team_members = []
        unassigned_tasks = []

        for task in tasks:
            task_assigned = False
            for user in available_users:
                # Skip if any required field is missing
                if not user.skill or not task.description or not task.designation:
                    continue

                # Normalize values for comparison
                task_type = task.description.replace("Category: ", "").strip().lower()
                user_skill = user.skill.lower()
                task_designation = task.designation.lower()
                user_designation = user.designation.lower()

                # Check for matches
                skill_match = task_type in user_skill
                designation_match = task_designation == user_designation

                if skill_match and designation_match:
                    # Create team member
                    team_member, _ = TeamMember.objects.get_or_create(
                        name=user.username,
                        skill=user.skill,
                        status="busy"
                    )

                    # Assign to project
                    project.teammembers.add(team_member)
                    team_members.append(team_member)
                    
                    # Update user status
                    assigned_users.append(user)
                    user.status = "busy"
                    user.save()

                    # Assign task to the team member
                    task.assigned_to = team_member
                    task.save()

                    task_assigned = True
                    break  # Assign one user per task

            if not task_assigned:
                unassigned_tasks.append(task.title)

        project.save()

        return Response({
            "message": "Teams successfully formed!",
            "assigned_users": [u.username for u in assigned_users],
            "team_members": [m.name for m in team_members],
            "unassigned_tasks": unassigned_tasks
        }, status=status.HTTP_200_OK)

class EmployeeTasksView(APIView):
    def get(self, request):
        # Get the username from request header or from authenticated user
        username = request.headers.get('X-Username')
        
        if not username and request.user.is_authenticated:
            username = request.user.username
            
        print(f"Getting tasks for user: {username}")
        
        if not username:
            return Response({"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find team members with this user's name
        team_members = TeamMember.objects.filter(name=username)
        
        if not team_members.exists():
            return Response({"message": "No tasks assigned", "projects": []}, status=status.HTTP_200_OK)
        
        # Get all projects where this employee is a team member
        projects_data = []
        
        for team_member in team_members:
            # Get projects for this team member
            projects = Project.objects.filter(teammembers=team_member)
            
            for project in projects:
                # Get tasks assigned to this team member in this project
                tasks = Task.objects.filter(assigned_to=team_member, projects=project)
                
                if tasks.exists():
                    # Serialize tasks
                    tasks_data = []
                    for task in tasks:
                        # In the EmployeeTasksView class, update the tasks_data.append() call:
                        tasks_data.append({
                            "id": task.id,
                            "title": task.title,
                            "status": task.status,
                            "description": task.description,
                            "designation": task.designation,
                            "duedate": task.duedate,
                            "tasktype": task.tasktype  # Add this line
                        })
                    
                    # Add project with its tasks
                    projects_data.append({
                        "id": project.id,
                        "name": project.name,
                        "tasks": tasks_data
                    })
        
        return Response({"projects": projects_data}, status=status.HTTP_200_OK)

# Look for a view that handles task status updates
# It might look something like this:
# Update the view to use AllowAny permission class temporarily
from rest_framework.permissions import AllowAny, IsAuthenticated

@api_view(['PUT'])
@permission_classes([AllowAny])  # Keep this as AllowAny for now
def update_task_status(request, task_id):
    # Add debugging
    print(f"Received request to update task {task_id} status")
    print(f"Request headers: {request.headers}")
    print(f"Request data: {request.data}")
    
    try:
        task = Task.objects.get(pk=task_id)
        print(f"Found task: {task.title}")
        
        # Get the new status from the request
        new_status = request.data.get('status')
        if not new_status:
            print("No status provided in request")
            return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        print(f"Updating task status from '{task.status}' to '{new_status}'")
        
        # Update the task status
        task.status = new_status
        task.save()
        
        # Return the updated task
        serializer = TaskSerializer(task)
        print("Task status updated successfully")
        return Response({
            'message': 'Task status updated successfully',
            'task': serializer.data
        }, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        print(f"Task with ID {task_id} not found")
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating task status: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Add this at the end of your views.py file
@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connection successful"}, status=status.HTTP_200_OK)