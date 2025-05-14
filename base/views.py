from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'base/home.html')


def loginPage(request):
    return render(request, 'base/login.html')

def signupPage(request):
    return render(request, 'base/signup.html')

def signupAdminPage(request):
    return render(request, 'base/signupAdmin.html')

def signupUserPage(request):
    return render(request, 'base/signupUser.html')