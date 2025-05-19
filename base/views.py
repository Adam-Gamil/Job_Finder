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
    if request.user.is_authenticated:
        messages.info(request, 'You are already logged in')
        if request.user.is_admin:
            return redirect('adminPage')
        else:
            return redirect('userPage')
    # Check if the user is already logged in
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
    if request.user.is_authenticated:
        messages.info(request, 'You are already logged in')
        if request.user.is_admin:
            return redirect('adminPage')
        else:
            return redirect('userPage')
    return render(request, 'base/signup.html')

def signupAdminPage(request):
    if request.user.is_authenticated:
        messages.info(request, 'You are already logged in')
        if request.user.is_admin:
            return redirect('adminPage')
        else:
            return redirect('userPage')
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
    if request.user.is_authenticated:
        messages.info(request, 'You are already logged in')
        if request.user.is_admin:
            return redirect('adminPage')
        else:
            return redirect('userPage')
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
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    return render(request, 'base/adminDashboard.html')

@login_required(login_url='login')
def addJobAdmin(request):
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    
    if request.method == 'POST':
        title = request.POST.get('job-title')
        min_salary = request.POST.get('min_salary')  # Changed from job-salary
        max_salary = request.POST.get('max_salary')  # New field
        min_experience = request.POST.get('min_experience')  # Changed from years_exp
        max_experience = request.POST.get('max_experience')  # New field
        status = request.POST.get('status')
        requirements = request.POST.get('Requirements')
        description = request.POST.get('description')
        location = request.POST.get('Location')

        # Validate all required fields are present
        if not all([title, min_salary, max_salary, min_experience, max_experience, 
                   status, requirements, description, location]):
            messages.error(request, "Please fill out all fields.")
            return render(request, 'base/addJobOpportunity.html')

        try:
            # Convert to integers
            min_salary = int(min_salary)
            max_salary = int(max_salary)
            min_experience = int(min_experience)
            max_experience = int(max_experience)
            
            # Validate ranges
            if min_salary > max_salary:
                messages.error(request, "Minimum salary cannot be greater than maximum salary.")
                return render(request, 'base/addJobOpportunity.html')
                
            if min_experience > max_experience:
                messages.error(request, "Minimum experience cannot be greater than maximum experience.")
                return render(request, 'base/addJobOpportunity.html')

            Job.objects.create(
                employer=request.user,
                title=title,
                description=description,
                min_experience=min_experience,
                max_experience=max_experience,
                min_salary=min_salary,
                max_salary=max_salary,
                requirements=requirements,
                location=location,
                status=status
            )
            messages.success(request, "Job added successfully.")
            return redirect('viewCreatedJobs')
            
        except ValueError:
            messages.error(request, "Please enter valid numbers for salary and experience.")
            return render(request, 'base/addJobOpportunity.html')

    return render(request, 'base/addJobOpportunity.html')

@login_required(login_url='login')
def viewCreatedJobs(request):
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    jobs = Job.objects.filter(employer=request.user).order_by('-datePosted')
    return render(request, 'base/viewCreatedJobs.html', {'jobs': jobs})


@login_required(login_url='login')
def selectAndEditJobs(request):
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
        
    jobs = Job.objects.filter(employer=request.user).order_by('-datePosted')
    selected_job = None
    job_id = request.GET.get('job_id')

    if job_id:
        selected_job = get_object_or_404(Job, id=job_id, employer=request.user)

        if request.method == 'POST':
            try:
                selected_job.title = request.POST.get('title')
                selected_job.min_salary = int(request.POST.get('min_salary'))
                selected_job.max_salary = int(request.POST.get('max_salary'))
                selected_job.min_experience = int(request.POST.get('min_experience'))
                selected_job.max_experience = int(request.POST.get('max_experience'))
                selected_job.status = request.POST.get('status')
                selected_job.requirements = request.POST.get('requirements')
                selected_job.description = request.POST.get('description')
                selected_job.location = request.POST.get('location')
                selected_job.save()
                messages.success(request, 'Job updated successfully!')
            except Exception as e:
                messages.error(request, f'Error updating job: {str(e)}')
            
            return redirect(f"{request.path}?job_id={selected_job.id}")

    return render(request, 'base/selectAndEditJobs.html', {
        'jobs': jobs,
        'selected_job': selected_job
    })

@login_required(login_url='login')
def delete_job(request, job_id):
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    job = get_object_or_404(Job, id=job_id, employer=request.user)
    if request.method == 'POST':
        job.delete()
        messages.success(request, 'Job deleted successfully!')
    return redirect('selectAndEditJobs')

@login_required(login_url='login')
def editAdminJob(request, job_id):
    if not request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    
    job = get_object_or_404(Job, id=job_id, employer=request.user)
    if request.method == 'POST':
        try:
            job.title = request.POST.get('job-title')
            job.min_salary = int(request.POST.get('min_salary'))
            job.max_salary = int(request.POST.get('max_salary'))
            job.min_experience = int(request.POST.get('min_experience'))
            job.max_experience = int(request.POST.get('max_experience'))
            job.status = request.POST.get('status')
            job.requirements = request.POST.get('Requirements')
            job.description = request.POST.get('Description')
            job.location = request.POST.get('Location')
            job.save()
            messages.success(request, 'Job updated successfully!')
            return redirect('viewCreatedJobs')
        except Exception as e:
            messages.error(request, f'Error updating job: {str(e)}')
    
    # Convert values for dropdowns
    experience_range = f"{job.min_experience}-{job.max_experience} years experience"
    salary_range = f"{job.min_salary}${job.max_salary}$"
    
    return render(request, 'base/editAdminJob.html', {
        'job': job,
        'experience_range': experience_range,
        'salary_range': salary_range
    })



@login_required(login_url='login')
def userPage(request):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    return render(request, 'base/userDashboard.html')


@login_required(login_url='login')
def searchJob(request):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    return render(request, 'base/searchForJob.html')

@login_required(login_url='login')
def viewAllJobs(request):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    all_jobs = Job.objects.all()
    applied_jobs = JobApplication.objects.filter(user=request.user).values_list('job_id', flat=True)
    unapplied_jobs = all_jobs.exclude(id__in=applied_jobs)
    return render(request, 'base/viewAllJobs.html', {'jobs': unapplied_jobs})

@login_required(login_url='login')
def viewAppliedJobs(request):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    applied_jobs = JobApplication.objects.filter(user=request.user)
    return render(request, 'base/viewAppliedJobs.html', {'applied_jobs': applied_jobs})


@login_required(login_url='login')
def apply_job(request, job_id):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    job = get_object_or_404(Job, id=job_id)
    
    if job.status == 'Closed':
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
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    application = get_object_or_404(JobApplication, id=application_id, user=request.user)
    if request.method == 'POST':
        application.delete()
        messages.success(request, 'Application withdrawn successfully!')
    return redirect('viewAppliedJobs')


@login_required(login_url='login')
def searchJob(request):
    if request.user.is_admin:
        messages.error(request, "Unauthorized access")
        return redirect('home')
    # Get filter parameters from request
    company_name = request.GET.get('company', '')
    job_title = request.GET.get('title', '')
    min_exp = int(request.GET.get('min_exp', 0))
    max_exp = int(request.GET.get('max_exp', 99))
    min_salary = int(request.GET.get('min_salary', 0))
    max_salary = int(request.GET.get('max_salary', 999999))

    # Start with base queryset
    jobs = Job.objects.filter(
        employer__company_name__icontains=company_name,
        title__icontains=job_title,
    )

    # Filter by experience range (using min_experience/max_experience fields)
    jobs = jobs.filter(
        min_experience__gte=min_exp,
        max_experience__lte=max_exp
    )

    # Filter by salary range (using min_salary/max_salary fields)
    jobs = jobs.filter(
        min_salary__gte=min_salary,
        max_salary__lte=max_salary
    )

    # Exclude already applied jobs
    applied_jobs = JobApplication.objects.filter(user=request.user).values_list('job_id', flat=True)
    jobs = jobs.exclude(id__in=applied_jobs)

    unique_titles = sorted(set(Job.objects.values_list('title', flat=True)))

    context = {
        'jobs': jobs,
        'unique_titles': unique_titles,
    }

    return render(request, 'base/searchForJob.html', context)

def salary_in_range(salary_str, min_salary, max_salary):
    # Helper function to parse salary string and check range
    try:
        # Extract numbers from string like "$90,000 - $110,000"
        numbers = [int(''.join(filter(str.isdigit, s))) for s in salary_str.split('-')]
        avg_salary = sum(numbers) / len(numbers)
        return min_salary <= avg_salary <= max_salary
    except:
        return True