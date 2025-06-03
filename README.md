# Jobify - Job Search Platform


## 🚀 Project Idea
Jobify is a web-based job search platform that connects job seekers with employers. It allows users to:
- Browse available job listings
- Apply for jobs
- Track applied positions
- Filter jobs by company, title, experience level, and salary range

Employers can post job listings and manage applications.

## ✨ Key Features

### For Job Seekers
- 🔍 Advanced job search with filters
- 📁 Job application management
- 🔔 View application status
- 📊 Personalized dashboard

### For Employers
- ➕ Post new job listings
- 🗂️ Manage job postings

## 🛠️ Technologies Used
### Frontend
- **HTML5** - Page structure
- **CSS3** - Styling and layout
- **JavaScript** - Dynamic interactions
- **Django Templates** - Server-side rendering

### Backend
- **Python** - Core programming language
- **Django** - Web framework
- **Django ORM** - Database operations
- **SQLite** - Development database (can be configured for PostgreSQL/MySQL in production)


## 🏗️ Project Structure

jobify/
├── base/ # Main Django app
│ ├── templates/ # HTML templates
│ ├── static/ # CSS, JS, images
│ ├── models.py # Database models
│ ├── views.py # Business logic
│ └── urls.py # URL routing
├── jobify/ # Project config
│ ├── settings.py # Django settings
│ └── urls.py # Main URLs
├── requirements.txt # Python dependencies
└── README.md # This file
