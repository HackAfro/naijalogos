from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import update_session_auth_hash


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active')

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.save()

        password = validated_data.get('password',None)
        instance.set_password(password)
        instance.save()

        update_session_auth_hash(self.context.get('request'),instance)

        return instance
