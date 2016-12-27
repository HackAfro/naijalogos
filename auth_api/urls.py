from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from .api import LoginView, LogOutView, UserViewSet

router = DefaultRouter()
router.register(r'accounts', UserViewSet)
urlpatterns = [
    url(r'', include(router.urls)),
    url(r'login/$', LoginView.as_view()),
    url(r'logout/$', LogOutView.as_view())
]