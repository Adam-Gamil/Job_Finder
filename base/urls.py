from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutUser, name='logout'),
    path('signup/', views.signupPage, name='signup'),
    path('signupAdmin/', views.signupAdminPage, name='signupAdmin'),
    path('signupUser/', views.signupUserPage, name='signupUser'),
    path('adminDashboard/', views.adminPage, name='adminPage'),
    path('addJobOpportunity/', views.addJobAdmin, name='addJobAdmin'),
    path('editAdminJob/<int:job_id>/', views.editAdminJob, name='editAdminJob'),
    path('viewCreatedJobs/', views.viewCreatedJobs, name='viewCreatedJobs'),
    path('selectAndEditJobs/', views.selectAndEditJobs, name='selectAndEditJobs'),
    path('delete-job/<int:job_id>/', views.delete_job, name='delete_job'),
    path('userDashboard/', views.userPage, name='userPage'),
    path('searchJob/', views.searchJob, name='searchJob'),
    path('viewAllJobs/', views.viewAllJobs, name='viewAllJobs'),
    path('viewAppliedJobs/', views.viewAppliedJobs, name='viewAppliedJobs'),
    path('apply/<int:job_id>/', views.apply_job, name='apply_job'), 
    path('withdraw/<int:application_id>/', views.withdraw_application, name='withdraw_application'),
]