from django.db import models
from django.contrib.auth.models import User


class Imprest(models.Model):
    raised_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    amount = models.PositiveIntegerField()
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return 'Raised by: {}'.format(self.raised_by)


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
    prepared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return 'Vendor: {}'.format(self.vendor_name)