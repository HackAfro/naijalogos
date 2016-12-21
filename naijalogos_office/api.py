from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .models import Imprest, VendorRemittance
from .serializers import VendorRemittanceSerializer, ImprestSerializer


class ImprestViewSet(ModelViewSet):
    queryset = Imprest.objects.all()
    serializer_class = ImprestSerializer
    permission_classes = permissions.IsAuthenticated,

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def perform_create(self, serializer):
        instance = serializer.save(raised_by=self.request.user)


class VendorViewSet(ModelViewSet):
    queryset = VendorRemittance.objects.all()
    serializer_class = VendorRemittanceSerializer
    permission_classes = permissions.IsAuthenticated,

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def perform_create(self, serializer):
        instance = serializer.save(prepared_by=self.request.user)