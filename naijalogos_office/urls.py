from rest_framework.routers import DefaultRouter
from django.conf.urls import url, include

from .api import VendorViewSet, ImprestViewSet, BillboardViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'imprests', ImprestViewSet)
router.register(r'billboards', BillboardViewSet)

urlpatterns = router.urls