from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.get_projects, name='get_projects'),
    path('projects/add/', views.add_project, name='add_project'),
    path('projects/<int:project_id>/segregate_tasks/', views.segregate_tasks, name='segregate_tasks'),
    path('projects/<int:project_id>/team_formation/', views.TeamFormationView.as_view(), name='team_formation'),
    path('employee/tasks/', views.EmployeeTasksView.as_view(), name='employee_tasks'),
    # Make sure this URL pattern exists and is correctly defined
    path('tasks/<int:task_id>/update-status/', views.update_task_status, name='update_task_status'),
]