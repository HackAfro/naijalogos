from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from stream_django.feed_manager import feed_manager
from stream_django.enrich import Enrich

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .models import Imprest, VendorRemittance, BillboardTracker
from .serializers import VendorRemittanceSerializer, ImprestSerializer, BillboardSerializer


class ImprestViewSet(ModelViewSet):
    queryset = Imprest.objects.all()
    serializer_class = ImprestSerializer
    permission_classes = permissions.IsAuthenticated,

    @staticmethod
    def get_serialized_object_or_str(obj):
        if hasattr(obj, 'activity_object_serializer_class'):
            obj = obj.activity_object_serializer_class(obj).data
        else:
            obj = str(obj)  # Could also raise exception here
        return obj

    def serialize_activities(self, activities):
        for activity in activities:
            for a in activity['activities']:
                a['object'] = self.get_serialized_object_or_str(a['object'])
            # The actor is always a auth.User in our case
                a['actor'] = UserSerializer(a['actor']).data
        return activities

    def get(self,request,format=None):
        user = request.user
        enricher = Enrich()
        feed = feed_manager.get_notification_feed(user.id)
        notifications = feed.get(limit=5)['results']
        enriched_activities = enricher.enrich_aggregated_activities(notifications)
        serialized_activities = self.serialize_activities(enriched_activities)
        return Response(serialized_activities)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)




class VendorViewSet(ModelViewSet):
    queryset = VendorRemittance.objects.all()
    serializer_class = VendorRemittanceSerializer
    permission_classes = permissions.IsAuthenticated,

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)


class BillboardViewSet(ModelViewSet):
    """docstring for BillboardViewSet"""
    queryset = BillboardTracker.objects.all()
    serializer_class = BillboardSerializer
    permission_classes = permissions.IsAuthenticated,

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),
        return permissions.IsAuthenticated(),

    def perform_create(self, serializer):
        instance = serializer.save(contact_person=self.request.user)
        