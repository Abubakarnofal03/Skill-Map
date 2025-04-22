from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()  # This will get your CustomUser model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'skill', 'designation', 'status')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Make sure we're using create_user to properly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            skill=validated_data.get('skill', ''),  
            designation=validated_data.get('designation', ''),
            status=validated_data.get('status', 'free')  
        )
        return user
