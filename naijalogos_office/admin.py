from django.contrib import admin
from .models import Imprest, VendorRemittance, BillboardTracker

# Register your models here.
admin.site.register(Imprest)
admin.site.register(VendorRemittance)
admin.site.register(BillboardTracker)