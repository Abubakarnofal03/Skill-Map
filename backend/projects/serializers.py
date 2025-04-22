# project/serializers.py
from rest_framework import serializers
from .models import Project, Task, TeamMember

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'designation', 'status', 'duedate', 'assigned_to', 'tasktype']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'skill', 'status']

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, required=False)  # ✅ Allow empty tasks
    teammembers = TeamMemberSerializer(many=True, required=False)  # ✅ Allow empty team members

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'type', 'startdate', 'enddate', 'status', 'tasks', 'teammembers']

    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        teammembers_data = validated_data.pop('teammembers', [])
        
        # Create the project instance
        project = Project.objects.create(**validated_data)
        
        # Handle tasks: create or get existing, then link to project
        for task_data in tasks_data:
            task, created = Task.objects.get_or_create(**task_data)
            project.tasks.add(task)
        
        # Handle team members similarly
        for member_data in teammembers_data:
            member, created = TeamMember.objects.get_or_create(**member_data)
            project.teammembers.add(member)
        
        return project
