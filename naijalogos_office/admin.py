from django.contrib import admin
from .models import Imprest, VendorRemittance, BillboardTracker,Account,Billboard,JobTracker,Credit

# Register your models here.
admin.site.register(Imprest)
admin.site.register(VendorRemittance)
admin.site.register(BillboardTracker)
admin.site.register(Account)
admin.site.register(Billboard)
admin.site.register(JobTracker)
admin.site.register(Credit)

