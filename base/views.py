from django.shortcuts import render,redirect
from django.contrib import messages
from .models import User,Job, JobApplication
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required

# Create your views here.
def home(request):
    return render(request, 'base/home.html')


def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username').lower()
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except:
            messages.error(request, 'User does not exist')
            return redirect('login')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if user.is_admin:
                return redirect('adminPage')
            else:
                return redirect('userPage')
        else:
            messages.error(request, 'Username OR Password is incorrect')
    return render(request, 'base/login.html')

def logoutUser(request):
    logout(request)
    return redirect('home')

def signupPage(request):
    return render(request, 'base/signup.html')

def signupAdminPage(request):
    form = CustomUserCreationForm()
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = True
            if not user.company_name:
                messages.error(request, "Company name is required for admin users.")
                return render(request, 'base/signupAdmin.html', {'form': form})
            # username = form.cleaned_data.get('username').lower()
            # user.username = username
            user.save()
            return redirect('login')
        else:
            messages.error(request, 'Error creating account')
    return render(request, 'base/signupAdmin.html',{'form': form})

def signupUserPage(request):
    form = CustomUserCreationForm()
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            username = form.cleaned_data.get('username').lower()
            user.username = username
            user.save()
            return redirect('login')
        else:
            messages.error(request, 'Error creating account')
    return render(request, 'base/signupUser.html',{'form': form})

@login_required(login_url='login')
def adminPage(request):
    return render(request, 'base/adminDashboard.html')

@login_required(login_url='login')
def userPage(request):
    return render(request, 'base/userDashboard.html')