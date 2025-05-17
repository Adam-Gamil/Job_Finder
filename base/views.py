from django.shortcuts import render,redirect
from django.contrib import messages
from .models import User,Job, JobApplication
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

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


@login_required(login_url='login')
def searchJob(request):
    return render(request, 'base/searchForJob.html')

@login_required(login_url='login')
def viewAllJobs(request):
    all_jobs = Job.objects.all()
    applied_jobs = JobApplication.objects.filter(user=request.user).values_list('job_id', flat=True)
    unapplied_jobs = all_jobs.exclude(id__in=applied_jobs)
    return render(request, 'base/viewAllJobs.html', {'jobs': unapplied_jobs})

@login_required(login_url='login')
def viewAppliedJobs(request):
    applied_jobs = JobApplication.objects.filter(user=request.user)
    return render(request, 'base/viewAppliedJobs.html', {'applied_jobs': applied_jobs})


@login_required(login_url='login')
def apply_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    if Job.status == 'Closed':
        messages.error(request, 'This job is no longer available.')
        return redirect('viewAllJobs')
    # Check if user already applied
    if JobApplication.objects.filter(user=request.user, job=job).exists():
        messages.warning(request, 'You have already applied to this job!')
    else:
        # Create new application
        JobApplication.objects.create(user=request.user, job=job)
        messages.success(request, 'Application submitted successfully!')
    
    return redirect('viewAllJobs')


@login_required(login_url='login')
def withdraw_application(request, application_id):
    application = get_object_or_404(JobApplication, id=application_id, user=request.user)
    if request.method == 'POST':
        application.delete()
        messages.success(request, 'Application withdrawn successfully!')
    return redirect('viewAppliedJobs')