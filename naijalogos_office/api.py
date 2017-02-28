import requests 
import socket
import json

from pusher import Pusher
from datetime import datetime

from rest_framework import status
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import viewsets

from stored_messages.api  import add_message_for
from stored_messages.models import MessageArchive, Message

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Imprest, VendorRemittance, BillboardTracker, JobTracker, Account, Credit, Remark, Billboard, Vendor
from .serializers import VendorRemittanceSerializer, ImprestSerializer, BoardSerializer, BillboardSerializer, RemarkSerializer, ArchiveSerializer, JobSerializer, AccountSerializer,  CreditSerializer, VendorSerializer

from webpush import send_notification_to_user

pusher = Pusher(app_id=settings.PUSHER_APP_ID,
                        key=settings.PUSHER_KEY,
                        secret=settings.PUSHER_SECRET)


class ImprestViewSet(ModelViewSet):
    queryset = Imprest.objects.all()
    serializer_class = ImprestSerializer
    permission_classes = permissions.IsAuthenticated,

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = request.data
        israel = User.objects.get(username='israel')
        payload = {"head":"{} raised an Imprest".format(request.user.username.capitalize()),"body": "{} {} N{}".format(data['description'].capitalize(),'\n',data['amount']),"tag":"created"}
       
        send_notification_to_user(user=israel, payload=json.dumps(payload), ttl=100000)
        
        try:
            if request.user != israel:
                pusher.trigger([u'{}_inbox'.format('israel'),u'{}_inbox'.format('lydia'),u'aba_inbox'],u'update',{'message':'{} raised an imprest'.format(request.user.username.capitalize())})
        except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ConnectTimeout,requests.exceptions.ReadTimeout) as e:
            pass
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self,request, pk=None):
        imprest = get_object_or_404(self.queryset,pk=pk)
        old_imprest = imprest
        serializer = self.serializer_class(imprest,data=request.data)
        serializer.is_valid(raise_exception=True)
        users = [imprest.user,User.objects.get(username='lydia'),User.objects.get(username='aba')]
        lydia = users[1]
        data = request.data

        if old_imprest.description == data['description'] and int(old_imprest.amount) == int(data['amount']):
            
            tags = {"action":"accepted","actor": request.user.username.capitalize(), "target": imprest.description.capitalize()}
            if users[1] == imprest.user:

                payload1 = {"head":"{} accepted your imprest".format(request.user.username.capitalize()),"body":"{} {} N{}".format(imprest.description.capitalize(),'\n',imprest.amount),"tag":"accepted"}
                send_notification_to_user(user=imprest.user, payload=json.dumps(payload1), ttl=100000)

                try:
                    pusher.trigger(u'lydia_inbox',u'update',{'message':'{} accepted your imprest'.format(request.user.username.capitalize())})
                    pusher.trigger(u'aba_inbox',u'update',{'message':'{} accepted {}\'s imprest'.format(request.user.username.capitalize(),imprest.user.username.capitalize())})
                except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                    pass
                
                add_message_for(users=[lydia],level=3, message_text=" accepted your imprest",date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
                add_message_for(users=[User.objects.get(username="aba")],level=3, message_text="accepted {}'s imprest".format(imprest.user.username.capitalize()),date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))    
            else:
                
                payload1 = {"head":"{} accepted your imprest".format(request.user.username.capitalize()),"body":"{} {} N{}".format(imprest.description.capitalize(),'\n',imprest.amount),"tag":"accepted"}
                send_notification_to_user(user=users[0], payload=json.dumps(payload1), ttl=100000)

                payload = {"head":"{} accepted {}'s imprest".format(request.user.username.capitalize(),imprest.user.username.capitalize()),"body":"{} {} N{}".format(imprest.description.capitalize(),'\n',imprest.amount),"tag":"accepted"}
                send_notification_to_user(user=users[1], payload=json.dumps(payload), ttl=100000)
                send_notification_to_user(user=users[2], payload=json.dumps(payload), ttl=100000)
            
                try:
                    pusher.trigger([u'lydia_inbox',u'aba_inbox'],u'update',{'message':'{} accepted {}\'s imprest'.format(request.user.username.capitalize(),imprest.user.username.capitalize())})
                    pusher.trigger(u'{}_inbox'.format(imprest.user.username),u'update',{'message':'{} accepted your imprest'.format(request.user.username.capitalize())})
                except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                    pass
                
                add_message_for(users=[users[0]],level=3, message_text="accepted your imprest",date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
                add_message_for(users=[lydia,User.objects.get(username="aba")],level=3, message_text="accepted {}'s imprest".format(imprest.user.username.capitalize()),date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))            
        
        else:

            try:
                pusher.trigger(u'{}_inbox'.format(imprest.user.username.capitalize()),u'update',{'message':'{} edited your imprest - {}'.format(request.user.username.capitalize(),data['description'])})
            except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                pass
                        
            tags = {"action":"edited","actor": request.user.username.capitalize(), "target": imprest.description.capitalize()}
            add_message_for(users=[users[0]],level=3, message_text="edited your imprest",date=datetime.now(), extra_tags=json.dumps(tags), url='/office/imprests/{}/'.format(imprest.id))
        
        self.perform_update(serializer)

        if getattr(imprest,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)    

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)


class VendorFormViewSet(ModelViewSet):
    queryset = VendorRemittance.objects.all()
    serializer_class = VendorRemittanceSerializer
    permission_classes = permissions.IsAuthenticated,
    
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        israel = User.objects.get(username='israel')
        aba = User.objects.get(username='aba')

        payload = {"head":"{} created a vendor remittance form for {}".format(request.user.username.capitalize(),request.data['vendor_name']),"body":"{}".format(request.data['job_description']),"tag":"created"}
        send_notification_to_user(user=israel, payload=json.dumps(payload), ttl=100000)
        send_notification_to_user(user=aba, payload=json.dumps(payload), ttl=100000)

        try:
            pusher.trigger([u'israel_inbox',u'aba_inbox'],u'update',{'message':'{} created a new vendor remittance form for - {}'.format(request.user.username.capitalize(), request.data['vendor_name'].capitalize())})
        except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
            pass
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self,request, pk=None):

        vendor = get_object_or_404(self.queryset,pk=pk)
        serializer = self.serializer_class(vendor,data=request.data)
        serializer.is_valid(raise_exception=True)
        users = [User.objects.get(username='lydia'),User.objects.get(username='aba')]
        self.perform_update(serializer)

        if request.data['is_approved'] != vendor.is_approved:
            
            if vendor.user == users[0]:

                payload = {"head":"{} accepted a vendor remittance form for {}".format(request.user.username.capitalize(),request.data['vendor_name']),"body":"{}".format(request.data['job_description']),"tag":"created"}
                send_notification_to_user(user=users[1], payload=json.dumps(payload), ttl=100000)

                try:
                    pusher.trigger(u'aba_inbox',u'update',{'message':'{} approved a vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
                    pusher.trigger(u'{}_inbox'.format(vendor.user.username.capitalize()),u'update',{'message':'{} appproved your vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
                except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                    pass
            
                tags = {"action":"accepted","actor": request.user.username, "target": vendor.vendor_name}
        
                add_message_for(users=[users[1]],level=3, message_text="approved a vendor remittance form for", extra_tags=json.dumps(tags), date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))            
                add_message_for(users=[users[0]],level=3, message_text="approved your vendor remittance form for",extra_tags=json.dumps(tags), date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))
        
            else:

                payload = {"head":"{} accepted a vendor remittance form for {}".format(request.user.username.capitalize(),request.data['vendor_name']),"body":"{}".format(request.data['job_description']),"tag":"created"}
                send_notification_to_user(user=users[1], payload=json.dumps(payload), ttl=100000)

                try:
                    pusher.trigger(u'aba_inbox',u'update',{'message':'{} approved vendor remittance form for - {}'.format(request.user.username.capitalize(),vendor.vendor_name.capitalize())})
                except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                    pass
            
                tags = {"action":"accepted","actor": request.user.username.capitalize(), "target": vendor.vendor_name}
                add_message_for(users=[users[1]],level=3, message_text="approved a vendor remittance form for", extra_tags=json.dumps(tags),date=datetime.now(),url='/office/vendors/{}/'.format(vendor.id))

        if getattr(vendor,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data) 

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)


class LeaseViewSet(ModelViewSet):
    queryset = BillboardTracker.objects.all()
    serializer_class = BillboardSerializer
    permission_classes = permissions.IsAuthenticated,

    def list(self,request):
        leases = BillboardTracker.objects.filter(start_date__lte=datetime.now())
        serializer = self.serializer_class(leases,many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save(contact_person=self.request.user)


class BillboardViewSet(ModelViewSet):
    queryset = Billboard.objects.all()
    serializer_class = BoardSerializer
    permission_classes = permissions.IsAuthenticated,


class ArchiveViewSet(viewsets.ViewSet):
    queryset = MessageArchive.objects.all()
    permission_classes = permissions.IsAuthenticated,

    def list(self,request):
        messages = MessageArchive.objects.filter(user=request.user)
        serializer = ArchiveSerializer(messages,many=True)
        return Response(serializer.data)


class JobViewSet(ModelViewSet):
    queryset = JobTracker.objects.all()
    serializer_class = JobSerializer
    permission_classes = permissions.IsAuthenticated,
    
    def create(self, request, *args, **kwargs):
        data = request.data 
        print(data)
        if int(data['percentage']) == 100:
            data['is_complete'] = True
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        users = ['israel','afro','lydia','andre','paul','aba']
        
        try:
            pusher.trigger([u'{}_inbox'.format(user) for user in users],u'update',{'message':'{} started a job for {}'.format(data['handler'].capitalize(), request.data['client_name'].capitalize())})
        except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
            pass
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None):
        job = get_object_or_404(self.queryset,pk=pk)
        data = request.data 
        users = ['israel','afro','lydia','andre','paul','aba']

        if int(data['percentage']) == 100:
            data['is_complete'] = True
            
            try:
                 pusher.trigger([u'{}_inbox'.format(user) for user in users],u'update',{'message':'{} completed a job for {}'.format(data['handler'].capitalize(), request.data['client_name'].capitalize())})
            except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                pass

            tags = {"action":"completed","actor": job.handler.capitalize(), "target": job.client_name.capitalize()}
            add_message_for(users=User.objects.all(),level=3, message_text="completed a job for", extra_tags=json.dumps(tags),date=datetime.now(),url='/office/jobs/{}/'.format(job.id))
        else:
            data['is_complete'] = False

        serializer = self.serializer_class(job,data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(job,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = permissions.IsAuthenticated,

    def update(self,request,pk=None):
        balance = get_object_or_404(self.queryset,pk=pk)
        data = request.data
        users = [User.objects.get(username='lydia'),User.objects.get(username='aba'),User.objects.get(username='israel')]
        inboxes = ['israel','lydia','aba']
        
        if int(data['balance']) == 1000:
            tags = {"action":"balance","actor": 'The'}
            add_message_for(users=users,level=3,message_text='current available balance is {}'.format(data['balance']), extra_tags=json.dumps(tags),date=datetime.now(),url='/office/balance/1/')
            
            try:
                 pusher.trigger([u'{}_inbox'.format(inbox) for inbox in inboxes],u'update',{'The current available balance is {}'.format(data['balance'])})
            except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                pass
            
        elif int(data['balance'] < 1000):
            tags = {"action":"balance","actor": 'The'}
            add_message_for(users=users,level=3,message_text='current available balance is lower than 1000', extra_tags=json.dumps(tags),date=datetime.now(),url='/office/balance/1/')
        
            try:
                 pusher.trigger([u'{}_inbox'.format(inbox) for inbox in inboxes],u'update',{'The current available balance is lower than 1000'})
            except (socket.gaierror,requests.exceptions.ConnectionError,requests.exceptions.ReadTimeout,requests.exceptions.ConnectTimeout) as e:
                pass
            
        serializer = self.serializer_class(balance,data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(balance,  '_prefetched_objects_cache',None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)     
                

class CreditViewSet(ModelViewSet):
    queryset = Credit.objects.all()
    serializer_class = CreditSerializer
    permission_classes = permissions.IsAuthenticated,


class RemarkViewSet(ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer
    permission_classes = permissions.IsAuthenticated,


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = permissions.IsAuthenticated,