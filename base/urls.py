from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.loginPage, name='login'),
    path('signup/', views.signupPage, name='signup'),
    path('signupAdmin/', views.signupAdminPage, name='signupAdmin'),
    path('signupUser/', views.signupUserPage, name='signupUser'),
]