from rest_framework import serializers
from auth_api.serializers import UserSerializer

from .models import Imprest, VendorRemittance, BillboardTracker
from django.contrib.auth.models import User


class ImprestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, required=False)

    class Meta:
        model = Imprest
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(ImprestSerializer, self).get_validation_exclusions(instance)

        return exclusions + ['user']

    

class VendorRemittanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, required=False)

    class Meta:
        model = VendorRemittance
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(VendorRemittanceSerializer, self).get_validation_exclusions(instance)
        return exclusions + ['user']


class BillboardSerializer(serializers.ModelSerializer):
    """docstring for BillboardSerializer"""
    contact_person = UserSerializer(read_only=True, required=False)

    class Meta(object):
        """docstring for Meta"""
        model = BillboardTracker
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(BillboardSerializer, self).get_validation_exclusions(instance)
        return exclusions + ['contact_person']
            
        
