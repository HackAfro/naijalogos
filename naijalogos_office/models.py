from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from stream_django.activity import Activity
from django.db.models.signals import post_save


class Imprest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    amount = models.PositiveIntegerField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)


    def __str__(self):
        return 'Raised by: {}'.format(self.user)



class VendorRemittance(models.Model, Activity):
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

    @property
    def activity_object_serializer_class(self):
        return VendorRemittanceSerializer

    def __str__(self):
        return 'Vendor: {}'.format(self.vendor_name)

class BillboardTracker(models.Model):
    """docstring for BillboardTracker"""
    client_name = models.CharField(max_length=400)
    entry_date = models.DateTimeField(default=datetime.now)
    duration = models.PositiveIntegerField()
    choices = (
        ('AT', 'Atabong Roundabout'),
        ('AL', 'AfahaUqua(Left)'),
        ('AR', 'AfahaUqua(Right)')
    )
    location = models.CharField(choices=choices, max_length=30)
    amount_due = models.PositiveIntegerField()
    amount_paid = models.PositiveIntegerField()
    balance = models.PositiveIntegerField()
    expiry_date = models.DateField()
    client_mobile = models.PositiveIntegerField()
    contact_person = models.ForeignKey(User, on_delete=models.CASCADE)
    is_expired = models.BooleanField(default=False)

    def __str__(self):
        return '{} - {}'.format(self.client_name, self.location)        

def expire(sender, instance, **kwargs):
        
    if datetime.now == instance.expiry_date:
        instance.is_expired = True
post_save.connect(expire,sender=BillboardTracker)