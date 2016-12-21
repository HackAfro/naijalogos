from rest_framework import serializers
from auth_api.serializers import UserSerializer

from .models import Imprest, VendorRemittance
from django.contrib.auth.models import User


class ImprestSerializer(serializers.ModelSerializer):
    raised_by = UserSerializer(read_only=True, required=False)

    class Meta:
        model = Imprest
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(ImprestSerializer, self).get_validation_exclusions(instance)

        return exclusions + ['raised_by']


class VendorRemittanceSerializer(serializers.ModelSerializer):
    prepared_by = UserSerializer(read_only=True, required=False)

    class Meta:
        model = VendorRemittance
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(VendorRemittanceSerializer, self).get_validation_exclusions(instance)
        return exclusions + ['prepared_by']
