from django.db import models
from django.contrib.auth.models import User
from stored_messages.api import add_message_for
from datetime import datetime
from django.db.models.signals import post_save
import json


class Imprest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    amount = models.PositiveIntegerField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)


    def __str__(self):
        return 'Raised by: {}'.format(self.user)



class VendorRemittance(models.Model):
    vendor_name = models.CharField(max_length=500)
    bank_name = models.CharField(max_length=500)
    account_details = models.PositiveIntegerField()
    job_description = models.TextField()
    quantity = models.PositiveIntegerField()
    currency = models.CharField(max_length=5)
    amount_due = models.PositiveIntegerField()
    delivery_date = models.DateField()
    current_payment = models.PositiveIntegerField()
    outstanding_balance = models.PositiveIntegerField(null=True,blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return 'Vendor: {}'.format(self.vendor_name)

class BillboardTracker(models.Model):
    """docstring for BillboardTracker"""
    client_name = models.CharField(max_length=400)
    entry_date = models.DateTimeField(default=datetime.now)
    duration = models.PositiveIntegerField()
    choices = (
        ('AT', 'Atabong Roundabout'),
        ('A-UV', 'AfahaUqua(Uqua View)'),
        ('A-MV', 'AfahaUqua(Marina View)')
    )
    location = models.CharField(choices=choices, max_length=30)
    amount_due = models.PositiveIntegerField()
    amount_paid = models.PositiveIntegerField()
    balance = models.PositiveIntegerField()
    expiry_date = models.DateField()
    client_mobile = models.PositiveIntegerField()
    contact_person = models.ForeignKey(User, on_delete=models.CASCADE)
    is_expired = models.BooleanField(default=False)

    @property
    def expire(self):
        if datetime.now() >= self.expiry_date:
            self.is_expired = True
            return True
        return False
        

    def __str__(self):
        return '{} - {}'.format(self.client_name, self.location)        

def my_handler(sender,instance,created,**kwargs):
    if created:
        tags = {"action":"created", "actor": instance.user.username.capitalize(), "target": instance.description.capitalize(), }
        users = [User.objects.get(username='israel'),User.objects.get(username='lydia'),User.objects.get(username='aba')]
        if not users[1] is instance.user:
            add_message_for(users=users, level=3, message_text='raised an imprest', extra_tags=json.dumps(tags), date=datetime.now(), url="/office/imprests/{}/".format(instance.id))
        else:
            add_message_for(users=[users[0]], level=3, message_text='raised an imprest', extra_tags=json.dumps(tags), date=datetime.now(), url="/office/imprests/{}/".format(instance.id))
            
        

def notify_vendor(sender,instance,created,**kwargs):
    tags = {"action":"created","actor": instance.user.username.capitalize(), "target": instance.vendor_name.capitalize()}
    if created:
        users = [User.objects.get(username='israel'),User.objects.get(username='aba')]
        add_message_for(users=users,level=3,message_text='created a vendor remittance form for'.format(instance.user,instance.vendor_name), extra_tags=json.dumps(tags),date=datetime.now(), url="/office/vendors/{}/".format(instance.id))

post_save.connect(my_handler, sender=Imprest) 
post_save.connect(notify_vendor,sender=VendorRemittance)