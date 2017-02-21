from rest_framework import serializers
from auth_api.serializers import UserSerializer
from stored_messages.models import MessageArchive, Message

from .models import Imprest, VendorRemittance, BillboardTracker, Account, JobTracker, Billboard, Credit, Remark, Vendor
from django.contrib.auth.models import User


class AccountSerializer(serializers.ModelSerializer):
    
    class Meta:
        model =  Account
        fields = '__all__'



class ImprestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Imprest
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(ImprestSerializer, self).get_validation_exclusions(instance)

        return exclusions + ['user']


class RemarkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Remark
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    remarks = RemarkSerializer(read_only=True,many=True)

    class Meta:
        model = JobTracker
        fields = '__all__'

class VendSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = '__all__'


class VendorRemittanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = VendorRemittance
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(VendorRemittanceSerializer, self).get_validation_exclusions(instance)
        return exclusions + ['user']



class CreditSerializer(serializers.ModelSerializer):
    deposit_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Credit
        fields = '__all__'
    

class BillboardSerializer(serializers.ModelSerializer):
    contact_person = UserSerializer(read_only=True, required=False)

    class Meta(object):
        model = BillboardTracker
        fields = '__all__'

    def get_validation_exclusions(self, instance=None):
        exclusions = super(BillboardSerializer, self).get_validation_exclusions(instance)
        return exclusions + ['contact_person']
            

class BoardSerializer(serializers.ModelSerializer):
    lease_info = BillboardSerializer(read_only=True,many=True)
    
    class Meta:
        model = Billboard
        fields = '__all__'
    

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__'        


class ArchiveSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    message = MessageSerializer(read_only=True)

    class Meta:
        model = MessageArchive
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = '__all__'
    