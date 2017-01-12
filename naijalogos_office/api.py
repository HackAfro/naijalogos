from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from stored_messages.api  import add_message_for
from django.conf import settings
from rest_framework import status

from django.contrib.auth.models import User
from stored_messages.models import MessageArchive, Message
from datetime import datetime
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .models import Imprest, VendorRemittance, BillboardTracker
from .serializers import VendorRemittanceSerializer, ImprestSerializer, BillboardSerializer, ArchiveSerializer

from rest_framework import viewsets
import json
from pusher import Pusher

class ImprestViewSet(ModelViewSet):
    queryset = Imprest.objects.all()
    serializer_class = ImprestSerializer
    permission_classes = permissions.IsAuthenticated,
    pusher = Pusher(app_id=settings.PUSHER_APP_ID,
                        key=settings.PUSHER_KEY,
                        secret=settings.PUSHER_SECRET)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        self.pusher.trigger([u'{}_inbox'.format('israel'),u'{}_inbox'.format('lydia')],u'update',{'message':'{} raised an imprest'.format(request.user.username.capitalize())})
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self,request, pk=None):
        imprest = get_object_or_404(self.queryset,pk=pk)
        serializer = self.serializer_class(imprest,data=request.data)
        serializer.is_valid(raise_exception=True)
        users = [imprest.user,User.objects.get(username='lydia')]
        lydia = users[1]
        data = request.data


        if imprest.description == data['description'] and int(imprest.amount) == int(data['amount']):
            
            tags = {"action":"accepted","actor": request.user.username.capitalize(), "target": imprest.description.capitalize()}
            if users[1] == imprest.user:
                self.pusher.trigger(u'lydia_inbox',u'update',{'message':'{} accepted your imprest'.format(request.user.username.capitalize())})
                self.pusher.trigger(u'aba_inbox',u'update',{'message':'{} accepted {}\'s imprest'.format(request.user.username.capitalize(),imprest.user.username.capitalize())})
                add_message_for(users=[lydia],level=3, message_text=" accepted your imprest",date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
                add_message_for(users=[User.objects.get(username="aba")],level=3, message_text="accepted {}'s imprest".format(imprest.user.capitalize()),date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))    
            else:
                self.pusher.trigger(u'{}_inbox'.format(imprest.user.username),u'update',{'message':'{} accepted your imprest'.format(request.user.username.capitalize())})
                add_message_for(users=[users[0]],level=3, message_text="accepted your imprest".format(request.user, imprest.description),date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
                self.pusher.trigger([u'lydia_inbox',u'aba_inbox'],u'update',{'message':'{} accepted {}\'s imprest'.format(request.user.username.capitalize(),imprest.user.username.capitalize())})
                add_message_for(users=[lydia,User.objects.get(username="aba")],level=3, message_text="accepted {}'s imprest".format(imprest.user.capitalize()),date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))            
        
        else:
            
            self.pusher.trigger(u'{}_inbox'.format(imprest.user.username),u'update',{'message':'{} edited your imprest - {}'.format(request.user.username.capitalize(),data['description'])})
            tags = {"action":"edited","actor": request.user.username.capitalize(), "target": imprest.description.capitalize()}
            add_message_for(users=[users[0]],level=3, message_text="edited your imprest",date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
        
        self.perform_update(serializer)

        if getattr(imprest,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)    

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)


class VendorViewSet(ModelViewSet):
    queryset = VendorRemittance.objects.all()
    serializer_class = VendorRemittanceSerializer
    permission_classes = permissions.IsAuthenticated,
    pusher = Pusher(app_id=settings.PUSHER_APP_ID,
                        key=settings.PUSHER_KEY,
                        secret=settings.PUSHER_SECRET)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        self.pusher.trigger([u'israel_inbox',u'aba_inbox'],u'update',{'message':'{} created a new vendor remittance form for - {}'.format(request.user.username.capitalize(), request.data['vendor_name'].capitalize())})
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self,request, pk=None):

        vendor = get_object_or_404(self.queryset,pk=pk)
        serializer = self.serializer_class(vendor,data=request.data)
        serializer.is_valid(raise_exception=True)
        users = [User.objects.get(username='lydia'),User.objects.get(username='aba')]

        if vendor.user == users[0]:

            self.pusher.trigger(u'{}_inbox'.format(vendor.user.username.capitalize()),u'update',{'message':'{} appproved your vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
            tags = {"action":"accepted","actor": request.user.username, "target": vendor.vendor_name}
            self.pusher.trigger(u'aba_inbox',u'update',{'message':'{} approved a vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
            add_message_for(users=[users[1]],level=3, message_text="approved a vendor remittance form for", extra_tags=json.dumps(tags), date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))            
            add_message_for(users=[users[0]],level=3, message_text="approved your vendor remittance form for",extra_tags=json.dumps(tags), date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))
        
        else:

            self.pusher.trigger(u'aba_inbox',u'update',{'message':'{} approved vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
            tags = {"action":"accepted","actor": request.user.username, "target": vendor.vendor_name}
            add_message_for(users=[users[1]],level=3, message_text="approved a vendor remittance form for", extra_tags=json.dumps(tags),date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))
        
        self.perform_update(serializer)

        if getattr(vendor,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data) 

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)


class BillboardViewSet(ModelViewSet):
    """docstring for BillboardViewSet"""
    queryset = BillboardTracker.objects.all()

    serializer_class = BillboardSerializer
    permission_classes = permissions.IsAuthenticated,


    def perform_create(self, serializer):
        instance = serializer.save(contact_person=self.request.user)
        

class ArchiveViewSet(viewsets.ViewSet):
    queryset = MessageArchive.objects.all()
    permission_classes = permissions.IsAuthenticated,


    def list(self,request):
        messages = MessageArchive.objects.filter(user=request.user)
        serializer = ArchiveSerializer(messages,many=True)
        return Response(serializer.data)

    