# Generated by Django 5.1.6 on 2025-03-02 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_alter_project_tasks_alter_project_teammembers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
