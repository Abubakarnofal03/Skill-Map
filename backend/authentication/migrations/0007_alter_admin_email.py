# Generated by Django 5.1.6 on 2025-03-02 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_alter_admin_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='admin',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='Email Address'),
        ),
    ]
