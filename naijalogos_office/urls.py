from rest_framework.routers import DefaultRouter

from .api import VendorViewSet, ImprestViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'imprests', ImprestViewSet)


urlpatterns = router.urls
