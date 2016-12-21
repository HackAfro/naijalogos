from django.conf.urls import url

from .api import LoginView, LogOutView

urlpatterns = [
    url(r'login/$', LoginView.as_view()),
    url(r'logout/$', LogOutView.as_view())
]