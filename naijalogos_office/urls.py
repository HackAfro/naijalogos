from rest_framework.routers import DefaultRouter
from django.conf.urls import url, include

from .api import VendorFormViewSet, VendorViewSet, ImprestViewSet, BillboardViewSet, ArchiveViewSet, JobViewSet, AccountViewSet, CreditViewSet, RemarkViewSet, LeaseViewSet

router = DefaultRouter()
router.register(r'vendors', VendorFormViewSet)
router.register(r'imprests', ImprestViewSet)
router.register(r'billboards', BillboardViewSet)
router.register(r'messages',ArchiveViewSet)
router.register(r'jobs',JobViewSet)
router.register(r'credits',CreditViewSet)
router.register(r'balance',AccountViewSet)
router.register(r'remarks',RemarkViewSet)
router.register(r'leases',LeaseViewSet)
router.register(r'vendor',VendorViewSet)  

urlpatterns = router.urls