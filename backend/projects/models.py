from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    description = models.TextField()
    designation = models.CharField(max_length=50)
    duedate = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey('TeamMember', on_delete=models.SET_NULL, null=True, blank=True)
    tasktype = models.CharField(max_length=100, null=True, blank=True)  # Add this field for task type

    def __str__(self):
        return self.title
    
class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    skill = models.CharField(max_length=255)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=255)  # Enforce uniqueness
    description = models.TextField()
    type = models.CharField(max_length=255)
    startdate = models.DateField()
    enddate = models.DateField()
    status = models.CharField(max_length=50, default='Pending')
    tasks = models.ManyToManyField(Task, related_name="projects", blank=True)
    teammembers = models.ManyToManyField(TeamMember, related_name="projects", blank=True)
    
    def __str__(self):
        return self.name