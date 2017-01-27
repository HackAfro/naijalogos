from django.db import models
from django.contrib.auth.models import User
from stored_messages.api import add_message_for
from datetime import datetime
from django.db.models.signals import post_save
import json


class Account(models.Model):
    balance = models.PositiveIntegerField()

    def __str__(self):
        return '{}'.format(self.balance)


class Credit(models.Model):

    amount = models.PositiveIntegerField()
    description = models.TextField()
    deposit_date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return '{} - {}'.format(self.description,self.amount)

    
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


class Billboard(models.Model):
    location = models.CharField(max_length=100)
    is_leased = models.BooleanField(default=False)
   
    def __str__(self):
        return '{} - {}'.format(self.location, self.is_leased) 


class BillboardTracker(models.Model):
    """docstring for BillboardTracker"""
    client_name = models.CharField(max_length=400)
    start_date = models.DateField()
    duration = models.PositiveIntegerField()
    agent = models.CharField(max_length=50)
    location = models.ForeignKey(Billboard,related_name='lease_info')
    amount_due = models.PositiveIntegerField()
    amount_paid = models.PositiveIntegerField()
    balance = models.PositiveIntegerField()
    expiry_date = models.DateField()
    client_mobile = models.CharField(max_length=15)
    contact_person = models.ForeignKey(User, on_delete=models.CASCADE)
       
    @property
    def started(self):
        today = str(datetime.date.today())
        start_date = str(self.start_date)
    
        if today == start_date:
            return True
        return False

    def __str__(self):
        return '{} - {}'.format(self.client_name, self.location) 
  
class JobTracker(models.Model):

    handler = models.CharField(max_length=50)
    job_description = models.TextField()
    percentage = models.PositiveIntegerField()
    amount_due = models.PositiveIntegerField()
    amount_paid = models.PositiveIntegerField()
    balance = models.PositiveIntegerField()
    client_name = models.CharField(max_length=100)
    client_no = models.CharField(max_length=15)
    client_contact_person = models.CharField(max_length=100)
    is_complete = models.BooleanField(default=False)
    created_at = models.DateField()

    def __str__(self):
        return '{} - {}%'.format(self.job_description, self.percentage)    


class Remark(models.Model):

    job = models.ForeignKey(JobTracker, related_name='remarks')
    comment = models.TextField()
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return '{} - {}'.format(self.job, self.comment)
                      

def my_handler(sender,instance,created,**kwargs):
    if created:
        tags = {"action":"created", "actor": instance.user.username.capitalize(), "target": instance.description.capitalize(), }
        users = [User.objects.get(username='israel'),User.objects.get(username='lydia'),User.objects.get(username='aba')]
        if users[1] is instance.user:
            add_message_for(users=[users[0],users[2]], level=3, message_text='raised an imprest', extra_tags=json.dumps(tags), date=datetime.now(), url="/office/imprests/{}/".format(instance.id))
        elif users[0] is instance.user:
            add_message_for(users=users[1:], level=3, message_text='raised an imprest', extra_tags=json.dumps(tags), date=datetime.now(), url="/office/imprests/{}/".format(instance.id))     
        else:
            add_message_for(users=users, level=3, message_text='raised an imprest', extra_tags=json.dumps(tags), date=datetime.now(), url="/office/imprests/{}/".format(instance.id))
            
        

def notify_vendor(sender,instance,created,**kwargs):
    tags = {"action":"created","actor": instance.user.username.capitalize(), "target": instance.vendor_name.capitalize()}
    if created:
        users = [User.objects.get(username='israel'),User.objects.get(username='aba')]
        add_message_for(users=users,level=3,message_text='created a vendor remittance form for', extra_tags=json.dumps(tags),date=datetime.now(), url="/office/vendors/{}/".format(instance.id))

def new_job(sender,instance,created,**kwargs):
    tags = {"action":"started","actor": instance.handler.capitalize(), "target": instance.client_name.capitalize()}

    if created:
        add_message_for(users=User.objects.all(),level=3,message_text="started a job for", extra_tags=json.dumps(tags),date=datetime.now(),url='/office/jobs/{}/'.format(instance.id) )

post_save.connect(my_handler, sender=Imprest) 
post_save.connect(notify_vendor,sender=VendorRemittance)
post_save.connect(new_job,sender=JobTracker)